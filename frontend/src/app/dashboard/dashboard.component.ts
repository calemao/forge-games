import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../core/services/produto.service';
import { PedidoService } from '../core/services/pedido.service';
import { CotacaoService } from '../core/services/cotacao.service';
import { MoedaPipe } from '../core/pipes/moeda.pipe';
import { IconeComponent } from '../shared/icone/icone.component';
import { Produto, Pedido } from '../core/models/modelos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MoedaPipe, IconeComponent],
  template: `
    <div class="container">
      <h2>Dashboard</h2>
      <p style="color: var(--cor-texto-suave); margin-top:-10px;">Visão geral da loja de jogos e consoles</p>
      <div class="grade-cartoes">
        <div class="cartao cartao-indicador">
          <app-icone nome="jogo" [tamanho]="22"></app-icone>
          <h3>{{ produtos.length }}</h3>
          <p>Produtos cadastrados</p>
          <a routerLink="/produtos">Ver produtos</a>
        </div>
        <div class="cartao cartao-indicador">
          <app-icone nome="carrinho" [tamanho]="22"></app-icone>
          <h3>{{ pedidos.length }}</h3>
          <p>Pedidos realizados</p>
          <a routerLink="/pedidos">Ver pedidos</a>
        </div>
        <div class="cartao cartao-indicador cartao-sucesso">
          <app-icone nome="check" [tamanho]="22"></app-icone>
          <h3>{{ valorVendasConfirmadas | moeda:cotacaoService.moedaSelecionada():cotacaoService.taxas() }}</h3>
          <p>Vendas confirmadas</p>
        </div>
        <div class="cartao cartao-indicador cartao-pendente">
          <app-icone nome="alerta" [tamanho]="22"></app-icone>
          <h3>{{ valorVendasPendentes | moeda:cotacaoService.moedaSelecionada():cotacaoService.taxas() }}</h3>
          <p>Pendente de confirmação</p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  produtos: Produto[] = [];
  pedidos: Pedido[] = [];
  valorVendasConfirmadas = 0;
  valorVendasPendentes = 0;

  constructor(
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    public cotacaoService: CotacaoService
  ) {}

  ngOnInit(): void {
    this.produtoService.listar().subscribe(produtos => this.produtos = produtos);
    this.pedidoService.listar().subscribe(pedidos => {
      this.pedidos = pedidos;
      this.valorVendasConfirmadas = pedidos
        .filter(p => p.status === 'CONCLUIDO')
        .reduce((soma, p) => soma + p.valorTotal, 0);
      this.valorVendasPendentes = pedidos
        .filter(p => p.status === 'PENDENTE')
        .reduce((soma, p) => soma + p.valorTotal, 0);
    });
  }
}
