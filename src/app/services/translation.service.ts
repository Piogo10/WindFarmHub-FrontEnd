import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private language: string = 'en'; // idioma padrão
  private translations: any = {}; // armazena os textos traduzidos

  constructor(private http: HttpClient) { }

  // Método para carregar os textos de um arquivo JSON
  loadTranslations(): void {
    this.http.get<any>(`assets/i18n/${this.language}.json`).subscribe(translations => {
      this.translations = translations;
    });
  }

  // Método para obter um texto traduzido
  translate(key: string): string {
    return this.translations[key] || key;
  }

  // Método para alterar o idioma
  setLanguage(language: string): void {
    this.language = language;
    this.loadTranslations(); // recarrega os textos no novo idioma
  }
}
