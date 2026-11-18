import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * Busca a cotacao do dia (BRL como base) em uma API publica e gratuita,
 * sem necessidade de chave de API. Os valores no banco de dados
 * continuam sempre em Reais (BRL) - essa conversao e apenas visual,
 * feita no front-end multiplicando o valor em BRL pela taxa da moeda
 * selecionada.
 */
@Injectable({ providedIn: 'root' })
export class CotacaoService {

  private readonly apiUrl = 'https://open.er-api.com/v6/latest/BRL';

  readonly simbolos: Record<string, string> = {
    BRL: 'R$',
    USD: 'US$',
    EUR: '€',
    GBP: '£'
  };

  // taxas de conversao a partir de 1 BRL (valores de fallback caso a API nao responda)
  readonly taxas = signal<Record<string, number>>({ BRL: 1, USD: 0.19, EUR: 0.17, GBP: 0.15 });
  readonly moedaSelecionada = signal<string>('BRL');
  readonly carregando = signal<boolean>(true);

  constructor(private http: HttpClient) {
    this.carregarCotacoes();
  }

  private carregarCotacoes(): void {
    this.http.get<{ rates: Record<string, number> }>(this.apiUrl).subscribe({
      next: (resposta) => {
        const taxasDisponiveis = resposta.rates;
        this.taxas.set({
          BRL: 1,
          USD: taxasDisponiveis['USD'] ?? this.taxas()['USD'],
          EUR: taxasDisponiveis['EUR'] ?? this.taxas()['EUR'],
          GBP: taxasDisponiveis['GBP'] ?? this.taxas()['GBP']
        });
        this.carregando.set(false);
      },
      error: () => {
        // mantem os valores de fallback caso a API esteja indisponivel
        this.carregando.set(false);
      }
    });
  }

  alterarMoeda(moeda: string): void {
    this.moedaSelecionada.set(moeda);
  }

  converter(valorEmReais: number): number {
    const taxa = this.taxas()[this.moedaSelecionada()] ?? 1;
    return (valorEmReais ?? 0) * taxa;
  }
}
