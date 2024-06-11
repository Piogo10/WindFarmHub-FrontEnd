import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationsService } from '../../services/animations.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { ModelService } from '../../services/model.service';
import { TranslationService } from '../../services/translation.service';
import { AlertService } from '../../services/alert.service';

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
    private router: Router,
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private alertService: AlertService,
    private animationsService: AnimationsService,
  ) { }

  async ngOnInit() {
    this.updateUserInformation();
    this.modelName = this.route.snapshot.params['modelName'];
  }

  images = [
    { src: 'closet-control', label: 'Armário Controle de Cabine' },
    { src: 'closet-estator', label: 'Armário do Estator' },
    { src: 'closet-multiply', label: 'Armário Multiplicadora' },
    { src: 'closet-conversor-power', label: 'Armário Conversor de Potência' },
    { src: 'closet-rotor', label: 'Armário do Rotor' }
  ];

  async updateUserInformation() {
    const response = await this.userService.getUserInfo();
    if (response) {
      const { id } = response;
      const models = await this.modelService.getModelsByUserId(id);
      this.model = models.find((model: { name: string }) => model.name === this.modelName);
    }
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  toggleItem(item: number): void {
    this.activeItem = (this.activeItem === item) ? null : item;
  }

  handleImageClick(imageSrc: string): void {
    if (imageSrc === 'closet-conversor-power') {
      this.goToClosetDetails(this.modelName, 'conversor-de-potencia');
    } else {
      this.alertService.showAlert('Indisponível', 'error');
    }
  }

  activeSection: number | null = null;

  toggleSection(index: number) {
    this.activeSection = this.activeSection === index ? null : index;
  }

  goToClosetDetails(modelName: string, closetName: string) {
    this.router.navigateByUrl(`/models/${modelName}/${closetName}`);
  }

  onMouseEnter(target: string) {
    this.animationsService.scaleAnimation(target, 1.1, 0.5);
  }
  
  onMouseLeave(target: string) {
    this.animationsService.scaleAnimation(target, 1, 0.5);
  }
}
