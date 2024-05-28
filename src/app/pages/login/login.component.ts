import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { AlertService } from '../../services/alert.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  browserId = '';
  ipAddress = '';
  loginAttempts = 0;
  isLocked = false;
  ip = '';

  constructor(
    private alertService: AlertService,
    private userAuthService: UserAuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (await this.userAuthService.VerifyLogin()) {
      this.router.navigateByUrl('/home');
    }
    this.setBrowserId();
  }

  private async setBrowserId() {
    const browserId = localStorage.getItem('browserId') || uuidv4();
    if (localStorage.getItem('browserId') !== browserId) {
      localStorage.setItem('browserId', browserId);
    }
    this.ip = await this.userAuthService.getIPAddress();
    localStorage.setItem('ipAddress', this.ip);
  }

  login() {
    if (!this.email || !this.password) {
      this.alertService.showAlert('Email e senha são obrigatórios.', 'error');
      return;
    }

    this.browserId = localStorage.getItem('browserId') ?? '';
    this.ipAddress = localStorage.getItem('ipAddress') ?? '';

    this.userAuthService.login(this.email, this.password, this.browserId, this.ipAddress).then(
      (response: any) => {
      if (response.accessToken) {
        this.router.navigateByUrl('/models');
        localStorage.setItem('accessToken', response.accessToken);
        return;
      } else if (response.error) {
        this.alertService.showAlert(response.error, 'error');
        }
      }

    );
  }
}
