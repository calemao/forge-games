import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { AuthService } from './core/services/auth.service';
import { TemaService } from './core/services/tema.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastContainerComponent],
  template: `
    <div class="app-shell" [class.app-shell-autenticado]="authService.estaAutenticado()">
      <app-navbar></app-navbar>
      <main class="app-conteudo">
        <router-outlet></router-outlet>
      </main>
    </div>
    <app-toast-container></app-toast-container>
  `,
  styles: [`
    .app-shell {
      display: flex;
      min-height: 100vh;
    }
    .app-conteudo {
      flex: 1;
      min-width: 0;
    }
  `]
})
export class AppComponent {
  // TemaService injetado aqui para garantir que o tema seja aplicado assim
  // que o app sobe, mesmo antes da sidebar (oculta na tela de login) existir
  constructor(public authService: AuthService, private temaService: TemaService) {}
}
