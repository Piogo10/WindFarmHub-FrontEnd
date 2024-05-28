import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationsService } from '../../services/animations.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { ModelService } from '../../services/model.service';

@Component({
  selector: 'app-model-details',
  templateUrl: './model-details.component.html',
  styleUrls: ['./model-details.component.scss'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        visibility: 'visible'
      })),
      state('collapsed', style({
        height: '0',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('expanded <=> collapsed', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class ModelDetailsComponent implements OnInit {

  activeItem: number | null = null;
  userDropdownOpen = false;
  hamburgerDropdownOpen = false;
  isLoggedIn = false;
  havePerms = false;
  model: any = {};
  userName = '';
  userEmail = '';
  modelName = '';

  constructor(
    private userService: UserService,
    private modelService: ModelService,
    private userAuthService: UserAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private animationsService: AnimationsService
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this.userAuthService.VerifyLogin();
    this.havePerms = await this.userAuthService.havePerms();
    this.updateUserInformation();
    this.modelName = this.route.snapshot.params['modelName'];
  }

  async updateUserInformation() {
    const response = await this.userService.getUserInfo();
    if (response) {
      const { name, email, id } = response;
      this.userName = name;
      this.userEmail = email;

      const models = await this.modelService.getModelsByUserId(id);
      this.model = models.find((model: { name: string }) => model.name === this.modelName);
    }
  }

  toggleItem(item: number): void {
    this.activeItem = (this.activeItem === item) ? null : item;
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
}
