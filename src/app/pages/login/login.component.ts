import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { AlertService } from '../../services/alert.service';
import { v4 as uuidv4 } from 'uuid';
import { TranslationService } from '../../services/translation.service';

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
  storageLanguage = "";

  constructor(
    private alertService: AlertService,
    private userAuthService: UserAuthService,
    private router: Router,
    private translationService: TranslationService,
  ) { }

  async ngOnInit() {
    if (await this.userAuthService.VerifyLogin()) {
      this.router.navigateByUrl('/home');
    }
    this.setBrowserId();
    this.verifyLanguage();
  }

  private async setBrowserId() {
    const browserId = localStorage.getItem('browserId') || uuidv4();
    if (localStorage.getItem('browserId') !== browserId) {
      localStorage.setItem('browserId', browserId);
    }
    this.ip = await this.userAuthService.getIPAddress();
    localStorage.setItem('ipAddress', this.ip);
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  private verifyLanguage() {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage && (storedLanguage === 'pt' || storedLanguage === 'en')) {
      this.storageLanguage = storedLanguage;
    } else {
      this.storageLanguage = 'en';
    }
    if (localStorage.getItem('language') !== this.storageLanguage) {
      localStorage.setItem('language', this.storageLanguage);
    }

    this.translationService.setLanguage(this.storageLanguage);
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
