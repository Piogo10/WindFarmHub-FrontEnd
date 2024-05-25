import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  constructor(private http: HttpClient) { }


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
}
