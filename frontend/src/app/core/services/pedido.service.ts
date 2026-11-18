import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NovoPedido, Pedido } from '../models/modelos';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private readonly apiUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  criar(pedido: NovoPedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  atualizarStatus(id: number, status: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}/${id}/status`, { status });
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
