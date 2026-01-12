import { Component, input, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { Category } from '../../models/category.model';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/tickets.service';
import { ToastService } from '../../services/toast.service';
import { PriorityPipe } from '../../pipes/priority.pipe';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [ReactiveFormsModule, PriorityPipe],
  templateUrl: './ticket-form.html',
})
export class TicketFormComponent {
  public mode = input.required<'create' | 'edit'>();
  public ticket = input<Ticket | null>(null);
  public categories = input<Category[]>([]);
  public isPremium = input<boolean>(false);

  public loading = signal(false);

  public priorities = ['LOW', 'MEDIUM', 'HIGH'];
  public premiumPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private toast: ToastService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.initForm();

    if (this.mode() === 'edit' && this.ticket()) {
      this.prepareEditForm();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['OPEN'],
      file: [null],
    });
  }

  private prepareEditForm(): void {
    this.form.patchValue({
      title: this.ticket()!.title,
      description: this.ticket()!.description,
      priority: this.ticket()!.priority,
      status: this.ticket()!.status,
      categoryId: this.categories().find((c: any) => c.name === this.ticket()!.categoryName)?.id,
    });

    this.form.get('categoryId')?.disable();
    this.form.get('priority')?.disable();
    this.form.get('status')?.disable();
    this.form.get('file')?.disable();
  }

  public onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ file });
    }
  }

  public submit(): void {
    if (this.form.invalid) return;

    this.mode() === 'create' ? this.createTicket() : this.updateTicket();
  }

  private createTicket(): void {
    this.loading.set(true);

    const file = this.form.get('file')?.value;

    this.ticketService
      .newTicket(this.form.value)
      .pipe(
        switchMap((ticket) =>
          file instanceof File ? this.ticketService.newFile(ticket.id.toString(), file) : of(null)
        ),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          this.toast.show('¡Se creó el ticket!', 'success');
          this.router.navigate(['/dashboard/tickets']);
        },
        error: (err) => this.toast.show(err?.error?.message || 'Error al crear ticket', 'error'),
      });
  }

  private updateTicket(): void {
    this.loading.set(true);
    if (!this.ticket()) return;
    const ticketId = this.ticket()!.id.toString();
    this.ticketService
      .updateTicket(ticketId, this.form.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Ticket editado correctamente', 'success');
          this.router.navigate(['/dashboard/tickets']);
        },
        error: (err) => this.toast.show(err?.message || 'Error al editar ticket', 'error'),
      });
  }
}
