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
    this.updateUserInformation();
  }

  async updateUserInformation() {
    const response = await this.userService.getUserInfo();
    if (response) {
      const { id } = response;

      const models = await this.modelService.getModelsByUserId(id);
      this.models = models ?? [];
    }
  }

  goToModelDetails(modelName: string) {
    this.router.navigateByUrl(`/models/${modelName}`);
  }
}
