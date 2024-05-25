import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  //----------- USER ------------//
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

  //----------- MODEL ------------//
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

  //----------- ASSOCIATION ------------//
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

  //----------- ITEMS ------------//
  async addItem(item: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.post<any>('/api/product/add', item, { headers }).toPromise();
      return response.id;
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
    }
  }
  async editItem(item: any): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      await this.http.post<any>('/api/product/update', item, { headers }).toPromise();
    } catch (error) {
      console.error('Erro ao editar o produto:', error);
    }
  }
  async deleteItem(id: any): Promise<void> {
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
