package com.forgegames.sistema.integracao;

import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Testes E2E (Selenium) do fluxo completo via navegador, contra a aplicacao
 * rodando de verdade: backend em http://localhost:8080 e frontend Angular
 * em http://localhost:4200 (ambos precisam estar rodando antes de executar
 * esta classe - ver instrucoes no README.md).
 *
 * Usa Microsoft Edge (EdgeDriver) com o Selenium Manager built-in do
 * Selenium 4.6+, sem WebDriverManager.
 *
 * Os seletores usam atributos data-testid estaveis (em vez de depender do
 * texto visivel ou da estrutura visual da tela), para que o teste continue
 * funcionando mesmo apos mudancas no design da interface.
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ForgeGamesSeleniumTest {

    private static WebDriver driver;
    private static final String URL_BASE = "http://localhost:4200";
    private static final String NOME_PRODUTO_TESTE = "Console Selenium Edicao Especial";

    @BeforeAll
    static void configurar() {
        EdgeOptions opcoes = new EdgeOptions();
        driver = new EdgeDriver(opcoes);
        driver.manage().window().maximize();
    }

    @AfterAll
    static void finalizar() {
        if (driver != null) {
            driver.quit();
        }
    }

    private void fazerLogin(WebDriverWait wait) {
        driver.get(URL_BASE + "/login");

        // Espera o campo ficar realmente clicavel (nao so presente no DOM) -
        // logo apos a navegacao, o Angular pode ainda nao ter terminado de
        // "ligar" os eventos no campo, e um sendKeys muito cedo perde os
        // primeiros caracteres digitados, fazendo o login falhar por
        // credenciais erradas mesmo com o texto certo no codigo do teste.
        WebElement campoEmail = wait.until(
                ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='input-email']")));
        campoEmail.clear();
        campoEmail.sendKeys("admin@forgegames.com");

        WebElement campoSenha = driver.findElement(By.cssSelector("[data-testid='input-senha']"));
        campoSenha.clear();
        campoSenha.sendKeys("admin123");

        driver.findElement(By.cssSelector("[data-testid='btn-entrar']")).click();
        wait.until(ExpectedConditions.urlContains("/dashboard"));
    }

    @Test
    @Order(1)
    void deveFazerLoginECadastrarUmNovoProdutoComSucesso() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        fazerLogin(wait);

        driver.get(URL_BASE + "/produtos");
        wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='btn-novo-produto']"))).click();

        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("[data-testid='input-nome']")))
                .sendKeys(NOME_PRODUTO_TESTE);
        driver.findElement(By.cssSelector("[data-testid='input-preco']")).sendKeys("349.90");
        driver.findElement(By.cssSelector("[data-testid='input-categoria']")).sendKeys("Console");
        driver.findElement(By.cssSelector("[data-testid='input-estoque']")).sendKeys("8");

        driver.findElement(By.cssSelector("[data-testid='btn-salvar-produto']")).click();

        WebElement linha = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("[data-testid='linha-produto-" + NOME_PRODUTO_TESTE + "']")));

        assertTrue(linha.getText().contains(NOME_PRODUTO_TESTE), "O produto cadastrado deveria aparecer na listagem.");
    }

    @Test
    @Order(2)
    void deveFazerLoginEExcluirProdutoCadastradoAnteriormente() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        fazerLogin(wait);

        driver.get(URL_BASE + "/produtos");
        WebElement linha = wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("[data-testid='linha-produto-" + NOME_PRODUTO_TESTE + "']")));

        linha.findElement(By.cssSelector("[data-testid='btn-excluir-produto']")).click();

        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();

        wait.until(ExpectedConditions.invisibilityOfElementLocated(
                By.cssSelector("[data-testid='linha-produto-" + NOME_PRODUTO_TESTE + "']")));

        boolean linhaAindaPresente = !driver.findElements(
                By.cssSelector("[data-testid='linha-produto-" + NOME_PRODUTO_TESTE + "']")).isEmpty();
        assertFalse(linhaAindaPresente, "O produto excluido nao deveria mais aparecer na listagem.");
    }
}
