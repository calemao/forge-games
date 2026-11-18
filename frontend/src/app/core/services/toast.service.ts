import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  mensagem: string;
}

/**
 * Centraliza o feedback visual de operacoes (sucesso/erro/aviso), em
 * substituicao ao uso de alert() do navegador para esse fim. As
 * confirmacoes de exclusao continuam usando confirm() nativo, que e
 * uma pergunta antes da acao, nao um aviso de resultado.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {

  private proximoId = 1;
  readonly toasts = signal<Toast[]>([]);

  sucesso(mensagem: string): void {
    this.adicionar('sucesso', mensagem);
  }

  erro(mensagem: string): void {
    this.adicionar('erro', mensagem);
  }

  aviso(mensagem: string): void {
    this.adicionar('aviso', mensagem);
  }

  info(mensagem: string): void {
    this.adicionar('info', mensagem);
  }

  remover(id: number): void {
    this.toasts.update(lista => lista.filter(t => t.id !== id));
  }

  private adicionar(tipo: Toast['tipo'], mensagem: string): void {
    const id = this.proximoId++;
    this.toasts.update(lista => [...lista, { id, tipo, mensagem }]);
    setTimeout(() => this.remover(id), 4500);
  }
}
