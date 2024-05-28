// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private userAuthService: UserAuthService) { }

  async canActivate(): Promise<boolean> {
    if (await this.userAuthService.VerifyLogin()) {
      try {
        const isValidToken = await this.userAuthService.verifyToken();
        if (isValidToken) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    this.router.navigateByUrl('/home');
    return false;
  }
}
