import { Component, OnInit, model } from '@angular/core';
import { UserAuthService } from '../../../services/user-auth.service';
import { Router } from '@angular/router';
import { AnimationsService } from '../../../services/animations.service';

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.component.html',
  styleUrls: ['./modelos.component.scss']
})
export class ModelosComponent implements OnInit {

  modelos: any[] = [];
  associacoes: any[] = [];
  users: any[] = [];
  modelModelo: any = {
    name: '',
    description: '',
    power_rated_power: '',
    power_flexible_ratings: '',
    power_cut_in_speed: '',
    power_rated_speed: '',
    power_cut_out_speed: '',
    power_survival_speed: '',
    power_wind_zone: '',
    power_wind_class: '',
    rotor_diameter: '',
    rotor_swept_area: '',
    rotor_blades: '',
    rotor_max_speed: '',
    rotor_tipspeed: '',
    rotor_type: '',
    rotor_material: '',
    rotor_manufacturer: '',
    rotor_power_density1: '',
    rotor_power_density2: '',
    gearbox_type: '',
    gearbox_stages: '',
    gearbox_ratio: '',
    gearbox_manufacturer: '',
    generator_type: '',
    generator_number: '',
    generator_max_speed: '',
    generator_voltage: '',
    generator_grid_connection: '',
    generator_grid_frequency: '',
    generator_manufacturer: '',
    tower_hub_height: '',
    tower_type: '',
    tower_shape: '',
    tower_corrosion_protection: '',
    tower_manufacturer: '',
    weight_single_blade: '',
    weight_hub: '',
    weight_rotor: '',
    weight_nacelle: '',
    weight_tower_max: '',
    weight_total: '',
    stautus: false
  };
  modelAssociation: any = {
    user_email: '',
    model_name: '',
    status: false
  };
  activeModels: number = 0;
  activeAssociations: number = 0;
  scrollHandler!: EventListenerObject;

  constructor(
    private userAuthService: UserAuthService,
    private router: Router,
    private animationsService: AnimationsService
  ) { }

  ngOnInit() {
    this.userAuthService.getModels().then(models => {
      this.modelos = models;
      console.log('modelos:', this.modelos);
      this.VerifyStatus();
    });

    this.updateAssociations();

    this.userAuthService.getUsers().then(users => {
      this.users = users;
      console.log('users:', this.users);
      this.VerifyStatus();
    });
  }

  async VerifyStatus(): Promise<void> {
    this.activeModels = 0;
    this.activeAssociations = 0;

    for (let i = 0; i < this.modelos.length; i++) {
      const modelo = this.modelos[i];
      if (modelo.status) {
        this.activeModels++;
      }
    }

    for (let i = 0; i < this.associacoes.length; i++) {
      const associacao = this.associacoes[i];
      if (associacao.status) {
        this.activeAssociations++;
      }
    }

    this.associationOptions = this.modelos.map(modelo => modelo.name);
    this.emailOptions = this.users.map(user => user.email);
  }

  async updateAssociations(): Promise<void> {
    this.userAuthService.getAllAssociations().then(associations => {
      this.associacoes = associations;
      this.associacoes.sort((a, b) => a.user.name.localeCompare(b.user.name));
      console.log('associacoes:', this.associacoes);
      this.VerifyStatus();
    });
  }

  searchField: string = '';
  searchOption: string = 'name';
  filtrarModelos(): any[] {
    if (!this.searchField) {
      return this.modelos;
    } else {
      return this.modelos.filter(modelo =>
        modelo[this.searchOption].toLowerCase().includes(this.searchField.toLowerCase())
      );
    }
  }

  searchFieldAssociations: string = '';
  searchOptionAssociations: string = 'email';
  filtrarAssociacoes(): any[] {
    if (!this.searchFieldAssociations) {
      return this.associacoes;
    } else {
      return this.associacoes.filter(associacao => {
        if (this.searchOptionAssociations === 'email') {
          const user = associacao.user;
          return user.email.toLowerCase().includes(this.searchFieldAssociations.toLowerCase());
        }
        else if (this.searchOptionAssociations === 'name') {
          const model = associacao.model;
          return model.name.toLowerCase().includes(this.searchFieldAssociations.toLowerCase());
        }
      });
    }
  }



