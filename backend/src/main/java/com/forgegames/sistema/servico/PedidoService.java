package com.forgegames.sistema.servico;

import com.forgegames.sistema.dto.PedidoDTO;
import com.forgegames.sistema.entidade.Pedido;
import com.forgegames.sistema.entidade.Produto;
import com.forgegames.sistema.repositorio.PedidoRepository;
import com.forgegames.sistema.repositorio.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

/**
 * Regras de negocio do Pedido:
 * - valorTotal = produto.preco * quantidade (calculado no servidor, nunca recebido do cliente)
 * - ao criar um pedido, a quantidade solicitada e debitada do estoque do produto
 * - se a quantidade solicitada for maior que o estoque disponivel, o pedido e rejeitado
 */
@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public PedidoService(PedidoRepository pedidoRepository, ProdutoRepository produtoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado."));
    }

    @Transactional
    public Pedido criar(PedidoDTO dto) {
        Produto produto = produtoRepository.findById(dto.getProdutoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));

        if (dto.getQuantidade() == null || dto.getQuantidade() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade deve ser maior que zero.");
        }

        if (dto.getQuantidade() > produto.getQuantidadeEmEstoque()) {
            throw new EstoqueInsuficienteException(
                    "Estoque insuficiente para o produto '" + produto.getNome() + "'. Disponível: "
                            + produto.getQuantidadeEmEstoque() + ", solicitado: " + dto.getQuantidade() + ".");
        }

        produto.setQuantidadeEmEstoque(produto.getQuantidadeEmEstoque() - dto.getQuantidade());
        produtoRepository.save(produto);

        var valorTotal = produto.getPreco().multiply(java.math.BigDecimal.valueOf(dto.getQuantidade()));

        Pedido pedido = new Pedido(produto, dto.getQuantidade(), LocalDate.now(), valorTotal, "PENDENTE");
        return pedidoRepository.save(pedido);
    }

    public Pedido atualizarStatus(Long id, String novoStatus) {
        Pedido pedido = buscarPorId(id);
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public void excluir(Long id) {
        Pedido pedido = buscarPorId(id);
        // devolve a quantidade ao estoque ao cancelar/excluir o pedido
        Produto produto = pedido.getProduto();
        produto.setQuantidadeEmEstoque(produto.getQuantidadeEmEstoque() + pedido.getQuantidade());
        produtoRepository.save(produto);
        pedidoRepository.deleteById(id);
    }
}
