import { Injectable, effect, signal } from '@angular/core';

const CHAVE_TEMA = 'loja_artesanal_tema';

/**
 * Controla o tema claro/escuro da aplicacao, persistindo a escolha do
 * usuario no localStorage e aplicando via atributo data-theme no <html>,
 * que o styles.css usa para trocar as variaveis de cor.
 */
@Injectable({ providedIn: 'root' })
export class TemaService {

  readonly tema = signal<'claro' | 'escuro'>(this.obterTemaInicial());

  constructor() {
    effect(() => {
      const temaAtual = this.tema();
      document.documentElement.setAttribute('data-theme', temaAtual);
      try {
        localStorage.setItem(CHAVE_TEMA, temaAtual);
      } catch {
        // ambiente sem localStorage disponivel - ignora
      }
    });
  }

  alternar(): void {
    this.tema.set(this.tema() === 'claro' ? 'escuro' : 'claro');
  }

  private obterTemaInicial(): 'claro' | 'escuro' {
    try {
      const salvo = localStorage.getItem(CHAVE_TEMA);
      if (salvo === 'claro' || salvo === 'escuro') {
        return salvo;
      }
    } catch {
      // ignora
    }
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefereEscuro ? 'escuro' : 'claro';
  }
}
