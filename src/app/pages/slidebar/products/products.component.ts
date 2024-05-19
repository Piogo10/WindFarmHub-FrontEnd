import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../services/user-auth.service';
import { Router } from '@angular/router';
import { AnimationsService } from '../../../services/animations.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
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
  constructor(private userAuthService: UserAuthService, private router: Router, private animationsService: AnimationsService) {}

  ngOnInit() {
    this.userAuthService.getAllProducts().then(products => {
      this.products = products;
      console.log('products:', this.products);
    });
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

  toggleEditModal(product : any) {
    this.editModel = product;
    this.showEditModal = !this.showEditModal;
    if (this.showEditModal && this.editModel) {
      this.productmodal = { ...this.editModel };
    } else {
      this.limparvariavels();
    }
  }
  confirmEdit() {
    if (this.editModel && this.editModel.material !== null && this.editModel.text_brief_material != null) {

      const materialExists = this.products.find(product => product.material === this.editModel.material && product.id !== this.editModel.id);
      
      if (materialExists) {
        console.log('materialExists:', materialExists);
        console.log('Material already exists.');
        return;
      }

      Object.assign(this.editModel, this.productmodal);
      this.userAuthService.editProduct(this.editModel);
      console.log('Product edited:', this.editModel);
      this.limparvariavels();
      this.toggleEditModal(null);
    }
    else{
      console.log('Please fill in all required fields.');
    }
  }

  //DELETE
  deleteModel: any = null;
  showDeleteModal = false;
  toggleDeleteModal(product: any) {
    this.deleteModel = product;
    this.showDeleteModal = !this.showDeleteModal;
    console.log('Product to delete:', this.deleteModel);
  }
  confirmDelete() {

    if(this.deleteModel){
      this.userAuthService.deleteProduct(this.deleteModel.material);
      console.log('Product deleted:', this.deleteModel.id);
      
      const index = this.products.findIndex(a => a.id === this.deleteModel.id);
      if (index !== -1) {
        this.products.splice(index, 1);
        console.log('Association deleted:', this.deleteModel);
      }
    }

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
      console.log('Please fill in the material field.');
      return;
    }
  
    const materialExists = this.products.find(product => product.material === this.productmodal.material);
    if (materialExists) {
      console.log('Material already exists.');
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
  
    this.userAuthService.addProduct(this.productmodal);
    this.products.push(this.productmodal);
    console.log('Product added:', this.productmodal);
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
  }

}