  //------------- MODELOS ------------- //
  // EDIT
  editModel: any = null;
  showEditModal = false;
  toggleEditModelTemplate(model: any): void {
    this.showEditModal = !this.showEditModal;
    this.editModel = model;
    if (this.showEditModal && this.editModel) {
      this.modelModelo = { ...this.editModel };
    } else {
      this.limparvariavels();
    }

    document.body.style.overflow = this.showEditModal ? 'hidden' : 'auto';
    const method = this.showEditModal ? 'addEventListener' : 'removeEventListener';
    document.body[method]('scroll', this.scrollHandler);
  }
  confirmEdit(): void {
    if (this.editModel && this.editModel.name !== null) {
      const nameExists = this.modelos.some(modelo => modelo.name === this.modelModelo.name && modelo.id !== this.editModel.id);
      if (nameExists) {
        console.log('Name already exists. Please choose a different name.');
        return;
      }
      Object.assign(this.editModel, this.modelModelo);
      this.userAuthService.editModel(this.editModel);
      console.log('Model edited:', this.editModel);
      this.VerifyStatus();
      this.toggleEditModelTemplate(null);
    } else {
      console.log('Please fill in all required fields.');
    }
  }
  // ADD
  showAddModal = false;
  addModel: any = null;

  toggleAddModelTemplate(): void {
    this.showAddModal = !this.showAddModal;
    if (this.showAddModal) {
      this.limparvariavels();
    }
    document.body.style.overflow = this.showAddModal ? 'hidden' : 'auto';
    const method = this.showAddModal ? 'addEventListener' : 'removeEventListener';
    document.body[method]('scroll', this.scrollHandler);
  }
  confirmAdd(): void {
    if (this.modelModelo.name) {
      const nameExists = this.modelos.some(modelo => modelo.name === this.modelModelo.name);
      if (nameExists) {
        console.log('Name already exists. Please choose a different name.');
        return;
      }
      for (const key in this.modelModelo) {
        if (key !== 'name' && this.modelModelo[key] === '') {
          this.modelModelo[key] = 'n/a';
        }
      }

      this.userAuthService.addModel(this.modelModelo).then((userId: any) => {
        console.log('AAAAAAAAAAAAA:', userId);
        if (userId !== undefined) {
          this.modelos.push({ id: userId, ...this.modelModelo })
        }
      });
      console.log('Model added:', this.modelModelo);
      this.toggleAddModelTemplate();
    } else {
      console.log('Please fill in all required fields.');
    }
  }
  // DELETE
  showDeleteModal = false;
  toogleDeleteModelTemplate(model: any): void {
    this.showDeleteModal = !this.showDeleteModal;
    this.addModel = model;
    console.log('Model selected for deletion:', this.addModel);

    document.body.style.overflow = this.showDeleteModal ? 'hidden' : 'auto';
    const method = this.showDeleteModal ? 'addEventListener' : 'removeEventListener';
    document.body[method]('scroll', this.scrollHandler);
  }
  confirmDelete(): void {
    if (this.addModel) {
      this.userAuthService.deleteModel(this.addModel.id);
      const index = this.modelos.findIndex(m => m.id === this.addModel.id);
      if (index !== -1) {
        this.modelos.splice(index, 1);
        this.VerifyStatus();
        console.log('Model deleted:', this.addModel);
      }
    }
    this.toogleDeleteModelTemplate(null);
  }
  limparvariavels(): void {
    this.modelModelo = {
      name: '',
      description: '',
      power_rated_power: '',
      power_flexible_ratings: '',
      power_cut_in_speed: '',
      power_rated_speed: '',
      power_cut_out_speed: '',
      power_survival_speed: '',
      power_wind_zone: '',
      power_wind_class: '',
      rotor_diameter: '',
      rotor_swept_area: '',
      rotor_blades: '',
      rotor_max_speed: '',
      rotor_tipspeed: '',
      rotor_type: '',
      rotor_material: '',
      rotor_manufacturer: '',
      rotor_power_density1: '',
      rotor_power_density2: '',
      gearbox_type: '',
      gearbox_stages: '',
      gearbox_ratio: '',
      gearbox_manufacturer: '',
      generator_type: '',
      generator_number: '',
      generator_max_speed: '',
      generator_voltage: '',
      generator_grid_connection: '',
      generator_grid_frequency: '',
      generator_manufacturer: '',
      tower_hub_height: '',
      tower_type: '',
      tower_shape: '',
      tower_corrosion_protection: '',
      tower_manufacturer: '',
      weight_single_blade: '',
      weight_hub: '',
      weight_rotor: '',
      weight_nacelle: '',
      weight_tower_max: '',
      weight_total: ''
    };

    this.modelAssociation = {
      user_name: '',
      user_email: '',
      model_name: ''
    };
  }

