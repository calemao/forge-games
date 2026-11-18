package com.forgegames.sistema.dto;

public class TokenRespostaDTO {
    private String token;
    private String tipo = "Bearer";

    public TokenRespostaDTO(String token) {
        this.token = token;
    }

    public String getToken() { return token; }
    public String getTipo() { return tipo; }
}
