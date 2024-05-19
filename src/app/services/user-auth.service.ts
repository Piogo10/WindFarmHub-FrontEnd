// user-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const url = '/api/user/login';
    const data = { email, password };

    return this.http.post(url, data);
  }

  async isLoggedIn(): Promise<boolean> {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    console.log('CHAMADA');
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    } else {
      const isValidToken = await this.verifyToken();
      if (isValidToken) {
        return true;
      } else {
        return false;
      }
    }
  }

  async havePerms(): Promise<boolean> {
    if (typeof localStorage === 'undefined') {
      return false;
    }
  
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
  
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any>('/api/user/perms', { headers }).toPromise();
      return response.status;
    } catch (error) {
      console.error('Erro ao verificar o token na API:', error);
      return false;
    }
  }
  

  logout(): void {
    localStorage.clear();
  }

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any>('/api/user/verify', { headers }).toPromise();
      return response.status;
    } catch (error) {
      console.error('Erro ao verificar o token na API:', error);
      return false;
    }
  }

  async getUserInfo(){
    if (typeof localStorage === 'undefined') {
      return null;
    }
  
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
  
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any>('/api/user/get/info', { headers }).toPromise();
      const { id, name, email } = response.user;
      return { id, name, email };
    } catch (err) {
      console.error("ERRO: ", err);
      return null;
    }
  }
  

  async getModelsByUserId(userId: number): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<any[]>('/api/modelo/id', { userId }, { headers }).toPromise();
      return response;
    } catch (error) {
      console.error('Erro ao obter os modelos:', error);
      return [];
    }
  }

  async getUsers(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any[]>('/api/user/get', { headers }).toPromise();
      return response;
    } catch (error) {
      console.error('Erro ao obter os usuários:', error);
      return [];
    }
  }

  async editUser(user: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>('/api/user/update', user, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao editar o usuário:', error);
    }
  }

  async deleteUser(id: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>(`/api/user/delete/${id}`, null, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao deletar o usuário:', error);
    }
  }

  async addUser(user: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<any>('/api/user/addUser', user, { headers }).toPromise();
      return response.id;
    } catch (error) {
      console.error('Erro ao adicionar o usuário:', error);
    }
  }

  async getModels(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any[]>('/api/modelo/all', { headers }).toPromise();
      return response;
    } catch (error) {
      console.error('Erro ao obter os modelos:', error);
      return [];
    }
  }

  async editModel(model: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>('/api/modelo/update', model, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao adicionar o modelo:', error);
    }
  }

  async addModel(model: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<any>('/api/modelo/add', model, { headers }).toPromise();
      return response.id;
    } catch (error) {
      console.error('Erro ao adicionar o modelo:', error);
    }
  }

  async deleteModel(id: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>(`/api/modelo/delete/${id}`, null, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao deletar o modelo:', error);
    }
  }


  async getAllAssociations(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any[]>('/api/modelo/allAssociation', { headers }).toPromise();
      return response;
    } catch (error) {
      console.error('Erro ao obter as associações:', error);
      return [];
    }
  }

  async editAssociation(association: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>('/api/modelo/updateAssociation', association, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao editar a associação:', error);
    }
  }

  async addAssociation(association: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<any>('/api/modelo/addAssociation', association, { headers }).toPromise();
      return response.id;
    } catch (error) {
      console.error('Erro ao adicionar a associação:', error);
    }
  }

  async deleteAssociation(id: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>(`/api/modelo/deleteAssociation/${id}`, null, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao deletar a associação:', error);
    }
  }

  async getAllProducts(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any[]>('/api/product/all', { headers }).toPromise() as any[];
      return response;
    } catch (error) {
      console.error('Erro ao obter os produtos:', error)
    }
  }

  async editProduct(product: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>('/api/product/update', product, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao editar o produto:', error);
    }
  }

  async addProduct(product: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<any>('/api/product/add', product, { headers }).toPromise();
      return response.id;
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
    }
  }

  async deleteProduct(id: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>(`/api/product/delete/${id}`, null, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao deletar o produto:', error);
    }
  }
}
