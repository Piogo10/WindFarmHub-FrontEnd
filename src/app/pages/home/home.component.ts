import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { AnimationsService } from '../../services/animations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  userDropdownOpen: boolean = false;
  hamburgerDropdownOpen: boolean = false;
  isLoggedIn: boolean = false;

  userName: string = "";
  userEmail: string = "";

  constructor(private userAuthService: UserAuthService, private router: Router, private animationsService: AnimationsService) { }

  ngOnInit() {
    this.userAuthService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      console.log('isLoggedIn:', this.isLoggedIn);
    });
    this.updateUserInformation();
  }

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  toggleHamburgerDropdown() {
    this.hamburgerDropdownOpen = !this.hamburgerDropdownOpen;
  }

  isLogedIn() {
    if (this.isLoggedIn) {
      return true;
    }
    else {
      return false;
    }
  }

  async updateUserInformation() {
    const response = await this.userAuthService.getUserInfo();
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

