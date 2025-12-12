package eco.market.controller;

import eco.market.dto.EnvioRequest;
import eco.market.entity.Envio;
import eco.market.service.EnvioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/envios")
@CrossOrigin(origins = "*")
public class EnvioController {

    @Autowired
    private EnvioService envioService;

    @PostMapping
    public ResponseEntity<?> crearEnvio(@RequestBody EnvioRequest request) {
        try {
            String email = obtenerEmailAutenticado();
            Envio envio = envioService.crearEnvio(request, email);
            return ResponseEntity.ok(envio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarEnvio(
            @PathVariable Integer id,
            @RequestBody EnvioRequest request) {
        try {
            Envio envio = envioService.actualizarEnvio(id, request);
            return ResponseEntity.ok(envio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoEnvio(
            @PathVariable Integer id,
            @RequestParam String estado) {
        try {
            String email = obtenerEmailAutenticado();
            Envio envio = envioService.actualizarEstadoEnvio(id, estado, email);
            return ResponseEntity.ok(envio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<?> obtenerEnvioPorPedido(@PathVariable Integer pedidoId) {
        try {
            Envio envio = envioService.obtenerEnvioPorPedido(pedidoId);
            if (envio == null) {
                return ResponseEntity.ok("No hay información de envío disponible");
            }
            return ResponseEntity.ok(envio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    private String obtenerEmailAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }
        return authentication.getName();
    }
}
