import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CotacaoService } from '../../core/services/cotacao.service';
import { TemaService } from '../../core/services/tema.service';
import { IconeComponent } from '../icone/icone.component';

/**
 * Barra de navegacao lateral (sidebar) no desktop, que vira um menu
 * compacto (drawer) em telas estreitas. Centraliza o acesso as telas
 * do sistema, o seletor de moeda e a alternancia de tema claro/escuro.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, IconeComponent],
  template: `
    <ng-container *ngIf="authService.estaAutenticado()">
      <button type="button" class="botao-menu-mobile" (click)="menuAberto.set(!menuAberto())" aria-label="Abrir menu">
        <app-icone nome="menu" [tamanho]="22"></app-icone>
      </button>

      <div class="sobreposicao-menu" *ngIf="menuAberto()" (click)="menuAberto.set(false)"></div>

      <aside class="sidebar" [class.sidebar-aberta]="menuAberto()">
        <div class="sidebar-marca">
          <app-icone nome="jogo" [tamanho]="22"></app-icone>
          <span>Forge Games</span>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="ativo" (click)="menuAberto.set(false)">
            <app-icone nome="dashboard"></app-icone> Dashboard
          </a>
          <a routerLink="/produtos" routerLinkActive="ativo" (click)="menuAberto.set(false)">
            <app-icone nome="jogo"></app-icone> Produtos
          </a>
          <a routerLink="/pedidos" routerLinkActive="ativo" (click)="menuAberto.set(false)">
            <app-icone nome="carrinho"></app-icone> Pedidos
          </a>
          <a routerLink="/usuarios" routerLinkActive="ativo" (click)="menuAberto.set(false)">
            <app-icone nome="usuario"></app-icone> Usuários
          </a>
        </nav>

        <div class="sidebar-rodape">
          <div class="controle-rodape">
            <app-icone nome="moeda" [tamanho]="16"></app-icone>
            <select
              class="seletor-moeda"
              [ngModel]="cotacaoService.moedaSelecionada()"
              (ngModelChange)="cotacaoService.alterarMoeda($event)"
              title="Moeda de exibição (cotação do dia)">
              <option value="BRL">R$ BRL</option>
              <option value="USD">US$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>

          <button
            type="button"
            class="botao-tema"
            (click)="temaService.alternar()"
            [title]="temaService.tema() === 'claro' ? 'Mudar para modo escuro' : 'Mudar para modo claro'">
            <app-icone [nome]="temaService.tema() === 'claro' ? 'lua' : 'sol'" [tamanho]="16"></app-icone>
            {{ temaService.tema() === 'claro' ? 'Modo escuro' : 'Modo claro' }}
          </button>

          <button type="button" class="botao-sair" (click)="sair()" title="Sair da conta">
            <app-icone nome="logout" [tamanho]="16"></app-icone> Sair
          </button>
        </div>
      </aside>
    </ng-container>
  `,
  styles: [`
    .botao-menu-mobile {
      display: none;
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 60;
      background: var(--cor-navbar);
      color: var(--cor-navbar-texto);
      border-radius: 6px;
      padding: 8px;
      margin: 0;
    }
    .sobreposicao-menu {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      z-index: 45;
    }
    .sidebar {
      width: 240px;
      flex-shrink: 0;
      background-color: var(--cor-navbar);
      color: var(--cor-navbar-texto);
      display: flex;
      flex-direction: column;
      padding: 18px 14px;
      min-height: 100vh;
      position: sticky;
      top: 0;
    }
    .sidebar-marca {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 15px;
      padding: 6px 8px 18px;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      margin-bottom: 14px;
    }
    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--cor-navbar-texto);
      text-decoration: none;
      padding: 10px 10px;
      border-radius: 6px;
      font-size: 14px;
      opacity: 0.85;
    }
    .sidebar-nav a:hover {
      background-color: rgba(255,255,255,0.08);
      opacity: 1;
    }
    .sidebar-nav a.ativo {
      background-color: var(--cor-sidebar-ativo);
      color: #eef2ee;
      opacity: 1;
      font-weight: 600;
    }
    .sidebar-rodape {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,0.12);
    }
    .controle-rodape {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .seletor-moeda {
      padding: 6px 8px;
      border-radius: 6px;
      border: 1px solid var(--cor-secundaria);
      background-color: var(--cor-fundo-elevado);
      color: var(--cor-texto);
      width: auto;
      flex: 1;
    }
    .botao-tema, .botao-sair {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.25);
      color: var(--cor-navbar-texto);
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 13px;
      margin: 0;
      width: 100%;
      justify-content: flex-start;
    }
    .botao-tema:hover, .botao-sair:hover {
      background-color: rgba(255,255,255,0.08);
    }

    @media (max-width: 768px) {
      .botao-menu-mobile { display: flex; align-items: center; justify-content: center; }
      .sobreposicao-menu { display: block; }
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
        transition: transform 0.2s ease;
        z-index: 50;
        box-shadow: 2px 0 10px rgba(0,0,0,0.3);
      }
      .sidebar-aberta {
        transform: translateX(0);
      }
    }
  `]
})
export class NavbarComponent {
  menuAberto = signal(false);

  constructor(
    public authService: AuthService,
    public cotacaoService: CotacaoService,
    public temaService: TemaService,
    private router: Router
  ) {}

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
