import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Comment } from '../../models/ticket.model';
import { AuthService } from '../../services/auth.service';
import { TicketsService } from '../../services/tickets.service';

@Component({
  selector: 'app-comments-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './comments-page.html',
})
export class CommentsPage implements OnInit {
  private _route = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private _ticketService = inject(TicketsService);
  private _authService = inject(AuthService);

  public ticketId = signal<string>('');
  public comments = signal<Comment[]>([]);
  public loading = signal<boolean>(true);
  public isSending = signal<boolean>(false);
  public currentUserId = signal<number>(0);
  public userName = signal<string>('');

  public userRole = computed<string>(() => this._authService.getUserInfo().role);
  public isAdmin = computed<boolean>(() => this.userRole() === 'ADMIN');
  public isAgent = computed<boolean>(() => this.userRole() === 'AGENT');

  public commentForm: FormGroup;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    this.commentForm = this._fb.group({
      content: ['', [Validators.required, Validators.minLength(1)]],
    });

    effect(() => {
      if (this.comments().length > 0) {
        this.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this.ticketId.set(id);
      this.loadUserInfo();
      this.loadComments();
    }
  }

  private loadUserInfo() {
    const user = this._authService.getUserInfo();
    const id = Number(user.id);
    this.currentUserId.set(id);
    this.userName.set(user.username || 'User');
  }

  private loadComments() {
    this.loading.set(true);
    this._ticketService.getComments(this.ticketId()).subscribe({
      next: (data) => {
        const formattedComments = data.map((c) => ({
          ...c,
          userId: Number(c.userId),
        }));
        this.comments.set(formattedComments);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  public sendComment() {
    if (this.commentForm.invalid) return;

    this.isSending.set(true);
    const content = this.commentForm.get('content')?.value;

    this._ticketService.newComment(this.ticketId(), content).subscribe({
      next: (comment) => {
        this.comments.update((prev) => [...prev, comment]);
        this.commentForm.reset();
        this.isSending.set(false);
      },
      error: () => this.isSending.set(false),
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        if (this.scrollContainer) {
          const element = this.scrollContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }
      } catch (err) {}
    }, 100);
  }
}
