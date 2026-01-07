import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormError } from '../../components/form-error/form-error';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormError],
  templateUrl: './login-page.html',
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  public onLogin() {
    if (this.loginForm.invalid) return;
    this._authService.login(this.loginForm.value).subscribe({
      next: ({ token }) => {
        this._authService.setToken(token);
        this._router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        const msg = this._authService.handleAuthError(err);
        this._toastService.show(msg, 'error');
        this._cdr.detectChanges();
      },
    });
  }

  public fillForm(email: string): void {
    this.loginForm.patchValue({
      email: email,
      password: 'DeskflowUser',
    });

    this.loginForm.markAllAsTouched();
  }
}
