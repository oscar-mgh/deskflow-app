import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastComponent } from '../../components/toast-component/toast';
import { AuthService } from '../../services/auth.service';
import { FormError } from '../../components/form-error/form-error';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ToastComponent, CommonModule, FormError],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  @ViewChild('toast') toast!: ToastComponent;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
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

    this.auth.register(fullName, email, password).subscribe({
      next: ({ token }) => {
        this.auth.setToken(token);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        const msg =
          err.status === 409
            ? 'El correo electrónico ya está registrado'
            : err.status === 0
            ? 'No se pudo conectar con el servidor'
            : 'Ocurrió un error inesperado';

        this.toast.show(msg, 'error');
        this.cdr.detectChanges();
      },
    });
  }
}
