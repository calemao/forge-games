package com.lojaartesanal.sistema.servico;

import com.lojaartesanal.sistema.dto.PedidoDTO;
import com.lojaartesanal.sistema.entidade.Pedido;
import com.lojaartesanal.sistema.entidade.Produto;
import com.lojaartesanal.sistema.repositorio.PedidoRepository;
import com.lojaartesanal.sistema.repositorio.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Testes unitarios da regra de negocio mais importante do Pedido:
 * calculo do valor total e controle de estoque, isolando a camada
 * de persistencia com Mockito (nao toca banco real).
 */
@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private PedidoService pedidoService;

    private Produto produto;

    @BeforeEach
    void configurar() {
        produto = new Produto("Vaso de Ceramica", "Vaso artesanal pintado a mao",
                new BigDecimal("50.00"), "Decoracao", 10);
        produto.setId(1L);
    }

    @Test
    void deveCalcularValorTotalCorretamenteAoCriarPedido() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        PedidoDTO dto = new PedidoDTO();
        dto.setProdutoId(1L);
        dto.setQuantidade(3);

        Pedido pedido = pedidoService.criar(dto);

        assertEquals(new BigDecimal("150.00"), pedido.getValorTotal());
        assertEquals("PENDENTE", pedido.getStatus());
    }

    @Test
    void deveRejeitarPedidoQuandoQuantidadeExcedeEstoque() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        PedidoDTO dto = new PedidoDTO();
        dto.setProdutoId(1L);
        dto.setQuantidade(15); // estoque tem so 10

        assertThrows(EstoqueInsuficienteException.class, () -> pedidoService.criar(dto));
        verify(pedidoRepository, never()).save(any());
    }

    @Test
    void deveDebitarEstoqueAoCriarPedidoComSucesso() {
        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));
        when(produtoRepository.save(any(Produto.class))).thenReturn(produto);
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocacao -> invocacao.getArgument(0));

        PedidoDTO dto = new PedidoDTO();
        dto.setProdutoId(1L);
        dto.setQuantidade(4);

        pedidoService.criar(dto);

        assertEquals(6, produto.getQuantidadeEmEstoque());
        verify(produtoRepository, times(1)).save(produto);
    }
}
