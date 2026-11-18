package com.forgegames.sistema.servico;

import com.forgegames.sistema.dto.ProdutoDTO;
import com.forgegames.sistema.repositorio.ProdutoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    @Test
    void deveRejeitarCadastroComPrecoMenorOuIgualAZero() {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setNome("Volante Logitech G29");
        dto.setDescricao("Volante para simuladores de corrida");
        dto.setPreco(new BigDecimal("0.00"));
        dto.setCategoria("Utensilios");
        dto.setQuantidadeEmEstoque(5);

        ResponseStatusException excecao = assertThrows(ResponseStatusException.class,
                () -> produtoService.cadastrar(dto));

        assertEquals(400, excecao.getStatusCode().value());
        verify(produtoRepository, never()).save(any());
    }
}
