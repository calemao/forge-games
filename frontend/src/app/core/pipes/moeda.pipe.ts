import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formata um valor em Reais (BRL) convertendo para a moeda selecionada
 * e exibindo o simbolo correto a esquerda (ex: "R$ 699,00", "US$ 132,81").
 * Pipe puro: recalcula automaticamente quando moedaSelecionada ou taxas mudam,
 * pois sao passados como argumentos vindos de signals no template.
 */
@Pipe({ name: 'moeda', standalone: true })
export class MoedaPipe implements PipeTransform {

  private readonly simbolos: Record<string, string> = {
    BRL: 'R$', USD: 'US$', EUR: '€', GBP: '£'
  };

  transform(valorEmReais: number | null | undefined, moeda: string, taxas: Record<string, number>): string {
    const valor = valorEmReais ?? 0;
    const taxa = taxas[moeda] ?? 1;
    const convertido = valor * taxa;
    const simbolo = this.simbolos[moeda] ?? moeda;

    const valorFormatado = convertido.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${simbolo} ${valorFormatado}`;
  }
}
