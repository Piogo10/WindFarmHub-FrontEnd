import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private userAuthService: UserAuthService, private router: Router) { }

  async ngOnInit() {
    const isLoggedIn = await this.userAuthService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigateByUrl('/models');
    }
  }

  login() {
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
      }
    );
  }
}