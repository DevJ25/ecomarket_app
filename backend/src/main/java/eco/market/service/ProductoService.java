package eco.market.service;

import eco.market.dto.ProductoResponse;
import eco.market.entity.Categoria;
import eco.market.entity.Producto;
import eco.market.repository.CategoriaRepository;
import eco.market.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import eco.market.dto.ProductoRequest;
import eco.market.entity.Usuario;
import eco.market.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<ProductoResponse> obtenerTodosLosProductos() {
        return productoRepository.findActiveProductsOrderByDate()
                .stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    public List<ProductoResponse> obtenerProductosPorCategoria(Integer categoriaId) {
        return productoRepository.findByCategoria_CategoriaIdAndEstaActivoTrueAndEstaVerificadoTrue(categoriaId)
                .stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    public ProductoResponse obtenerProductoPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!producto.getEstaActivo() || !producto.getEstaVerificado()) {
            throw new RuntimeException("Producto no disponible");
        }

        return convertirAResponse(producto);
    }

    public List<Categoria> obtenerCategorias() {
        return categoriaRepository.findByEstaActivaTrue();
    }

    public ProductoResponse crearProducto(ProductoRequest request, String emailVendedor) {
        Usuario vendedor = usuarioRepository.findByEmail(emailVendedor)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        String roleName = vendedor.getRol().getNombreRol();
        if (!roleName.equalsIgnoreCase("vendedor") && !roleName.equalsIgnoreCase("ROLE_SELLER")) {
            throw new RuntimeException("Solo los vendedores pueden crear productos");
        }

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        Producto producto = new Producto();
        producto.setVendedor(vendedor);
        actualizarDatosProducto(producto, request, categoria);

        // Por defecto no verificado, requiere aprobación del admin
        producto.setEstaVerificado(false);

        producto = productoRepository.save(producto);
        return convertirAResponse(producto);
    }

    public ProductoResponse actualizarProducto(Integer id, ProductoRequest request, String emailVendedor) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!producto.getVendedor().getEmail().equals(emailVendedor)) {
            throw new RuntimeException("No tienes permiso para editar este producto");
        }

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        actualizarDatosProducto(producto, request, categoria);

        producto = productoRepository.save(producto);
        return convertirAResponse(producto);
    }

    public void eliminarProducto(Integer id, String emailVendedor) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!producto.getVendedor().getEmail().equals(emailVendedor)) {
            throw new RuntimeException("No tienes permiso para eliminar este producto");
        }

        // Soft delete
        producto.setEstaActivo(false);
        productoRepository.save(producto);
    }

    public List<ProductoResponse> obtenerProductosPorVendedor(String emailVendedor) {
        Usuario vendedor = usuarioRepository.findByEmail(emailVendedor)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        return productoRepository.findByVendedor(vendedor)
                .stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }

    private void actualizarDatosProducto(Producto producto, ProductoRequest request, Categoria categoria) {
        producto.setNombreProducto(request.getNombreProducto());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setPrecioOriginal(request.getPrecioOriginal());
        producto.setStock(request.getStock());
        producto.setImagenPrincipal(request.getImagenPrincipal());
        producto.setCategoria(categoria);
        producto.setEsOrganico(request.getEsOrganico() != null ? request.getEsOrganico() : false);
        producto.setEsVegano(request.getEsVegano() != null ? request.getEsVegano() : false);
        producto.setPeso(request.getPeso());
        producto.setUnidadMedida(request.getUnidadMedida());
    }

    private ProductoResponse convertirAResponse(Producto producto) {
        ProductoResponse response = new ProductoResponse();
        response.setProductoId(producto.getProductoId());
        response.setNombreProducto(producto.getNombreProducto());
        response.setDescripcion(producto.getDescripcion());
        response.setPrecio(producto.getPrecio());
        response.setPrecioOriginal(producto.getPrecioOriginal());
        response.setStock(producto.getStock());
        response.setImagenPrincipal(producto.getImagenPrincipal());
        response.setEsOrganico(producto.getEsOrganico());
        response.setEsVegano(producto.getEsVegano());
        response.setPeso(producto.getPeso());
        response.setUnidadMedida(producto.getUnidadMedida());
        response.setCalificacionPromedio(producto.getCalificacionPromedio());
        response.setTotalCalificaciones(producto.getTotalCalificaciones());
        response.setNombreCategoria(producto.getCategoria().getNombreCategoria());
        response.setNombreVendedor(producto.getVendedor().getNombre() + " " + producto.getVendedor().getApellido());
        response.setFechaCreacion(producto.getFechaCreacion());
        return response;
    }
}