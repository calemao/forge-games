package com.lojaartesanal.sistema.controlador;

import com.lojaartesanal.sistema.dto.UsuarioDTO;
import com.lojaartesanal.sistema.dto.UsuarioRespostaDTO;
import com.lojaartesanal.sistema.servico.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioRespostaDTO> listar() {
        return usuarioService.listarTodos().stream().map(UsuarioRespostaDTO::new).toList();
    }

    @GetMapping("/{id}")
    public UsuarioRespostaDTO buscarPorId(@PathVariable Long id) {
        return new UsuarioRespostaDTO(usuarioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioRespostaDTO> cadastrar(@Valid @RequestBody UsuarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioRespostaDTO(usuarioService.cadastrar(dto)));
    }

    @PutMapping("/{id}")
    public UsuarioRespostaDTO atualizar(@PathVariable Long id, @Valid @RequestBody UsuarioDTO dto) {
        return new UsuarioRespostaDTO(usuarioService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
