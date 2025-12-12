package eco.market.controller;

import eco.market.dto.ProductoResponse;
import eco.market.entity.Categoria;
import eco.market.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import eco.market.dto.ProductoRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> obtenerTodosLosProductos() {
        List<ProductoResponse> productos = productoService.obtenerTodosLosProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProductoPorId(@PathVariable Integer id) {
        try {
            ProductoResponse producto = productoService.obtenerProductoPorId(id);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoResponse>> obtenerProductosPorCategoria(@PathVariable Integer categoriaId) {
        List<ProductoResponse> productos = productoService.obtenerProductosPorCategoria(categoriaId);
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<?> crearProducto(@Valid @RequestBody ProductoRequest request) {
        try {
            String email = obtenerEmailAutenticado();
            ProductoResponse producto = productoService.crearProducto(request, email);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Integer id, @Valid @RequestBody ProductoRequest request) {
        try {
            String email = obtenerEmailAutenticado();
            ProductoResponse producto = productoService.actualizarProducto(id, request, email);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Integer id) {
        try {
            String email = obtenerEmailAutenticado();
            productoService.eliminarProducto(id, email);
            return ResponseEntity.ok("Producto eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/vendedor")
    public ResponseEntity<?> obtenerMisProductos() {
        try {
            String email = obtenerEmailAutenticado();
            List<ProductoResponse> productos = productoService.obtenerProductosPorVendedor(email);
            return ResponseEntity.ok(productos);
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