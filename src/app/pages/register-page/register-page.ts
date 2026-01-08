import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormError } from '../../components/form-error/form-error';
import { RegisterRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, FormError],
  templateUrl: './register-page.html',
})
export class RegisterPage implements OnInit {
  public registerForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this._authService.register(this.registerForm.value as RegisterRequest).subscribe({
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
