import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/user-auth.service';
import { v4 as uuidv4 } from 'uuid';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ip = '';

  constructor(
    private userAuthService: UserAuthService,
    private translationService: TranslationService,
  ) { }

  async ngOnInit() {
    this.setBrowserId();
  }

  private async setBrowserId() {
    const browserId = localStorage.getItem('browserId') || uuidv4();
    if (localStorage.getItem('browserId') !== browserId) {
      localStorage.setItem('browserId', browserId);
    }
    this.ip = await this.userAuthService.getIPAddress();
    localStorage.setItem('ipAddress', this.ip);
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }
}
