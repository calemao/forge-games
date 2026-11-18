package com.forgegames.sistema.entidade;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O produto do pedido é obrigatório.")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @NotNull(message = "A quantidade é obrigatória.")
    @Positive(message = "A quantidade deve ser maior que zero.")
    private Integer quantidade;

    @NotNull(message = "A data do pedido é obrigatória.")
    private LocalDate dataPedido;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @NotNull(message = "O status é obrigatório.")
    private String status;

    public Pedido() {}

    public Pedido(Produto produto, Integer quantidade, LocalDate dataPedido, BigDecimal valorTotal, String status) {
        this.produto = produto;
        this.quantidade = quantidade;
        this.dataPedido = dataPedido;
        this.valorTotal = valorTotal;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public LocalDate getDataPedido() { return dataPedido; }
    public void setDataPedido(LocalDate dataPedido) { this.dataPedido = dataPedido; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
