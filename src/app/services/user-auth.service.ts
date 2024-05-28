import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

  async login(email: string, password: string, browserId: string, ipAddress: string): Promise<any> {
    const url = '/api/user/login';
    const data = { email, password, browserId, ipAddress};
    const response = await this.http.post<any>(url, data).toPromise();
    return response;
  }

  async VerifyLogin(): Promise<boolean> {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
    return await this.verifyToken();
  }

  async getIPAddress(): Promise<string> {
    const response = await this.http.get<any>("http://api.ipify.org/?format=json").toPromise();
    return response.ip;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
  }

  async verifyToken(): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const response = await this.http.get<any>('/api/user/verify', { headers }).toPromise();
      if (response.status === false) {
        this.alertService.showAlert('Sua sessão expirou!', 'warn');
      }	
      return response.status;
    } catch (error) {
      return false;
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
      return false;
    }
  }

}
