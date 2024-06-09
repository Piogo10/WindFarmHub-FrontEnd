import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationsService } from '../services/animations.service';
import { UserService } from '../services/user.service';
import { UserAuthService } from '../services/user-auth.service';
import { AlertService } from '../services/alert.service';
import { v4 as uuidv4 } from 'uuid';
import { TranslationService } from '../services/translation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isHome = false;
  storageLanguage = '';
  isModels = false;
  isItems = false;
  userDropdownOpen = false;
  hamburgerDropdownOpen = false;
  languageDropdownOpen: boolean = false;

  isLoggedIn = false;
  havePerms = false;
  userName = '';
  userEmail = '';
  ip = '';
  translatedTexts: any;

  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private alertService: AlertService,
    private router: Router,
    private animationsService: AnimationsService,
    private translationService: TranslationService
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
    this.verifyLanguage();
    this.isHome = !!document.getElementById('home');
    this.isModels = !!document.getElementById('models');
    this.isItems = !!document.getElementById('items');
  }

  changeLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.storageLanguage = language;
    this.translationService.setLanguage(language);
    this.toggleLanguageDropdown();
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (this.userDropdownOpen && !targetElement.closest('.relative')) {
      this.userDropdownOpen = false;
    }

    if (this.hamburgerDropdownOpen && !targetElement.closest('.relative')) {
      this.hamburgerDropdownOpen = false;
    }

    if (this.languageDropdownOpen && !targetElement.closest('.relative')) {
      this.languageDropdownOpen = false;
    }
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

  onMouseEnter(target: string) {
    this.animationsService.scaleAnimation(target, 1.1, 0.5);
  }
  
  onMouseLeave(target: string) {
    this.animationsService.scaleAnimation(target, 1, 0.5);
  }

  toggleLanguageDropdown(): void {
    this.languageDropdownOpen = !this.languageDropdownOpen;
} 
}
