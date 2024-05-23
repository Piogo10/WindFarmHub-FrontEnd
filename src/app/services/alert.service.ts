import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  message: string;
  type: 'info' | 'success' | 'error' | 'warn';
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new Subject<Alert>();

  alertState = this.alertSubject.asObservable();

  showAlert(message: string, type: 'info' | 'success' | 'warn' |'error' = 'info') {
    this.alertSubject.next({ message, type });
  }
}
