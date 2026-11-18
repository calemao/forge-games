import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const CHAVE_TOKEN = 'forge_games_token';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<{ token: string; tipo: string }> {
    return this.http.post<{ token: string; tipo: string }>(`${this.apiUrl}/login`, { email, senha })
      .pipe(tap(resposta => localStorage.setItem(CHAVE_TOKEN, resposta.token)));
  }

  logout(): void {
    localStorage.removeItem(CHAVE_TOKEN);
  }

  getToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }
}
