import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../core/services/pedido.service';
import { ProdutoService } from '../core/services/produto.service';
import { CotacaoService } from '../core/services/cotacao.service';
import { ToastService } from '../core/services/toast.service';
import { MoedaPipe } from '../core/pipes/moeda.pipe';
import { IconeComponent } from '../shared/icone/icone.component';
import { Pedido, Produto } from '../core/models/modelos';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, MoedaPipe, IconeComponent],
  template: `
    <div class="container">
      <div class="topo-pagina">
        <h2>Pedidos</h2>
        <button type="button" (click)="exibirFormulario = !exibirFormulario" data-testid="btn-novo-pedido">
          <app-icone nome="mais" [tamanho]="16"></app-icone> Novo Pedido
        </button>
      </div>

      <div *ngIf="exibirFormulario" class="cartao" style="margin-bottom:16px;">
        <h3>Novo Pedido</h3>
        <form (ngSubmit)="salvar()">
          <div class="form-grupo">
            <label>Produto *</label>
            <select [(ngModel)]="produtoSelecionadoId" name="produtoId" data-testid="select-produto" required>
              <option [ngValue]="null" disabled>Selecione um produto</option>
              <option *ngFor="let produto of produtos" [ngValue]="produto.id">
                {{ produto.nome }} (estoque: {{ produto.quantidadeEmEstoque }})
              </option>
            </select>
          </div>
          <div class="form-grupo">
            <label>Quantidade *</label>
            <input type="number" min="1" [(ngModel)]="quantidade" name="quantidade" data-testid="input-quantidade" required>
          </div>
          <p class="erro" *ngIf="mensagemErro">{{ mensagemErro }}</p>
          <button type="submit" data-testid="btn-confirmar-pedido">
            <app-icone nome="salvar" [tamanho]="16"></app-icone> Confirmar Pedido
          </button>
          <button type="button" class="secundario" (click)="exibirFormulario = false">
            <app-icone nome="cancelar" [tamanho]="16"></app-icone> Cancelar
          </button>
        </form>
      </div>

      <div *ngIf="carregando" class="estado-carregando">
        <div class="spinner"></div>
        <span>Carregando pedidos...</span>
      </div>

      <div *ngIf="!carregando && pedidos.length === 0" class="estado-vazio">
        <app-icone nome="caixa-vazia" [tamanho]="32"></app-icone>
        <span>Nenhum pedido registrado ainda.</span>
        <span>Clique em "Novo Pedido" para começar.</span>
      </div>

      <div class="tabela-wrapper" *ngIf="!carregando && pedidos.length > 0">
        <table>
          <thead>
            <tr>
              <th>Produto</th><th>Quantidade</th><th>Data</th><th>Valor Total</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let pedido of pedidos">
              <td>{{ pedido.produto.nome }}</td>
              <td>{{ pedido.quantidade }}</td>
              <td>{{ pedido.dataPedido }}</td>
              <td>{{ pedido.valorTotal | moeda:cotacaoService.moedaSelecionada():cotacaoService.taxas() }}</td>
              <td>
                <span class="badge" [class.badge-pendente]="pedido.status === 'PENDENTE'" [class.badge-concluido]="pedido.status === 'CONCLUIDO'">
                  {{ pedido.status }}
                </span>
              </td>
              <td>
                <button type="button" (click)="concluir(pedido.id!)" *ngIf="pedido.status === 'PENDENTE'" title="Marcar como concluído">
                  <app-icone nome="check" [tamanho]="14"></app-icone> Concluir
                </button>
                <button type="button" class="perigo" (click)="excluir(pedido)" title="Excluir pedido">
                  <app-icone nome="lixeira" [tamanho]="14"></app-icone> Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  produtos: Produto[] = [];
  exibirFormulario = false;
  carregando = true;
  mensagemErro = '';
  produtoSelecionadoId: number | null = null;
  quantidade = 1;

  constructor(
    private pedidoService: PedidoService,
    private produtoService: ProdutoService,
    public cotacaoService: CotacaoService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.carregar();
    this.produtoService.listar().subscribe(produtos => this.produtos = produtos);
  }

  carregar(): void {
    this.carregando = true;
    this.pedidoService.listar().subscribe({
      next: pedidos => { this.pedidos = pedidos; this.carregando = false; },
      error: () => { this.carregando = false; this.toastService.erro('Não foi possível conectar ao servidor.'); }
    });
  }

  salvar(): void {
    if (!this.produtoSelecionadoId) {
      this.mensagemErro = 'Selecione um produto.';
      return;
    }

    this.pedidoService.criar({ produtoId: this.produtoSelecionadoId, quantidade: this.quantidade }).subscribe({
      next: () => {
        this.exibirFormulario = false;
        this.quantidade = 1;
        this.produtoSelecionadoId = null;
        this.mensagemErro = '';
        this.toastService.sucesso('Pedido criado com sucesso.');
        this.carregar();
        this.produtoService.listar().subscribe(produtos => this.produtos = produtos);
      },
      error: (erro) => {
        const mensagem = erro?.error?.erro || 'Erro ao criar pedido. Verifique o estoque disponível.';
        this.mensagemErro = mensagem;
        this.toastService.erro(mensagem);
      }
    });
  }

  concluir(id: number): void {
    this.pedidoService.atualizarStatus(id, 'CONCLUIDO').subscribe({
      next: () => { this.toastService.sucesso('Pedido marcado como concluído.'); this.carregar(); },
      error: () => this.toastService.erro('Não foi possível atualizar o pedido.')
    });
  }

  excluir(pedido: Pedido): void {
    if (confirm(`Deseja realmente excluir este pedido? O estoque sera devolvido.`)) {
      this.pedidoService.excluir(pedido.id!).subscribe({
        next: () => { this.toastService.sucesso('Pedido excluído com sucesso.'); this.carregar(); },
        error: () => this.toastService.erro('Não foi possível excluir o pedido.')
      });
    }
  }
}
