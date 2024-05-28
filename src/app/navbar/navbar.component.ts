import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationsService } from '../services/animations.service';
import { UserService } from '../services/user.service';
import { UserAuthService } from '../services/user-auth.service';
import { AlertService } from '../services/alert.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isHome = false;
  isModels = false;
  userDropdownOpen = false;
  hamburgerDropdownOpen = false;
  isLoggedIn = false;
  havePerms = false;
  userName = '';
  userEmail = '';
  ip = '';

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private alertService: AlertService,
    private router: Router,
    private animationsService: AnimationsService
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this.userAuthService.VerifyLogin();
    if (!this.isLoggedIn) {
      if (localStorage.getItem('accessToken')) {
        this.alertService.showAlert('Sua sessão expirou!', 'warn');
        this.logout();
      }
    } else {
      this.updateUserInformation();
      this.havePerms = await this.userAuthService.havePerms();
    }
    this.setBrowserId();

    if (document.getElementById('home')) {
      this.isHome = true;
      const labelHome = document.getElementById('label_home');
      if (labelHome) {
        labelHome.classList.add('text-blue-700');
      }
    }
    else {
      this.isHome = false;
    }
    if (document.getElementById('models')) {
      this.isModels = true;
      const labelModels = document.getElementById('label_models');
      if (labelModels) {
        labelModels.classList.add('text-blue-700');
      }
    }
    else {
      this.isModels = false;
    }
  }

  private async setBrowserId() {
    const browserId = localStorage.getItem('browserId') || uuidv4();
    if (localStorage.getItem('browserId') !== browserId) {
      localStorage.setItem('browserId', browserId);
    }
    this.ip = await this.userAuthService.getIPAddress();
    localStorage.setItem('ipAddress', this.ip);
  }

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  toggleHamburgerDropdown() {
    this.hamburgerDropdownOpen = !this.hamburgerDropdownOpen;
  }

  async updateUserInformation() {
    const response = await this.userService.getUserInfo();
    if (response) {
      const { name, email } = response;
      this.userName = name;
      this.userEmail = email;
    }
  }

  logout() {
    this.userAuthService.logout();
    this.router.navigateByUrl('/home');
  }

  onMouseEnter() {
    this.animationsService.scaleAnimation('#animated-svg', 1.1, 0.5);
  }

  onMouseLeave() {
    this.animationsService.scaleAnimation('#animated-svg', 1, 0.5);
  }
}
