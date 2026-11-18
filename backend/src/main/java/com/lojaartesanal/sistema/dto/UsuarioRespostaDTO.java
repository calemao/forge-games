package com.lojaartesanal.sistema.dto;

import com.lojaartesanal.sistema.entidade.Usuario;

/**
 * DTO de resposta para Usuario - nunca expoe a senha (nem o hash) nas respostas da API.
 */
public class UsuarioRespostaDTO {
    private Long id;
    private String nome;
    private String email;
    private String papel;

    public UsuarioRespostaDTO(Usuario usuario) {
        this.id = usuario.getId();
        this.nome = usuario.getNome();
        this.email = usuario.getEmail();
        this.papel = usuario.getPapel();
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getPapel() { return papel; }
}
