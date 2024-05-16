import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationsService } from '../../../services/animations.service';
import { UserAuthService } from '../../../services/user-auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  
  switchState: boolean = false;
  showModal: boolean = false;
  usuarios: any[] = [];
  editUser: any = null;
  delUser: any = null;
  activeUsers: number = 0;


  searchField: string = ''; // Variável para armazenar o termo de pesquisa
  searchOption: string = 'name'; // Opção padrão de pesquisa é 'name'
  
  constructor(private userAuthService: UserAuthService, private router: Router, private animationsService: AnimationsService) {}

  ngOnInit() {
    this.userAuthService.getUsers().then(users => {
      this.usuarios = users;
      this.VerifyStatus();
      console.log('users:', this.usuarios);
  
      
    });
  }

  filtrarUsuarios(): any[] {
    if (!this.searchField) {
      return this.usuarios;
    } else {
      return this.usuarios.filter(usuario =>
        usuario[this.searchOption].toLowerCase().includes(this.searchField.toLowerCase())
      );
    }
  }
  
  async VerifyStatus(): Promise<void> {
    this.activeUsers = 0;

    for (let i = 0; i < this.usuarios.length; i++) {
      const usuario = this.usuarios[i];
      if (usuario.status) {
        this.activeUsers++;
      }
    }
    this.usuarios.sort((a, b) => a.name.localeCompare(b.name));
  }

  //EDIT
  showEditModal = false;
  editedUser = { id: 0, name: '', email: '', role: '', status: false};
  toggleEditUserTemplate(user: any): void { // Receber o usuário como parâmetro
    this.showEditModal = !this.showEditModal;
    this.editUser = user; // Atribuir o usuário selecionado a selectedUser
    // Preencher os campos do formulário de edição com as informações do selectedUser
    if (this.showEditModal && this.editUser) {
      this.editedUser = { id: this.editUser.id, name: this.editUser.name, email: this.editUser.email, role: this.editUser.role, status: this.editUser.status};
    }
  }

  confirmEdit(): void {
    if (this.editUser) {
      if (this.editedUser.name && this.editedUser.email && this.editedUser.role) {

        const isEmailUnique = this.usuarios.some(usuario => usuario.email === this.editedUser.email && usuario.id !== this.editedUser.id);
        if (!isEmailUnique) {
          console.log('Usuário editado:', this.editedUser.id);
          this.editUser.id = this.editedUser.id;
          this.editUser.name = this.editedUser.name;
          this.editUser.email = this.editedUser.email;
          this.editUser.role = this.editedUser.role;
          this.editUser.status = this.editedUser.status;
          this.userAuthService.editUser(this.editUser);
          console.log('Usuário editado:', this.editUser);
          this.VerifyStatus();
          this.editUser = null;
        } else {
          console.log('O email já está sendo usado por outro usuário.');
        }
      } else {
        console.log('Por favor, preencha todos os campos obrigatórios.');
      }
    }
    this.toggleEditUserTemplate(null); // Fechar o modal após a confirmação
  }

  //DELETE
  showDeleteModal = false;
  toggleDeleteModal(user: any): void {
      this.showDeleteModal = !this.showDeleteModal;
      this.delUser = user;
      console.log('Usuário selecionado para deletar:', this.delUser);
  }
  confirmDelete(): void {
    if (this.delUser) {
      this.userAuthService.deleteUser(this.delUser.id);
      const index = this.usuarios.findIndex(u => u.id === this.delUser.id);
      if (index !== -1) {
        this.usuarios.splice(index, 1);
        console.log('Usuário deletado:', this.delUser);
        this.VerifyStatus();
      }
    }
    this.toggleDeleteModal(null);
  }


  //ADD
  showAddUserModal = false;
  newUser = { name: '', email: '', password: '', role: '', status: false };
  toggleAddUserModal(): void {
    this.showAddUserModal = !this.showAddUserModal;
  }
  addUser(): void {
    if (this.newUser.name && this.isEmailValid(this.newUser.email) && this.newUser.password && this.newUser.role) {
      this.userAuthService.addUser(this.newUser).then((userId: any) => {
        if (userId !== undefined) {

          const isEmailUnique = this.usuarios.every(usuario => usuario.email !== this.editedUser.email);

          if (isEmailUnique) {
            this.usuarios.push({ id: userId, ...this.newUser });
            console.log('Usuário adicionado:', this.newUser);
            this.newUser = { name: '', email: '', password: '', role: '', status: false };
            this.VerifyStatus
          }
          else{
            console.log('O email já está sendo usado por outro usuário.');
          }
        }
      });
    } else {
      console.log('Por favor, preencha todos os campos obrigatórios.');
    }

    this.toggleAddUserModal();
  }

  isEmailValid(email: string): boolean {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
}
