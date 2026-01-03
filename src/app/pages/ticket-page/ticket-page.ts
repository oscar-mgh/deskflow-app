import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
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
  imports: [
    DatePipe,
    PriorityPipe,
    ReactiveFormsModule,
    RouterLink,
    StatusBadge,
    TitleCasePipe,
    Loading,
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
      file: [File],
    });

    this._categoryService.getCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  public onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.ticketForm.patchValue({
      file: file,
    });
  }

  private _postTicketOptionalFile(): void {
    this.loading.set(true);
    this._ticketsService
      .newTicket(this.ticketForm.value)
      .pipe(
        switchMap((ticket) => {
          if (this.ticketForm.get('file')?.value) {
            return this._ticketsService.newFile(ticket.id.toString(), this.ticketForm.get('file')?.value);
          }
          return of(ticket);
        })
      )
      .subscribe({
        next: () => {
          this.ticketForm.reset();
          this._toastService.show('Ticket creado correctamente', 'success');
          this._router.navigate(['/dashboard/tickets']);
        },
        error: (error) => {
          console.error(error);
          this._toastService.show(error.error.message, 'error');
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }

  public onSubmit(): void {
    if (this.ticketForm.invalid) return;
    this._postTicketOptionalFile();
  }

  public onEdit(): void {
    this.ticketForm.patchValue({
      title: this.ticketForm.get('title')?.value,
      description: this.ticketForm.get('description')?.value,
    });

    this._ticketsService.updateTicket(this.id(), this.ticketForm.value).subscribe({
      next: () => {
        this._toastService.show('Ticket editado correctamente', 'success');
        this._router.navigate(['/dashboard/tickets']);
      },
      error: (error) => {
        console.error(error);
        this._toastService.show(error.message, 'error');
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
