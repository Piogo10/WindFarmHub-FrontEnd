import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { AnimationsService } from '../../services/animations.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userDropdownOpen = false;
  hamburgerDropdownOpen = false;
  isLoggedIn = false;
  havePerms = false;
  userName = '';
  userEmail = '';

  constructor(
    private userAuthService: UserAuthService,
    private userService: UserService,
    private router: Router, 
    private animationsService: AnimationsService
  ) { }

  async ngOnInit() {
  }
}
