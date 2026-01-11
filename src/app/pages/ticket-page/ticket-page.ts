import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, of, switchMap } from 'rxjs';
import { Loading } from '../../components/loading/loading';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Category } from '../../models/category.model';
import { Comment, Ticket } from '../../models/ticket.model';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { TicketService } from '../../services/tickets.service';
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
  public ticketId = input<string>();
  public ticket = signal<Ticket | null>(null);
  public ticketForm!: FormGroup;
  public initialStatus = signal<string>('OPEN');
  public priorities = signal<string[]>(['LOW', 'MEDIUM', 'HIGH']);
  public premiumPriorities = signal<string[]>(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
  public categories = signal<Category[]>([]);
  public comments = signal<Comment[]>([]);
  public editMode = signal<boolean>(false);
  public loading = signal<boolean>(false);

  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isPremium = computed<boolean>(() => this.userRole() === 'PREMIUM');
  public isOwner = computed<boolean>(
    () => this.ticket()?.userId === this._authService.getUserInfo().id
  );

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _ticketService: TicketService,
    private _categoryService: CategoryService,
    private _toastService: ToastService,
    private _router: Router
  ) {}

  public ngOnInit(): void {
    console.log(this.ticketId());
    this.initForm();
    this.loadInitialData();
  }

  private loadInitialData(): void {
    if (!this.ticketId()) return;
    const id = this.ticketId();
    forkJoin({
      ticket: this._ticketService.getTicketById(id!),
      comments: this._ticketService.getComments(id!),
      categories: this._categoryService.getCategories(),
    }).subscribe({
      next: (res) => {
        this.ticket.set(res.ticket);
        this.comments.set(res.comments);
        this.categories.set(res.categories);
      },
      error: () => {
        this._toastService.show('error');
        this.loading.set(false);
      },
    });
  }

  private initForm(): void {
    this.ticketForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: [this.initialStatus()],
      file: [null],
    });
  }

  public onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.ticketForm.patchValue({ file });
    }
  }

  private _postTicketOptionalFile(): void {
    this.loading.set(true);
    const fileToUpload = this.ticketForm.get('file')?.value;

    this._ticketService
      .newTicket(this.ticketForm.value)
      .pipe(
        switchMap((ticket) => {
          if (fileToUpload instanceof File) {
            return this._ticketService.newFile(ticket.id.toString(), fileToUpload);
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
    if (!this.ticketId()) return;
    const id = this.ticketId();
    this.loading.set(true);
    this._ticketService.updateTicket(id!, this.ticketForm.value).subscribe({
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
