export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  quantidadeEmEstoque: number;
}

export interface Pedido {
  id?: number;
  produto: Produto;
  quantidade: number;
  dataPedido: string;
  valorTotal: number;
  status: string;
}

export interface NovoPedido {
  produtoId: number;
  quantidade: number;
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  papel: string;
}
