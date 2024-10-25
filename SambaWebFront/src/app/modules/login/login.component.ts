import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from './service/login-service.service';
import { catchError, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ILogin } from './interfaces/login-interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  providers: [LoginServiceService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private loginService: LoginServiceService,
  ) { }

  login = new FormGroup({
    user: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    password: new FormControl('', [Validators.required]),
  });

  public onSubmit(): void {
    const loginData: ILogin = {
      user: {
        user: this.login.get('user')!.value ?? '',
        password: this.login.get('password')!.value ?? '',
      },
      sudoAuthentication: {
        sudoUser: this.login.get('user')!.value ?? '',
        sudoPassword: this.login.get('password')!.value ?? '',
      },
    };

    this.loginService
      .login(loginData)
      .pipe(
        catchError((error: string) => {
          console.error('Erro ao fazer login:', error);
          return throwError(() => error);
        }),
      )
      .subscribe((response) => {
        console.log(response);
        this.navigateToDashboard();
      });
  }

  public navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
