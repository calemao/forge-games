package com.forgegames.sistema.config;

import com.forgegames.sistema.servico.EstoqueInsuficienteException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class TratadorDeExcecoes {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> tratarValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                erros.put(erro.getField(), erro.getDefaultMessage()));
        return ResponseEntity.badRequest().body(erros);
    }

    @ExceptionHandler(EstoqueInsuficienteException.class)
    public ResponseEntity<Map<String, String>> tratarEstoqueInsuficiente(EstoqueInsuficienteException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("erro", ex.getMessage()));
    }

    /**
     * Garante que toda ResponseStatusException (404, 401, 409 etc.) lancada
     * nos servicos chegue ao front-end num formato previsivel {"erro": "..."},
     * independente de configuracoes padrao do Spring Boot para corpo de erro.
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> tratarResponseStatus(ResponseStatusException ex) {
        String mensagem = ex.getReason() != null ? ex.getReason() : "Ocorreu um erro ao processar a solicitacao.";
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("erro", mensagem));
    }
}