  //------------- ASSOCIAÇÃO ------------- //

  showEditAssociationModal = false;
  editAssociation: any = null;

  associationOptions: string[] = [];
  emailOptions: any[] = [];
  toggleEditAssociationTemplate(association: any): void {
    this.showEditAssociationModal = !this.showEditAssociationModal;
    if (!this.showEditAssociationModal) {
      this.limparvariavels();
      document.body.style.overflow = 'auto';
      document.body.removeEventListener('scroll', this.scrollHandler);
      return;
    }
    this.editAssociation = association;
    this.modelAssociation.user_email = this.editAssociation.user.email;
    this.modelAssociation.model_name = this.editAssociation.model.name;
    this.modelAssociation.status = this.editAssociation.status;
  }
  confirmEditAssociation(): void {
    const userid = this.users.find(user => user.email === this.modelAssociation.user_email)?.id;
    const modelid = this.modelos.find(model => model.name === this.modelAssociation.model_name)?.id;

    const existingAssociationIndex = this.associacoes.findIndex(a =>
      a.user.email === this.modelAssociation.user_email &&
      a.model.name === this.modelAssociation.model_name &&
      a.id !== this.editAssociation.id
    );

    if (existingAssociationIndex !== -1) {
      console.log('Association with same user and model already exists.');
      return;
    }

    const DataInfo = {
      id: this.editAssociation.id,
      user_id: userid,
      modelo_id: modelid,
      status: this.modelAssociation.status
    };

    this.userAuthService.editAssociation(DataInfo).then(() => {
      this.updateAssociations();
      this.limparvariavels();
      this.toggleEditAssociationTemplate(null);
    }).catch(error => {
      console.error('Error editing association:', error);
    });
  }

  showAddAssociationModal = false;
  toggleAddAssociationTemplate(): void {
    this.showAddAssociationModal = !this.showAddAssociationModal;
    if (this.showAddAssociationModal) {
      this.limparvariavels();
    }
    document.body.style.overflow = this.showAddAssociationModal ? 'hidden' : 'auto';
    const method = this.showAddAssociationModal ? 'addEventListener' : 'removeEventListener';
    document.body[method]('scroll', this.scrollHandler);
  }

  confirmAddAssociation(): void {
    if (!this.modelAssociation.user_email || !this.modelAssociation.model_name) {
      console.log('Please fill in all required fields.');
      return;
    }

    const userid = this.users.find(user => user.email === this.modelAssociation.user_email)?.id;
    const modelid = this.modelos.find(model => model.name === this.modelAssociation.model_name)?.id;

    const existingAssociationIndex = this.associacoes.findIndex(a =>
      a.user.email === this.modelAssociation.user_email &&
      a.model.name === this.modelAssociation.model_name
    );

    if (existingAssociationIndex !== -1) {
      console.log('Association with same user and model already exists.');
      return;
    }

    const DataInfo = {
      user_id: userid,
      modelo_id: modelid,
      status: this.modelAssociation.status
    };

    this.userAuthService.addAssociation(DataInfo).then(() => {
      this.updateAssociations();
      this.limparvariavels();
      this.toggleAddAssociationTemplate();
    }).catch(error => {
      console.error('Error adding association:', error);
    });
  }

  showDeleteAssociationModal = false;
  deleteAssociation: any = null;
  toggleDeleteAssociationTemplate(association: any): void {
    this.showDeleteAssociationModal = !this.showDeleteAssociationModal;
    this.deleteAssociation = association;
    console.log('Association selected for deletion:', this.deleteAssociation);
  }
  confirmDeleteAssociation(): void {
    if (this.deleteAssociation) {
      this.userAuthService.deleteAssociation(this.deleteAssociation.id);
      const index = this.associacoes.findIndex(a => a.id === this.deleteAssociation.id);
      if (index !== -1) {
        this.associacoes.splice(index, 1);
        this.updateAssociations();
        console.log('Association deleted:', this.deleteAssociation);
      }
    }
    this.VerifyStatus();
    this.toggleDeleteAssociationTemplate(null);
  }

}
