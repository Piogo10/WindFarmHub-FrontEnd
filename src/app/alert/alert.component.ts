import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AlertService, Alert } from '../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(300, style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate(300, style({ transform: 'translateX(-100%)' })),
      ])
    ])
  ]
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alertState.subscribe(alert => {
      this.alerts.push(alert);
      console.log('alerta ativo:', this.alerts.length);
      setTimeout(() => this.closeAlert(alert), 6000);
    });
  }

  closeAlert(alert: Alert) {
    const index = this.alerts.indexOf(alert);
    
    if (index !== -1) {
      this.alerts.splice(index, 1);
      transition(':leave', [
        animate(300, style({ transform: 'translateX(-100%)' })),
      ])
    }
  }
}
