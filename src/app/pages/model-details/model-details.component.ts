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

  toggleItem(item: number): void {
    this.activeItem = (this.activeItem === item) ? null : item;
  }

  userDropdownOpen: boolean = false;
  hamburgerDropdownOpen: boolean = false;
  isLoggedIn: boolean = false;
  havePerms: boolean = false;
  model: any = {}; // Apenas um modelo, não uma matriz
  userName: string = "";
  userEmail: string = "";
  modelName: string = "";

  constructor(
    private userService: UserService, 
    private modelService: ModelService,
    private userAuthService: UserAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private animationsService: AnimationsService
  ) { }

  ngOnInit() {
    this.userAuthService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.userAuthService.havePerms().then(havePerms => {
      this.havePerms = havePerms;
      console.log('havePerms:', this.havePerms);
    });
    this.updateUserInformation();
    this.modelName = this.route.snapshot.params['modelName'];
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
        // Encontre o modelo correto com base no nome
        this.model = models.find((model: { name: string; }) => model.name === this.modelName);
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
    return this.isLoggedIn;
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
