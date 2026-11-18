package com.forgegames.sistema.controlador;

import com.forgegames.sistema.dto.ProdutoDTO;
import com.forgegames.sistema.entidade.Produto;
import com.forgegames.sistema.servico.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listar() {
        return produtoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Produto> cadastrar(@Valid @RequestBody ProdutoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.cadastrar(dto));
    }

    @PutMapping("/{id}")
    public Produto atualizar(@PathVariable Long id, @Valid @RequestBody ProdutoDTO dto) {
        return produtoService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
