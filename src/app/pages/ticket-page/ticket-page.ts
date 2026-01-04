import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { Loading } from '../../components/loading/loading';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Category } from '../../models/category.model';
import { Comment, Ticket } from '../../models/ticket.model';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { TicketsService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    DatePipe,
    Loading,
    PriorityPipe,
    ReactiveFormsModule,
    RouterLink,
    StatusBadge,
    TitleCasePipe,
  ],
  templateUrl: './ticket-page.html',
})
export class TicketPage implements OnInit {
  public id = signal<string>('');
  public ticket = signal<Ticket | null>(null);
  public ticketForm!: FormGroup;
  public initialStatus = signal<string>('OPEN');
  public priorities = signal<string[]>(['LOW', 'MEDIUM', 'HIGH']);
  public premiumPriorities = signal<string[]>(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
  public categories = signal<Category[]>([]);
  public comments = signal<Comment[]>([]);
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isPremium = computed<boolean>(() => this.userRole() === 'PREMIUM');
  public isOwner = computed<boolean>(
    () => this.ticket()?.userId === this._authService.getUserInfo().id
  );
  public editMode = signal<boolean>(false);
  public loading = signal<boolean>(false);

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _ticketsService: TicketsService,
    private _categoryService: CategoryService,
    private _toastService: ToastService,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    this._activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params['id']) {
            this.id.set(params['id']);
            this._ticketsService.getComments(this.id()).subscribe((data) => {
              this.comments.set(data);
            });
            return this._ticketsService.getTicketById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe((data) => {
        this.ticket.set(data);
      });

    this.ticketForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: [this.initialStatus()],
      file: [null],
    });

    this._categoryService.getCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.ticketForm.patchValue({ file });
    }
  }

  private _postTicketOptionalFile(): void {
    this.loading.set(true);
    const fileToUpload = this.ticketForm.get('file')?.value;

    this._ticketsService
      .newTicket(this.ticketForm.value)
      .pipe(
        switchMap((ticket) => {
          if (fileToUpload instanceof File) {
            return this._ticketsService.newFile(ticket.id.toString(), fileToUpload);
          }
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          const msg = $localize`:@@ticket.create.success:¡Se creó el ticket!`;
          this._toastService.show(msg, 'success');
          this._router.navigate(['/dashboard/tickets']);
        },
        error: (err) => {
          const errMsg =
            err.error?.message || $localize`:@@ticket.create.error:Error al crear el ticket`;
          this._toastService.show(errMsg, 'error');
        },
      });
  }

  public onSubmit(): void {
    if (this.ticketForm.invalid) return;
    this._postTicketOptionalFile();
  }

  public onEdit(): void {
    this.loading.set(true);
    this._ticketsService.updateTicket(this.id(), this.ticketForm.value).subscribe({
      next: () => {
        const msg = $localize`:@@ticket.edit.success:Ticket editado correctamente`;
        this._toastService.show(msg, 'success');
        this._router.navigate(['/dashboard/tickets']);
      },
      error: (error) => {
        console.error(error);
        const errMsg = error.message || $localize`:@@ticket.edit.error:Error al editar el ticket`;
        this._toastService.show(errMsg, 'error');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  public setTicketForm(): void {
    this.ticketForm.get('title')?.enable();
    this.ticketForm.get('description')?.enable();
    this.ticketForm.get('categoryId')?.disable();
    this.ticketForm.get('priority')?.disable();
    this.ticketForm.get('status')?.disable();
    this.ticketForm.get('file')?.disable();

    this.ticketForm.patchValue({
      title: this.ticket()?.title,
      description: this.ticket()?.description,
      categoryId: this.categories()?.find(
        (category) => category.name === this.ticket()?.categoryName
      )?.id,
      priority: this.ticket()?.priority,
      status: this.ticket()?.status,
    });
    this.editMode.set(true);
  }
}
