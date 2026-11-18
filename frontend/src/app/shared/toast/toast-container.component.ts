import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { IconeComponent } from '../icone/icone.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconeComponent],
  template: `
    <div class="toast-pilha" role="status" aria-live="polite">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast"
        [class.toast-sucesso]="toast.tipo === 'sucesso'"
        [class.toast-erro]="toast.tipo === 'erro'"
        [class.toast-aviso]="toast.tipo === 'aviso'"
        [class.toast-info]="toast.tipo === 'info'">
        <app-icone [nome]="toast.tipo === 'sucesso' ? 'check' : 'alerta'" [tamanho]="18"></app-icone>
        <span>{{ toast.mensagem }}</span>
        <button type="button" class="toast-fechar" (click)="toastService.remover(toast.id)" aria-label="Fechar notificação">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-pilha {
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
      max-width: 340px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 8px;
      color: #fff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      font-size: 14px;
      animation: entrada-toast 0.2s ease;
    }
    @keyframes entrada-toast {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .toast span { flex: 1; }
    .toast-sucesso { background-color: var(--cor-sucesso); }
    .toast-erro { background-color: var(--cor-perigo); }
    .toast-aviso { background-color: #c7791a; }
    .toast-info { background-color: var(--cor-destaque, #0891b2); }
    .toast-fechar {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 0 2px;
      margin: 0;
    }
    @media (max-width: 480px) {
      .toast-pilha {
        left: 16px;
        right: 16px;
        max-width: none;
      }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
