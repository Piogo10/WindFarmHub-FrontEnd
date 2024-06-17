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

  activeItem: number | null = 0;
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
    { id: 'closet-control', src: 'assets/images/Eco-80/closet-cabine-control.png', label: 'Armário Controle de Cabine' },
    { id: 'closet-estator', src: 'assets/images/Eco-80/closet-estator.png', label: 'Armário do Estator' },
    { id: 'closet-multiply', src: 'assets/images/Eco-80/closet-multiply.png', label: 'Armário Multiplicadora' },
    { id: 'closet-conversor-power', src: 'assets/images/Eco-80/closet-power-conversor.png', label: 'Armário Conversor de Potência' },
    { id: 'closet-rotor', src: 'assets/images/Eco-80/closet-rotor.png', label: 'Armário do Rotor' }
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

  handleImageClick(id: string): void {
    if (id === 'closet-conversor-power') {
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
