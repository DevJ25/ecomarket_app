package eco.market.controller;

import eco.market.dto.ProductoResponse;
import eco.market.entity.Producto;
import eco.market.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping("/productos/pendientes")
    public ResponseEntity<List<ProductoResponse>> obtenerProductosPendientes() {
        // En una app real, filtraríamos por estaVerificado = false
        // Como no tenemos un método específico en el repo para esto aún,
        // podemos usar findAll y filtrar, o agregar el método al repo.
        // Agreguemos el método al repo primero o usemos uno existente.
        // Revisando ProductoRepository, tenemos
        // findByEstaActivoTrueAndEstaVerificadoTrue
        // Necesitamos lo opuesto o algo general.

        // Por ahora, para simplificar y no tocar el repo de nuevo si falla,
        // vamos a traer todos y filtrar en memoria (no ideal para prod pero ok para
        // MVP)
        List<Producto> productos = productoRepository.findAll();
        List<ProductoResponse> pendientes = productos.stream()
                .filter(p -> !p.getEstaVerificado() && p.getEstaActivo())
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(pendientes);
    }

    @PutMapping("/productos/{id}/verificar")
    public ResponseEntity<?> verificarProducto(@PathVariable Integer id, @RequestParam boolean aprobado) {
        return productoRepository.findById(id).map(producto -> {
            if (aprobado) {
                producto.setEstaVerificado(true);
            } else {
                // Si se rechaza, podríamos desactivarlo o borrarlo.
                // Por ahora lo desactivamos.
                producto.setEstaActivo(false);
            }
            productoRepository.save(producto);
            return ResponseEntity.ok("Producto " + (aprobado ? "aprobado" : "rechazado"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Helper para mapear a DTO (duplicado de Service, idealmente usar Mapper)
    private ProductoResponse mapToResponse(Producto producto) {
        ProductoResponse response = new ProductoResponse();
        response.setProductoId(producto.getProductoId());
        response.setNombreProducto(producto.getNombreProducto());
        response.setDescripcion(producto.getDescripcion());
        response.setPrecio(producto.getPrecio());
        response.setStock(producto.getStock());
        response.setImagenPrincipal(producto.getImagenPrincipal());
        response.setNombreCategoria(producto.getCategoria().getNombreCategoria());
        response.setNombreVendedor(producto.getVendedor().getNombre() + " " + producto.getVendedor().getApellido());
        response.setEsOrganico(producto.getEsOrganico());
        response.setEsVegano(producto.getEsVegano());
        response.setPeso(producto.getPeso());
        response.setUnidadMedida(producto.getUnidadMedida());
        return response;
    }
}
