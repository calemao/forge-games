import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { IconeComponent } from '../../shared/icone/icone.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IconeComponent],
  template: `
    <div class="container" style="max-width: 420px; margin-top: 70px;">
      <div class="cartao">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom: 8px;">
          <app-icone nome="jogo" [tamanho]="26"></app-icone>
          <h2 style="margin:0;">Forge Games</h2>
        </div>
        <p style="color: var(--cor-texto-suave); margin-top:0;">Entre com sua conta para continuar</p>
        <form (ngSubmit)="entrar()">
          <div class="form-grupo">
            <label>Email *</label>
            <input type="email" [(ngModel)]="email" name="email" data-testid="input-email" placeholder="seu@email.com" required>
          </div>
          <div class="form-grupo">
            <label>Senha *</label>
            <input type="password" [(ngModel)]="senha" name="senha" data-testid="input-senha" placeholder="Sua senha" required>
          </div>
          <p class="erro" *ngIf="mensagemErro">{{ mensagemErro }}</p>
          <button type="submit" data-testid="btn-entrar" style="width:100%; justify-content:center;">
            Entrar
          </button>
        </form>
        <p style="font-size: 13px; color: var(--cor-texto-suave); margin-top: 16px; margin-bottom: 0;">
          Usuário inicial: admin&#64;loja.com / admin123
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  senha = '';
  mensagemErro = '';

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  entrar(): void {
    this.mensagemErro = '';
    this.authService.login(this.email, this.senha).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.mensagemErro = 'Email ou senha inválidos.';
        this.toastService.erro('Email ou senha inválidos.');
      }
    });
  }
}
