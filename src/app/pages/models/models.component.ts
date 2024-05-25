import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Router } from '@angular/router';
import { AnimationsService } from '../../services/animations.service';
import { ModelService } from '../../services/model.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit{

  userDropdownOpen: boolean = false;
  hamburgerDropdownOpen: boolean = false;
  isLoggedIn: boolean = false;
  havePerms: boolean = false;
  models: any[] = [];
  userName: string = "";
  userEmail: string = "";

  constructor(
    private userAuthService: UserAuthService, 
    private userService: UserService,
    private modelService: ModelService,
    private router: Router, 
    private animationsService: AnimationsService) { }

  ngOnInit() {
    this.userAuthService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log('isLoggedIn:', this.isLoggedIn);
    });
    this.userAuthService.havePerms().then(havePerms => {
      this.havePerms = havePerms;
      console.log('havePerms:', this.havePerms);
    });
    this.updateUserInformation();
  }

  async updateUserInformation() {
    const response = await this.userService.getUserInfo();
    if (response) {
      const { name, email } = response;
      this.userName = name;
      this.userEmail = email;

      const { id } = response;
      const models = await this.modelService.getModelsByUserId(id);
      if (models && models.length > 0) {
        this.models = models;
      }
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
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  isLogedIn() {
    if (this.isLoggedIn) {
      return true;
    }
    else {
      return false;
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

  goToModelDetails(modelName: string) {
    this.router.navigateByUrl(`/models/${modelName}`);
  }

}
