import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

}
