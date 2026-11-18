package com.forgegames.sistema.api;

import com.forgegames.sistema.entidade.Produto;
import com.forgegames.sistema.repositorio.ProdutoRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Testes de API (REST-assured) rodando contra a aplicacao real
 * (banco H2 em arquivo), cobrindo o fluxo principal de autenticacao
 * e criacao de pedido.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PedidoApiTest {

    @LocalServerPort
    private int porta;

    @Autowired
    private ProdutoRepository produtoRepository;

    private String token;
    private Long produtoId;

    @BeforeEach
    void configurar() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = porta;

        Produto produto = new Produto("Controle Xbox Wireless", "Controle sem fio para Xbox Series X/S",
                new BigDecimal("120.00"), "Acessorios", 20);
        produtoId = produtoRepository.save(produto).getId();

        token = given()
                .contentType(ContentType.JSON)
                .body(Map.of("email", "admin@forgegames.com", "senha", "admin123"))
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract().path("token");
    }

    @Test
    void deveCriarPedidoComSucessoERetornarValorTotalCalculado() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(Map.of("produtoId", produtoId, "quantidade", 3))
                .when()
                .post("/pedidos")
                .then()
                .statusCode(201)
                .body("valorTotal", equalTo(360.0f))
                .body("status", equalTo("PENDENTE"));
    }

    @Test
    void deveRejeitarLoginComCredenciaisInvalidas() {
        given()
                .contentType(ContentType.JSON)
                .body(Map.of("email", "admin@forgegames.com", "senha", "senhaErrada"))
                .when()
                .post("/auth/login")
                .then()
                .statusCode(401);
    }

    @Test
    void deveRejeitarAcessoAProdutosSemToken() {
        given()
                .when()
                .get("/produtos")
                .then()
                .statusCode(403);
    }
}
