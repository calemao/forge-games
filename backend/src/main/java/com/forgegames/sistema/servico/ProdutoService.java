package com.forgegames.sistema.servico;

import com.forgegames.sistema.dto.ProdutoDTO;
import com.forgegames.sistema.entidade.Produto;
import com.forgegames.sistema.repositorio.ProdutoRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado."));
    }

    public Produto cadastrar(ProdutoDTO dto) {
        validar(dto);
        Produto produto = new Produto(dto.getNome(), dto.getDescricao(), dto.getPreco(), dto.getCategoria(), dto.getQuantidadeEmEstoque());
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, ProdutoDTO dto) {
        validar(dto);
        Produto produto = buscarPorId(id);
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setCategoria(dto.getCategoria());
        produto.setQuantidadeEmEstoque(dto.getQuantidadeEmEstoque());
        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado.");
        }
        try {
            produtoRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Nao e possivel excluir este produto pois ele possui pedidos associados. Exclua os pedidos relacionados primeiro.");
        }
    }

    private void validar(ProdutoDTO dto) {
        if (dto.getPreco() == null || dto.getPreco().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O preço deve ser maior que zero.");
        }
        if (dto.getQuantidadeEmEstoque() == null || dto.getQuantidadeEmEstoque() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A quantidade em estoque não pode ser negativa.");
        }
    }
}
