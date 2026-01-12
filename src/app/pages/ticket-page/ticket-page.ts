import { Component, computed, input, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { Category } from '../../models/category.model';
import { Comment, Ticket } from '../../models/ticket.model';

import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { TicketService } from '../../services/tickets.service';

import { Loading } from '../../components/loading/loading';
import { TicketDetailComponent } from '../../components/ticket-detail/ticket-detail';
import { TicketFormComponent } from '../../components/ticket-form/ticket-form';

@Component({
  selector: 'app-ticket-page',
  standalone: true,
  imports: [Loading, TicketFormComponent, TicketDetailComponent],
  templateUrl: './ticket-page.html',
})
export class TicketPage implements OnInit {
  ticketId = input<string>();

  loading = signal(false);
  editMode = signal(false);

  ticket = signal<Ticket | null>(null);
  categories = signal<Category[]>([]);
  comments = signal<Comment[]>([]);

  userRole = computed(() => this._auth.getUserInfo().role);
  isPremium = computed(() => this.userRole() === 'PREMIUM');
  isOwner = computed(() => this.ticket()?.userId === this._auth.getUserInfo().id);

  isCreate = computed(() => !this.ticketId());
  isEdit = computed(() => !!this.ticketId() && this.editMode());
  isView = computed(() => !!this.ticketId() && !this.editMode());

  constructor(
    private _ticketService: TicketService,
    private _categoryService: CategoryService,
    private _auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.ticketId()) {
      this.loadTicketData();
    } else {
      this.loadCategories();
    }
  }

  private loadTicketData(): void {
    this.loading.set(true);

    forkJoin({
      ticket: this._ticketService.getTicketById(this.ticketId()!),
      comments: this._ticketService.getComments(this.ticketId()!),
      categories: this._categoryService.getCategories(),
    }).subscribe({
      next: (res) => {
        this.ticket.set(res.ticket);
        this.comments.set(res.comments);
        this.categories.set(res.categories);
      },
      complete: () => this.loading.set(false),
    });
  }

  private loadCategories(): void {
    this._categoryService.getCategories().subscribe((c) => this.categories.set(c));
  }

  enableEdit(): void {
    this.editMode.set(true);
  }
}
