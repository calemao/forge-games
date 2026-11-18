package com.lojaartesanal.sistema.controlador;

import com.lojaartesanal.sistema.dto.LoginDTO;
import com.lojaartesanal.sistema.dto.TokenRespostaDTO;
import com.lojaartesanal.sistema.dto.UsuarioDTO;
import com.lojaartesanal.sistema.dto.UsuarioRespostaDTO;
import com.lojaartesanal.sistema.security.JwtService;
import com.lojaartesanal.sistema.security.UsuarioDetailsServiceImpl;
import com.lojaartesanal.sistema.servico.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioDetailsServiceImpl usuarioDetailsService;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager,
                           UsuarioDetailsServiceImpl usuarioDetailsService,
                           JwtService jwtService,
                           UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.usuarioDetailsService = usuarioDetailsService;
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<TokenRespostaDTO> login(@Valid @RequestBody LoginDTO dto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha()));
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos.");
        }

        UserDetails userDetails = usuarioDetailsService.loadUserByUsername(dto.getEmail());
        String token = jwtService.gerarToken(userDetails);
        return ResponseEntity.ok(new TokenRespostaDTO(token));
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioRespostaDTO> registrar(@Valid @RequestBody UsuarioDTO dto) {
        var usuario = usuarioService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UsuarioRespostaDTO(usuario));
    }
}
