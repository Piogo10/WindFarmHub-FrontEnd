import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ErrorSolutionResponse {
  errors: { id: number; error_message: string; }[];
  solutions: { id: number; error_id: number; topic: string; description: string; check_level: string; step_order: number; urgent_service: boolean; }[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private http: HttpClient) { }

  getErrorMessagesAndSolutions(): Observable<ErrorSolutionResponse> {
    return this.http.get<ErrorSolutionResponse>("api/error/all");
  }
}
