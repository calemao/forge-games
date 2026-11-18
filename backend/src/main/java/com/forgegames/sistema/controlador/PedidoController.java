package com.forgegames.sistema.controlador;

import com.forgegames.sistema.dto.PedidoDTO;
import com.forgegames.sistema.entidade.Pedido;
import com.forgegames.sistema.servico.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public List<Pedido> listar() {
        return pedidoService.listarTodos();
    }

    @GetMapping("/{id}")
    public Pedido buscarPorId(@PathVariable Long id) {
        return pedidoService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Pedido> criar(@Valid @RequestBody PedidoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.criar(dto));
    }

    @PutMapping("/{id}/status")
    public Pedido atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> corpo) {
        return pedidoService.atualizarStatus(id, corpo.get("status"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pedidoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
