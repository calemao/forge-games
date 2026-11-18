package com.forgegames.sistema.repositorio;

import com.forgegames.sistema.entidade.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
