package com.forgegames.sistema.repositorio;

import com.forgegames.sistema.entidade.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
