import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../core/services/usuario.service';
import { ToastService } from '../core/services/toast.service';
import { IconeComponent } from '../shared/icone/icone.component';
import { Usuario } from '../core/models/modelos';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, IconeComponent],
  template: `
    <div class="container">
      <div class="topo-pagina">
        <h2>Usuários</h2>
        <button type="button" (click)="novoUsuario()">
          <app-icone nome="mais" [tamanho]="16"></app-icone> Novo Usuário
        </button>
      </div>

      <div *ngIf="exibirFormulario" class="cartao" style="margin-bottom:16px;">
        <h3>{{ usuarioEmEdicao.id ? 'Editar' : 'Cadastrar' }} Usuário</h3>
        <form (ngSubmit)="salvar()">
          <div class="form-grupo">
            <label>Nome *</label>
            <input [(ngModel)]="usuarioEmEdicao.nome" name="nome" required>
          </div>
          <div class="form-grupo">
            <label>Email *</label>
            <input type="email" [(ngModel)]="usuarioEmEdicao.email" name="email" required>
          </div>
          <div class="form-grupo">
            <label>Senha {{ usuarioEmEdicao.id ? '(deixe vazio para não alterar)' : '*' }}</label>
            <input type="password" [(ngModel)]="usuarioEmEdicao.senha" name="senha">
          </div>
          <div class="form-grupo">
            <label>Papel</label>
            <select [(ngModel)]="usuarioEmEdicao.papel" name="papel">
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>
          <p class="erro" *ngIf="mensagemErro">{{ mensagemErro }}</p>
          <button type="submit">
            <app-icone nome="salvar" [tamanho]="16"></app-icone> Salvar
          </button>
          <button type="button" class="secundario" (click)="cancelar()">
            <app-icone nome="cancelar" [tamanho]="16"></app-icone> Cancelar
          </button>
        </form>
      </div>

      <div *ngIf="carregando" class="estado-carregando">
        <div class="spinner"></div>
        <span>Carregando usuários...</span>
      </div>

      <div *ngIf="!carregando && usuarios.length === 0" class="estado-vazio">
        <app-icone nome="caixa-vazia" [tamanho]="32"></app-icone>
        <span>Nenhum usuário cadastrado ainda.</span>
      </div>

      <div class="tabela-wrapper" *ngIf="!carregando && usuarios.length > 0">
        <table>
          <thead>
            <tr><th>Nome</th><th>Email</th><th>Papel</th><th>Ações</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuarios">
              <td>{{ usuario.nome }}</td>
              <td>{{ usuario.email }}</td>
              <td><span class="badge badge-concluido">{{ usuario.papel }}</span></td>
              <td>
                <button type="button" (click)="editar(usuario)" title="Editar usuário">
                  <app-icone nome="lapis" [tamanho]="14"></app-icone> Editar
                </button>
                <button type="button" class="perigo" (click)="excluir(usuario)" title="Excluir usuário">
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
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  exibirFormulario = false;
  carregando = true;
  mensagemErro = '';
  usuarioEmEdicao: Usuario = this.usuarioVazio();

  constructor(private usuarioService: UsuarioService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: usuarios => { this.usuarios = usuarios; this.carregando = false; },
      error: () => { this.carregando = false; this.toastService.erro('Não foi possível conectar ao servidor.'); }
    });
  }

  usuarioVazio(): Usuario {
    return { nome: '', email: '', senha: '', papel: 'USER' };
  }

  novoUsuario(): void {
    this.usuarioEmEdicao = this.usuarioVazio();
    this.exibirFormulario = true;
    this.mensagemErro = '';
  }

  editar(usuario: Usuario): void {
    this.usuarioEmEdicao = { ...usuario, senha: '' };
    this.exibirFormulario = true;
    this.mensagemErro = '';
  }

  salvar(): void {
    const operacao = this.usuarioEmEdicao.id
      ? this.usuarioService.atualizar(this.usuarioEmEdicao.id, this.usuarioEmEdicao)
      : this.usuarioService.cadastrar(this.usuarioEmEdicao);

    operacao.subscribe({
      next: () => {
        this.exibirFormulario = false;
        this.toastService.sucesso(this.usuarioEmEdicao.id ? 'Usuário atualizado com sucesso.' : 'Usuário cadastrado com sucesso.');
        this.carregar();
      },
      error: () => {
        this.mensagemErro = 'Verifique se o email já está em uso.';
        this.toastService.erro('Não foi possível salvar o usuário. Verifique se o email já está em uso.');
      }
    });
  }

  excluir(usuario: Usuario): void {
    if (confirm(`Deseja realmente excluir o usuário "${usuario.nome}"?`)) {
      this.usuarioService.excluir(usuario.id!).subscribe({
        next: () => { this.toastService.sucesso('Usuário excluído com sucesso.'); this.carregar(); },
        error: (erro) => this.toastService.erro(erro?.error?.erro || 'Não foi possível excluir o usuário.')
      });
    }
  }

  cancelar(): void {
    this.exibirFormulario = false;
  }
}
