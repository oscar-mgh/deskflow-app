import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { StatusBadge } from '../../components/status-badge/status-badge';
import { PriorityPipe } from '../../pipes/priority.pipe';

export interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  file?: File;
}

@Component({
  selector: 'app-ticket',
  imports: [ReactiveFormsModule, DatePipe, StatusBadge, PriorityPipe, TitleCasePipe],
  templateUrl: './ticket-page.html',
})
export class TicketPage implements OnInit {
  ticketId = signal<string>('');
  ticket = signal<Ticket | undefined>(undefined);
  ticketForm!: FormGroup;

  constructor(private _activatedRoute: ActivatedRoute, private _fb: FormBuilder) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.ticketId.set(params['id']);
    });

    this.ticketForm = this._fb.group({
      ticketId: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      status: ['', [Validators.required]],
      createdAt: ['', [Validators.required]],
    });

    this.ticket.set({
      ticketId: this.ticketId(),
      title: 'Titulo prueba',
      description: 'Alguna descripción que sea lo suficientemente larga ',
      category: 'bug',
      priority: 'low',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
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
    if (this.ticketForm.valid) {
      this.ticket.set(this.ticketForm.value);
    }
  }
}
