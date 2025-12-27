import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormError } from '../../components/form-error/form-error';
import { ToastComponent } from '../../components/toast-component/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormError, ToastComponent],
  templateUrl: './login-page.html',
})
export class LoginPage implements OnInit {
  @ViewChild('toast') toast!: ToastComponent;
  loginForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this._authService.login(this.loginForm.value).subscribe({
      next: ({ token }) => {
        this._authService.setToken(token);
        this._router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        const msg = this._authService.handleAuthError(err);
        this.toast.show(msg, 'error');
        this._cdr.detectChanges();
      },
    });
  }
}
