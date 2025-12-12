package eco.market.controller;

import eco.market.dto.DevolucionRequest;
import eco.market.entity.Devolucion;
import eco.market.service.DevolucionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/devoluciones")
@CrossOrigin(origins = "*")
public class DevolucionController {

    @Autowired
    private DevolucionService devolucionService;

    @PostMapping
    public ResponseEntity<?> solicitarDevolucion(@Valid @RequestBody DevolucionRequest request) {
        try {
            String email = obtenerEmailAutenticado();
            Devolucion devolucion = devolucionService.solicitarDevolucion(request, email);
            return ResponseEntity.ok(devolucion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/comprador")
    public ResponseEntity<?> obtenerDevolucionesComprador() {
        try {
            String email = obtenerEmailAutenticado();
            List<Devolucion> devoluciones = devolucionService.obtenerDevolucionesComprador(email);
            return ResponseEntity.ok(devoluciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/vendedor")
    public ResponseEntity<?> obtenerDevolucionesVendedor() {
        try {
            String email = obtenerEmailAutenticado();
            List<Devolucion> devoluciones = devolucionService.obtenerDevolucionesVendedor(email);
            return ResponseEntity.ok(devoluciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoDevolucion(
            @PathVariable Integer id,
            @RequestParam String estado) {
        try {
            String email = obtenerEmailAutenticado();
            Devolucion devolucion = devolucionService.actualizarEstadoDevolucion(id, estado, email);
            return ResponseEntity.ok(devolucion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/reembolso")
    public ResponseEntity<?> procesarReembolso(@PathVariable Integer id) {
        try {
            Devolucion devolucion = devolucionService.procesarReembolso(id);
            return ResponseEntity.ok(devolucion);
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
