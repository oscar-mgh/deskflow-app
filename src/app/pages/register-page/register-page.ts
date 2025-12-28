import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormError } from '../../components/form-error/form-error';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormError],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService
  ) {
    this.registerForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    this._authService.register(fullName, email, password).subscribe({
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
}
