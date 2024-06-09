import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../services/alert.service';
import { DashboardService } from '../../../services/dashboard.service';
import { ItemService } from '../../../services/item.service';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-products',
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ProductsComponent implements OnInit{

  products: any[] = [];

  searchField: string = '';
  searchOption: string = 'material';
  productmodal = { 
    id: 0, 
    material: '', 
    text_brief_material: '',
    deposit: '',
    deposit_denomination: '',
    sap: '',
    basic_unit_of_measurement: '',
    lot: '',
    free_utilization_value: '',
    currency: '',
    stock_count: '',
    difference: ''
  };
  constructor(
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private itemService: ItemService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.itemService.getAllItems().then(products => {
      this.products = products;
      console.log('products:', this.products);
    });
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }

  filtrarProduct(): any[] {
    if (!this.searchField) {
      return this.products;
    } else {
      return this.products.filter(product =>
        product[this.searchOption].toLowerCase().includes(this.searchField.toLowerCase())
      );
    }
  }

  //EDIT
  editModel: any = null;
  showEditModal = false;

  toggleEditModal(product: any) {
    this.editModel = product;
    this.showEditModal = !this.showEditModal;
    this.productmodal = { ... this.editModel };
  }
  confirmEdit() {
    if (!this.productmodal.material || !this.productmodal.text_brief_material) {
      this.alertService.showAlert('Por favor, preencha todos os campos obrigatórios.', 'warn');
      return;
    }

    const materialExists = this.products.find(
      product => product.material === this.productmodal.material && product.id !== this.productmodal.id
    );

    if (materialExists) {
      this.alertService.showAlert('O ID do material já existe!', 'warn');
      return;
    }

    this.productmodal.deposit_denomination = this.productmodal.deposit_denomination || 'n/a';
    this.productmodal.basic_unit_of_measurement = this.productmodal.basic_unit_of_measurement || 'n/a';
    this.productmodal.lot = this.productmodal.lot || 'n/a';
    this.productmodal.currency = this.productmodal.currency || 'n/a';
    this.productmodal.deposit = this.productmodal.deposit || '0';
    this.productmodal.sap = this.productmodal.sap || '0';
    this.productmodal.free_utilization_value = this.productmodal.free_utilization_value || '0';
    this.productmodal.stock_count = this.productmodal.stock_count || '0';
    this.productmodal.difference = this.productmodal.difference || '0';

    Object.assign(this.editModel, this.productmodal);
    this.dashboardService.editItem(this.productmodal);
    this.limparvariavels();
    this.alertService.showAlert('Peça editada com sucesso!', 'success');
    this.toggleEditModal(null);
  }

  //DELETE
  deleteModel: any = null;
  showDeleteModal = false;
  toggleDeleteModal(product: any) {
    this.deleteModel = product;
    this.showDeleteModal = !this.showDeleteModal;
    console.log('Peça to delete:', this.deleteModel);
  }
  confirmDelete() {

    if(this.deleteModel){
      this.dashboardService.deleteItem(this.deleteModel.material);
      
      const index = this.products.findIndex(a => a.id === this.deleteModel.id);
      if (index !== -1) {
        this.products.splice(index, 1);
        this.alertService.showAlert('Peça eliminada com sucesso!', 'success');
      }
    }

    this.limparvariavels();
    this.toggleDeleteModal(null);
  }

  //ADD
  showAddProductModal = false;
  toggleAddProductModal() {
    this.showAddProductModal = !this.showAddProductModal;
    if (this.showAddProductModal) {
      this.limparvariavels();
    }
  }

  confirmAdd() {
    if (!this.productmodal.material || !this.productmodal.text_brief_material) {
      this.alertService.showAlert('Por favor, preencha todos os campos obrigatórios.', 'warn');
      return;
    }
  
    const materialExists = this.products.find(product => product.material === this.productmodal.material);
    if (materialExists) {
      this.alertService.showAlert('O ID do material já existe!', 'warn');
      return;
    }
  
    this.productmodal.deposit_denomination = this.productmodal.deposit_denomination || 'n/a';
    this.productmodal.basic_unit_of_measurement = this.productmodal.basic_unit_of_measurement || 'n/a';
    this.productmodal.lot = this.productmodal.lot || 'n/a';
    this.productmodal.currency = this.productmodal.currency || 'n/a';
    this.productmodal.deposit = this.productmodal.deposit || '0';
    this.productmodal.sap = this.productmodal.sap || '0';
    this.productmodal.free_utilization_value = this.productmodal.free_utilization_value || '0';
    this.productmodal.stock_count = this.productmodal.stock_count || '0';
    this.productmodal.difference = this.productmodal.difference || '0';
  
    this.dashboardService.addItem(this.productmodal);
    this.products.push(this.productmodal);
    this.alertService.showAlert('Peça adicionada com sucesso!', 'success');
    this.limparvariavels();
    this.toggleAddProductModal();
  }

  limparvariavels() {
    this.productmodal = { 
      id: 0, 
      material: '', 
      text_brief_material: '',
      deposit: '',
      deposit_denomination: '',
      sap: '', 
      basic_unit_of_measurement: '',
      lot: '',
      free_utilization_value: '',
      currency: '',
      stock_count: '',
      difference: ''
    };
    this.editModel = null;
    this.deleteModel = null;
  }

}
