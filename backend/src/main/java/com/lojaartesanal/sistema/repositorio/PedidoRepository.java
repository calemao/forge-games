package com.lojaartesanal.sistema.repositorio;

import com.lojaartesanal.sistema.entidade.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
