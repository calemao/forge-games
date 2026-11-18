package com.forgegames.sistema.entidade;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

@Entity
@Table(name = "produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto é obrigatório.")
    private String nome;

    private String descricao;

    @NotNull(message = "O preço é obrigatório.")
    @Positive(message = "O preço deve ser maior que zero.")
    @Column(precision = 10, scale = 2)
    private BigDecimal preco;

    @NotBlank(message = "A categoria é obrigatória.")
    private String categoria;

    @NotNull(message = "A quantidade em estoque é obrigatória.")
    @PositiveOrZero(message = "A quantidade em estoque não pode ser negativa.")
    private Integer quantidadeEmEstoque;

    public Produto() {}

    public Produto(String nome, String descricao, BigDecimal preco, String categoria, Integer quantidadeEmEstoque) {
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.categoria = categoria;
        this.quantidadeEmEstoque = quantidadeEmEstoque;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getPreco() { return preco; }
    public void setPreco(BigDecimal preco) { this.preco = preco; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getQuantidadeEmEstoque() { return quantidadeEmEstoque; }
    public void setQuantidadeEmEstoque(Integer quantidadeEmEstoque) { this.quantidadeEmEstoque = quantidadeEmEstoque; }
}
