import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Biblioteca minima de icones inline (estilo Lucide, sem dependencia externa),
 * usada em todos os botoes e itens de menu do sistema para reforcar o
 * significado de cada acao junto com o texto.
 */
@Component({
  selector: 'app-icone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg [attr.width]="tamanho" [attr.height]="tamanho" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <ng-container [ngSwitch]="nome">
        <ng-container *ngSwitchCase="'mais'"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></ng-container>
        <ng-container *ngSwitchCase="'lapis'"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></ng-container>
        <ng-container *ngSwitchCase="'lixeira'"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></ng-container>
        <ng-container *ngSwitchCase="'salvar'"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></ng-container>
        <ng-container *ngSwitchCase="'cancelar'"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></ng-container>
        <ng-container *ngSwitchCase="'dashboard'"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></ng-container>
        <ng-container *ngSwitchCase="'jogo'"><rect x="2" y="6" width="20" height="12" rx="4"/><line x1="7" y1="12" x2="11" y2="12"/><line x1="9" y1="10" x2="9" y2="14"/><circle cx="16" cy="10" r="1"/><circle cx="18.5" cy="13" r="1"/></ng-container>
        <ng-container *ngSwitchCase="'carrinho'"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></ng-container>
        <ng-container *ngSwitchCase="'usuario'"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></ng-container>
        <ng-container *ngSwitchCase="'sol'"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.9" y1="4.9" x2="6.3" y2="6.3"/><line x1="17.7" y1="17.7" x2="19.1" y2="19.1"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.9" y1="19.1" x2="6.3" y2="17.7"/><line x1="17.7" y1="6.3" x2="19.1" y2="4.9"/></ng-container>
        <ng-container *ngSwitchCase="'lua'"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></ng-container>
        <ng-container *ngSwitchCase="'logout'"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></ng-container>
        <ng-container *ngSwitchCase="'moeda'"><circle cx="12" cy="12" r="10"/><path d="M14.8 9a2.5 2.5 0 0 0-2.5-2H11a2 2 0 0 0 0 4h1.5a2 2 0 0 1 0 4h-1.3a2.5 2.5 0 0 1-2.4-2"/><line x1="12" y1="5.5" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="18.5"/></ng-container>
        <ng-container *ngSwitchCase="'alerta'"><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></ng-container>
        <ng-container *ngSwitchCase="'check'"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1"/><polyline points="22 4 12 14.01 9 11.01"/></ng-container>
        <ng-container *ngSwitchCase="'caixa-vazia'"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><line x1="12" y1="13" x2="12" y2="21"/></ng-container>
        <ng-container *ngSwitchCase="'menu'"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></ng-container>
      </ng-container>
    </svg>
  `
})
export class IconeComponent {
  @Input() nome = '';
  @Input() tamanho = 18;
}
