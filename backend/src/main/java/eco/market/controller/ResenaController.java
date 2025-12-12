package eco.market.controller;

import eco.market.dto.ResenaRequest;
import eco.market.entity.Resena;
import eco.market.service.ResenaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resenas")
@CrossOrigin(origins = "*")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    @PostMapping
    public ResponseEntity<?> crearResena(@Valid @RequestBody ResenaRequest request) {
        try {
            String email = obtenerEmailAutenticado();
            Resena resena = resenaService.crearResena(request, email);
            return ResponseEntity.ok(resena);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Resena>> obtenerResenasPorProducto(@PathVariable Integer productoId) {
        List<Resena> resenas = resenaService.obtenerResenasPorProducto(productoId);
        return ResponseEntity.ok(resenas);
    }

    @GetMapping("/vendedor")
    public ResponseEntity<List<Resena>> obtenerResenasVendedor() {
        try {
            String email = obtenerEmailAutenticado();
            List<Resena> resenas = resenaService.obtenerResenasVendedor(email);
            return ResponseEntity.ok(resenas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/reportar")
    public ResponseEntity<?> reportarResena(@PathVariable Integer id) {
        try {
            resenaService.reportarResena(id);
            return ResponseEntity.ok("Reseña reportada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarResena(@PathVariable Integer id) {
        try {
            String email = obtenerEmailAutenticado();
            resenaService.eliminarResena(id, email);
            return ResponseEntity.ok("Reseña eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/reportadas")
    public ResponseEntity<List<Resena>> obtenerResenasReportadas() {
        List<Resena> resenas = resenaService.obtenerResenasReportadas();
        return ResponseEntity.ok(resenas);
    }

    private String obtenerEmailAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }
        return authentication.getName();
    }
}
