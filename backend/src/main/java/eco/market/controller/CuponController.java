package eco.market.controller;

import eco.market.dto.CuponRequest;
import eco.market.entity.Cupon;
import eco.market.service.CuponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cupones")
@CrossOrigin(origins = "*")
public class CuponController {

    @Autowired
    private CuponService cuponService;

    @PostMapping
    public ResponseEntity<?> crearCupon(@RequestBody CuponRequest request) {
        try {
            Cupon cupon = cuponService.crearCupon(request);
            return ResponseEntity.ok(cupon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/validar/{codigo}")
    public ResponseEntity<?> validarCupon(@PathVariable String codigo) {
        try {
            Cupon cupon = cuponService.validarCupon(codigo);
            return ResponseEntity.ok(cupon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/aplicar/{codigo}")
    public ResponseEntity<?> aplicarCupon(@PathVariable String codigo) {
        try {
            cuponService.aplicarCupon(codigo);
            return ResponseEntity.ok("Cupón aplicado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Cupon>> obtenerCuponesActivos() {
        List<Cupon> cupones = cuponService.obtenerCuponesActivos();
        return ResponseEntity.ok(cupones);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCupon(@PathVariable Integer id) {
        try {
            cuponService.eliminarCupon(id);
            return ResponseEntity.ok("Cupón desactivado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
