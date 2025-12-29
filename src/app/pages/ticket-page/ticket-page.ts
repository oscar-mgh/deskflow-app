import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { Category } from '../../models/category.model';
import { Ticket } from '../../models/ticket.model';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { TicketsService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-ticket',
  imports: [ReactiveFormsModule, DatePipe, StatusBadge, PriorityPipe, TitleCasePipe, NgClass],
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
  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isPremium = computed<boolean>(() => this.userRole() === 'PREMIUM');

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _activatedRoute: ActivatedRoute,
    private _ticketsService: TicketsService,
    private _categoryService: CategoryService,
    private _toastService: ToastService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.id.set(params['id']);
    });

    this.ticketForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryName: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: [this.initialStatus()],
      file: [File],
    });

    if (this.id()) {
      this._ticketsService.getTicketById(this.id()).subscribe((data) => {
        this.ticket.set(data);
      });
    } else {
      this.ticket.set(null);
    }

    this._categoryService.getCategories().subscribe((data) => {
      this.categories.set(data);
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.ticketForm.patchValue({
      file: file,
    });
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) return;

    this._ticketsService.newTicket(this.ticketForm.value).subscribe({
      next: () => {
        this.ticketForm.reset();
        this._toastService.show('Ticket creado correctamente', 'success');
        this._router.navigate(['/tickets']);
      },
      error: (error) => {
        console.error(error);
        this._toastService.show(error.error.message, 'error');
      },
    });
  }
}
