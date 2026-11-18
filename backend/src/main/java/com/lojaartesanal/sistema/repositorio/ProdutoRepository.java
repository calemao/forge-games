package com.lojaartesanal.sistema.repositorio;

import com.lojaartesanal.sistema.entidade.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
