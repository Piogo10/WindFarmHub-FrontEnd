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
  }

  getTranslatedText(key: string): string {
    return this.translationService.translate(key);
  }
}
