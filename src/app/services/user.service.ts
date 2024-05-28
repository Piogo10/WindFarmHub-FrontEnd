import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  async getUserInfo(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return null;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any>('/api/user/get/info', { headers }).toPromise();
      const { id, name, email } = response.user;
      return { id, name, email };
    } catch (error) {
      return null;
    }
  }
  async getUsers(): Promise<any> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return null;
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any[]>('/api/user/get', { headers }).toPromise();
      return response;
    } catch (error) {
      return null;
    }
  }
}
