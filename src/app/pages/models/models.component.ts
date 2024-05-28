import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { AnimationsService } from '../../services/animations.service';
import { ModelService } from '../../services/model.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss']
})
export class ModelsComponent implements OnInit {
  userDropdownOpen = false;
  hamburgerDropdownOpen = false;
  isLoggedIn = false;
  havePerms = false;
  models: any[] = [];
  userName = '';
  userEmail = '';

  constructor(
    private userAuthService: UserAuthService,
    private userService: UserService,
    private modelService: ModelService,
    private router: Router,
    private animationsService: AnimationsService,
    private alertService: AlertService
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this.userAuthService.VerifyLogin();
    if (this.isLoggedIn) {
      await this.updateUserInformation();
    }
    this.havePerms = await this.userAuthService.havePerms();
  }

  async updateUserInformation() {
    const response = await this.userService.getUserInfo();
    if (response) {
      const { name, email, id } = response;
      this.userName = name;
      this.userEmail = email;

      const models = await this.modelService.getModelsByUserId(id);
      this.models = models ?? [];
    }
  }

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  toggleHamburgerDropdown() {
    this.hamburgerDropdownOpen = !this.hamburgerDropdownOpen;
  }

  goToLogin() {
    if (this.isLoggedIn) {
      this.userAuthService.logout();
      this.isLoggedIn = false;
    }
    this.router.navigateByUrl('/home');
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

  goToModelDetails(modelName: string) {
    this.router.navigateByUrl(`/models/${modelName}`);
  }
}
