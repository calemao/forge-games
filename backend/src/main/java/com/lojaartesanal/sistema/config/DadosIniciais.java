package com.lojaartesanal.sistema.config;

import com.lojaartesanal.sistema.entidade.Pedido;
import com.lojaartesanal.sistema.entidade.Produto;
import com.lojaartesanal.sistema.entidade.Usuario;
import com.lojaartesanal.sistema.repositorio.PedidoRepository;
import com.lojaartesanal.sistema.repositorio.ProdutoRepository;
import com.lojaartesanal.sistema.repositorio.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Popula o banco com dados de demonstracao na primeira execucao (cada bloco
 * so roda se a respectiva tabela ainda estiver vazia, para nao duplicar
 * registros em execucoes seguintes).
 * Login inicial: admin@loja.com / admin123
 */
@Component
public class DadosIniciais implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;
    private final PedidoRepository pedidoRepository;
    private final PasswordEncoder passwordEncoder;

    public DadosIniciais(UsuarioRepository usuarioRepository,
                          ProdutoRepository produtoRepository,
                          PedidoRepository pedidoRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.produtoRepository = produtoRepository;
        this.pedidoRepository = pedidoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        semearUsuarios();
        semearProdutosEPedidos();
    }

    private void semearUsuarios() {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(new Usuario("Administrador", "admin@loja.com",
                    passwordEncoder.encode("admin123"), "ADMIN"));
            usuarioRepository.save(new Usuario("Lucca Araújo", "lucca@forgegames.com",
                    passwordEncoder.encode("lucca123"), "FUNCIONARIO"));
            usuarioRepository.save(new Usuario("Lucas Valadares", "lucas@forgegames.com",
                    passwordEncoder.encode("lucas123"), "FUNCIONARIO"));
        }
    }

    private void semearProdutosEPedidos() {
        if (produtoRepository.count() > 0) {
            return;
        }

        Produto xboxSeriesX = produtoRepository.save(new Produto(
                "Xbox Series X", "Console de nova geração, 1TB SSD, 4K nativo", novo("4299.90"),
                "Console", 10));
        Produto xboxSeriesS = produtoRepository.save(new Produto(
                "Xbox Series S", "Console compacto, 512GB SSD, somente digital", novo("2499.90"),
                "Console", 12));
        Produto playstation5 = produtoRepository.save(new Produto(
                "PlayStation 5", "Console com leitor de disco, 825GB SSD", novo("4199.90"),
                "Console", 6));
        Produto nintendoSwitch2 = produtoRepository.save(new Produto(
                "Nintendo Switch 2", "Console híbrido portátil/TV", novo("3499.90"),
                "Console", 10));
        Produto haloInfinite = produtoRepository.save(new Produto(
                "Halo Infinite", "Jogo de tiro em primeira pessoa, mídia física", novo("249.90"),
                "Jogo Físico", 25));
        Produto gearsEDay = produtoRepository.save(new Produto(
                "Gears of War: E-Day", "Jogo de ação em terceira pessoa, mídia física", novo("299.90"),
                "Jogo Físico", 18));
        Produto codBlackOps7 = produtoRepository.save(new Produto(
                "Call of Duty: Black Ops 7", "Jogo de tiro em primeira pessoa, mídia física", novo("349.90"),
                "Jogo Físico", 22));
        Produto mortalKombat1 = produtoRepository.save(new Produto(
                "Mortal Kombat 1", "Jogo de luta, mídia física", novo("279.90"),
                "Jogo Físico", 17));
        Produto forzaHorizon5 = produtoRepository.save(new Produto(
                "Forza Horizon 5", "Jogo de corrida, versão digital (código de download)", novo("249.90"),
                "Jogo Digital", 60));
        Produto controleXbox = produtoRepository.save(new Produto(
                "Controle Xbox Wireless", "Controle sem fio, compatível com PC e console", novo("399.90"),
                "Acessório", 35));
        Produto headsetHyperX = produtoRepository.save(new Produto(
                "Headset HyperX Cloud II", "Headset gamer com som surround 7.1", novo("349.90"),
                "Acessório", 15));
        Produto volanteLogitech = produtoRepository.save(new Produto(
                "Volante Logitech G29", "Volante com force feedback e pedaleira", novo("1299.90"),
                "Acessório", 8));

        if (pedidoRepository.count() > 0) {
            return;
        }

        List<Pedido> pedidos = List.of(
                pedido(xboxSeriesX, 1, 5, "CONCLUIDO"),
                pedido(xboxSeriesX, 1, 1, "PENDENTE"),
                pedido(xboxSeriesS, 1, 2, "CONCLUIDO"),
                pedido(xboxSeriesS, 1, 0, "PENDENTE"),
                pedido(playstation5, 1, 6, "CONCLUIDO"),
                pedido(nintendoSwitch2, 1, 7, "CONCLUIDO"),
                pedido(haloInfinite, 2, 4, "CONCLUIDO"),
                pedido(haloInfinite, 1, 1, "PENDENTE"),
                pedido(gearsEDay, 2, 3, "CONCLUIDO"),
                pedido(codBlackOps7, 2, 2, "CONCLUIDO"),
                pedido(codBlackOps7, 1, 0, "PENDENTE"),
                pedido(mortalKombat1, 2, 3, "CONCLUIDO"),
                pedido(mortalKombat1, 1, 0, "PENDENTE"),
                pedido(forzaHorizon5, 3, 8, "CONCLUIDO"),
                pedido(controleXbox, 3, 0, "PENDENTE"),
                pedido(headsetHyperX, 2, 5, "CONCLUIDO"),
                pedido(volanteLogitech, 1, 1, "PENDENTE")
        );
        pedidoRepository.saveAll(pedidos);

        // Atualiza o estoque dos produtos para refletir as vendas ja registradas acima
        // (na aplicacao normal isso e feito automaticamente pelo PedidoService.criar()).
        List<Produto> produtosAtualizados = new ArrayList<>();
        produtosAtualizados.add(debitar(xboxSeriesX, 2));
        produtosAtualizados.add(debitar(xboxSeriesS, 2));
        produtosAtualizados.add(debitar(playstation5, 1));
        produtosAtualizados.add(debitar(nintendoSwitch2, 1));
        produtosAtualizados.add(debitar(haloInfinite, 3));
        produtosAtualizados.add(debitar(gearsEDay, 2));
        produtosAtualizados.add(debitar(codBlackOps7, 3));
        produtosAtualizados.add(debitar(mortalKombat1, 3));
        produtosAtualizados.add(debitar(forzaHorizon5, 3));
        produtosAtualizados.add(debitar(controleXbox, 3));
        produtosAtualizados.add(debitar(headsetHyperX, 2));
        produtosAtualizados.add(debitar(volanteLogitech, 1));
        produtoRepository.saveAll(produtosAtualizados);
    }

    private Produto debitar(Produto produto, int quantidadeVendida) {
        produto.setQuantidadeEmEstoque(produto.getQuantidadeEmEstoque() - quantidadeVendida);
        return produto;
    }

    private Pedido pedido(Produto produto, int quantidade, int diasAtras, String status) {
        BigDecimal valorTotal = produto.getPreco().multiply(BigDecimal.valueOf(quantidade));
        return new Pedido(produto, quantidade, LocalDate.now().minusDays(diasAtras), valorTotal, status);
    }

    private BigDecimal novo(String valor) {
        return new BigDecimal(valor);
    }
}
