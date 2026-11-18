import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../core/services/produto.service';
import { CotacaoService } from '../core/services/cotacao.service';
import { ToastService } from '../core/services/toast.service';
import { MoedaPipe } from '../core/pipes/moeda.pipe';
import { IconeComponent } from '../shared/icone/icone.component';
import { Produto } from '../core/models/modelos';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, MoedaPipe, IconeComponent],
  template: `
    <div class="container">
      <div class="topo-pagina">
        <h2>Produtos</h2>
        <button type="button" (click)="novoProduto()" data-testid="btn-novo-produto">
          <app-icone nome="mais" [tamanho]="16"></app-icone> Novo Produto
        </button>
      </div>

      <div *ngIf="exibirFormulario" class="cartao" style="margin-bottom:16px;">
        <h3>{{ produtoEmEdicao.id ? 'Editar' : 'Cadastrar' }} Produto</h3>
        <form (ngSubmit)="salvar()">
          <div class="form-grupo">
            <label>Nome *</label>
            <input [(ngModel)]="produtoEmEdicao.nome" name="nome" data-testid="input-nome" placeholder="Ex: Console XSeries 1TB" required>
          </div>
          <div class="form-grupo">
            <label>Descrição</label>
            <input [(ngModel)]="produtoEmEdicao.descricao" name="descricao" placeholder="Detalhes do produto">
          </div>
          <div class="form-grupo">
            <label>Preço (R$) *</label>
            <input type="number" step="0.01" [(ngModel)]="produtoEmEdicao.preco" name="preco" data-testid="input-preco" required>
          </div>
          <div class="form-grupo">
            <label>Categoria *</label>
            <input [(ngModel)]="produtoEmEdicao.categoria" name="categoria" data-testid="input-categoria" placeholder="Ex: Console, Jogo Físico, Acessório" required>
          </div>
          <div class="form-grupo">
            <label>Quantidade em estoque *</label>
            <input type="number" [(ngModel)]="produtoEmEdicao.quantidadeEmEstoque" name="quantidadeEmEstoque" data-testid="input-estoque" required>
          </div>
          <p class="erro" *ngIf="mensagemErro">{{ mensagemErro }}</p>
          <button type="submit" data-testid="btn-salvar-produto">
            <app-icone nome="salvar" [tamanho]="16"></app-icone> Salvar
          </button>
          <button type="button" class="secundario" (click)="cancelar()">
            <app-icone nome="cancelar" [tamanho]="16"></app-icone> Cancelar
          </button>
        </form>
      </div>

      <div *ngIf="carregando" class="estado-carregando">
        <div class="spinner"></div>
        <span>Carregando produtos...</span>
      </div>

      <div *ngIf="!carregando && produtos.length === 0" class="estado-vazio">
        <app-icone nome="caixa-vazia" [tamanho]="32"></app-icone>
        <span>Nenhum produto cadastrado ainda.</span>
        <span>Clique em "Novo Produto" para começar.</span>
      </div>

      <div class="tabela-wrapper" *ngIf="!carregando && produtos.length > 0">
        <table>
          <thead>
            <tr>
              <th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let produto of produtos" [attr.data-testid]="'linha-produto-' + produto.nome">
              <td>{{ produto.nome }}</td>
              <td>{{ produto.categoria }}</td>
              <td>{{ produto.preco | moeda:cotacaoService.moedaSelecionada():cotacaoService.taxas() }}</td>
              <td>{{ produto.quantidadeEmEstoque }}</td>
              <td>
                <button type="button" (click)="editar(produto)" title="Editar produto">
                  <app-icone nome="lapis" [tamanho]="14"></app-icone> Editar
                </button>
                <button type="button" class="perigo" (click)="excluir(produto)" title="Excluir produto" data-testid="btn-excluir-produto">
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
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  exibirFormulario = false;
  carregando = true;
  mensagemErro = '';
  produtoEmEdicao: Produto = this.produtoVazio();

  constructor(
    private produtoService: ProdutoService,
    public cotacaoService: CotacaoService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: produtos => { this.produtos = produtos; this.carregando = false; },
      error: () => { this.carregando = false; this.toastService.erro('Não foi possível conectar ao servidor.'); }
    });
  }

  produtoVazio(): Produto {
    return { nome: '', descricao: '', preco: 0, categoria: '', quantidadeEmEstoque: 0 };
  }

  novoProduto(): void {
    this.produtoEmEdicao = this.produtoVazio();
    this.exibirFormulario = true;
    this.mensagemErro = '';
  }

  editar(produto: Produto): void {
    this.produtoEmEdicao = { ...produto };
    this.exibirFormulario = true;
    this.mensagemErro = '';
  }

  salvar(): void {
    const operacao = this.produtoEmEdicao.id
      ? this.produtoService.atualizar(this.produtoEmEdicao.id, this.produtoEmEdicao)
      : this.produtoService.cadastrar(this.produtoEmEdicao);

    operacao.subscribe({
      next: () => {
        this.exibirFormulario = false;
        this.toastService.sucesso(this.produtoEmEdicao.id ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mensagemErro = 'Verifique os campos obrigatórios.';
        this.toastService.erro('Não foi possível salvar o produto. Verifique os campos obrigatórios.');
      }
    });
  }

  excluir(produto: Produto): void {
    if (confirm(`Deseja realmente excluir "${produto.nome}"?`)) {
      this.produtoService.excluir(produto.id!).subscribe({
        next: () => {
          this.toastService.sucesso('Produto excluído com sucesso.');
          this.carregar();
        },
        error: (erro) => this.toastService.erro(erro?.error?.erro || 'Não foi possível excluir o produto.')
      });
    }
  }

  cancelar(): void {
    this.exibirFormulario = false;
  }
}
