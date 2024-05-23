import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private alertService: AlertService, private userAuthService: UserAuthService, private router: Router) { }

  async ngOnInit() {
    const isLoggedIn = await this.userAuthService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigateByUrl('/models');
    }
  }

  login() {

    // Add code to check if the user has exceeded the maximum number of login attempts
    const loginAttempts = localStorage.getItem('loginAttempts');
    if (loginAttempts && parseInt(loginAttempts) >= 3) {
      this.errorMessage = 'Número máximo de tentativas de login excedido. Por favor, tente novamente mais tarde.';
      return;
    }

    // Perform the login
    this.userAuthService.login(this.email, this.password).subscribe(
      (response: any) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          this.router.navigateByUrl('/models');
        } else {
          this.errorMessage = 'Não foi possível obter o token de acesso.';
        }
      },
      (error) => {
        console.error('Erro no login:', error);
        this.errorMessage = 'Erro ao efetuar login. Por favor, tente novamente.';
        
        // Increment the login attempts counter
        const currentAttempts = loginAttempts ? parseInt(loginAttempts) : 0;
        localStorage.setItem('loginAttempts', (currentAttempts + 1).toString());
      }
    );
  }
}