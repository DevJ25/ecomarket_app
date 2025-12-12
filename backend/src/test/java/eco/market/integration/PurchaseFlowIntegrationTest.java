package eco.market.integration;

import eco.market.dto.PedidoRequest;
import eco.market.entity.*;
import eco.market.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class PurchaseFlowIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String baseUrl;
    private Usuario compradorUsuario;
    private Usuario vendedorUsuario;
    private Producto producto;
    private String authToken;

    @BeforeEach
    public void setUp() {
        baseUrl = "http://localhost:" + port + "/api";

        // Clean up test data
        pedidoRepository.deleteAll();
        productoRepository.deleteAll();
        notificacionRepository.deleteAll();
        usuarioRepository.deleteAll();

        // Create roles if they don't exist
        Rol rolComprador = rolRepository.findByNombreRol("COMPRADOR")
                .orElseGet(() -> {
                    Rol rol = new Rol();
                    rol.setNombreRol("COMPRADOR");
                    return rolRepository.save(rol);
                });
        Rol rolVendedor = rolRepository.findByNombreRol("VENDEDOR")
                .orElseGet(() -> {
                    Rol rol = new Rol();
                    rol.setNombreRol("VENDEDOR");
                    return rolRepository.save(rol);
                });

        // Create buyer
        compradorUsuario = new Usuario();
        compradorUsuario.setNombre("Comprador");
        compradorUsuario.setApellido("Test");
        compradorUsuario.setEmail("comprador@test.com");
        compradorUsuario.setPasswordHash(passwordEncoder.encode("password123"));
        compradorUsuario.setRol(rolComprador);
        compradorUsuario.setEsVerificado(true);
        compradorUsuario.setEstaActivo(true);
        compradorUsuario = usuarioRepository.save(compradorUsuario);

        // Create seller
        vendedorUsuario = new Usuario();
        vendedorUsuario.setNombre("Vendedor");
        vendedorUsuario.setApellido("Test");
        vendedorUsuario.setEmail("vendedor@test.com");
        vendedorUsuario.setPasswordHash(passwordEncoder.encode("password123"));
        vendedorUsuario.setRol(rolVendedor);
        vendedorUsuario.setEsVerificado(true);
        vendedorUsuario.setEstaActivo(true);
        vendedorUsuario = usuarioRepository.save(vendedorUsuario);

        // Create category
        Categoria categoria = categoriaRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    Categoria cat = new Categoria();
                    cat.setNombreCategoria("Test Category");
                    cat.setEstaActiva(true);
                    return categoriaRepository.save(cat);
                });

        // Create product
        producto = new Producto();
        producto.setVendedor(vendedorUsuario);
        producto.setCategoria(categoria);
        producto.setNombreProducto("Producto Test");
        producto.setDescripcion("Descripcion Test");
        producto.setPrecio(new BigDecimal("10.00"));
        producto.setStock(100);
        producto.setEstaActivo(true);
        producto.setEstaVerificado(true);
        producto = productoRepository.save(producto);

        // Login to get auth token
        authToken = loginAndGetToken("comprador@test.com", "password123");
    }

    private String loginAndGetToken(String email, String password) {
        String loginUrl = baseUrl + "/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(loginUrl, request, String.class);
        // Extract token from response (simple extraction for test)
        String responseBody = response.getBody();
        if (responseBody != null && responseBody.contains("\"token\":\"")) {
            int start = responseBody.indexOf("\"token\":\"") + 9;
            int end = responseBody.indexOf("\"", start);
            return responseBody.substring(start, end);
        }
        return "";
    }

    @Test
    public void testCompletePurchaseFlow() {
        // Arrange
        PedidoRequest.DetallePedidoRequest detalle = new PedidoRequest.DetallePedidoRequest();
        detalle.setProductoId(producto.getProductoId());
        detalle.setCantidad(5);
        detalle.setPrecioUnitario(new BigDecimal("10.00"));

        List<PedidoRequest.DetallePedidoRequest> detalles = new ArrayList<>();
        detalles.add(detalle);

        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setDireccionEnvio("Calle Test 123");
        pedidoRequest.setMetodoPago("Tarjeta");
        pedidoRequest.setTotal(new BigDecimal("50.00"));
        pedidoRequest.setDetalles(detalles);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);
        HttpEntity<PedidoRequest> request = new HttpEntity<>(pedidoRequest, headers);

        // Act
        ResponseEntity<Pedido> response = restTemplate.postForEntity(
                baseUrl + "/pedidos",
                request,
                Pedido.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsuario().getUsuarioId()).isEqualTo(compradorUsuario.getUsuarioId());
    }

    @Test
    public void testInventoryUpdateAfterPurchase() {
        // Arrange
        int initialStock = producto.getStock();
        int quantityToBuy = 10;

        PedidoRequest.DetallePedidoRequest detalle = new PedidoRequest.DetallePedidoRequest();
        detalle.setProductoId(producto.getProductoId());
        detalle.setCantidad(quantityToBuy);
        detalle.setPrecioUnitario(producto.getPrecio());

        List<PedidoRequest.DetallePedidoRequest> detalles = new ArrayList<>();
        detalles.add(detalle);

        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setDireccionEnvio("Calle Test 123");
        pedidoRequest.setMetodoPago("Tarjeta");
        pedidoRequest.setTotal(producto.getPrecio().multiply(new BigDecimal(quantityToBuy)));
        pedidoRequest.setDetalles(detalles);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);
        HttpEntity<PedidoRequest> request = new HttpEntity<>(pedidoRequest, headers);

        // Act
        restTemplate.postForEntity(baseUrl + "/pedidos", request, Pedido.class);

        // Assert - Verify stock was updated
        Producto updatedProducto = productoRepository.findById(producto.getProductoId()).orElse(null);
        assertThat(updatedProducto).isNotNull();
        assertThat(updatedProducto.getStock()).isEqualTo(initialStock - quantityToBuy);
    }

    @Test
    public void testVendorNotificationCreation() {
        // Arrange
        PedidoRequest.DetallePedidoRequest detalle = new PedidoRequest.DetallePedidoRequest();
        detalle.setProductoId(producto.getProductoId());
        detalle.setCantidad(3);
        detalle.setPrecioUnitario(producto.getPrecio());

        List<PedidoRequest.DetallePedidoRequest> detalles = new ArrayList<>();
        detalles.add(detalle);

        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setDireccionEnvio("Calle Test 123");
        pedidoRequest.setMetodoPago("Tarjeta");
        pedidoRequest.setTotal(producto.getPrecio().multiply(new BigDecimal(3)));
        pedidoRequest.setDetalles(detalles);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);
        HttpEntity<PedidoRequest> request = new HttpEntity<>(pedidoRequest, headers);

        // Act
        restTemplate.postForEntity(baseUrl + "/pedidos", request, Pedido.class);

        // Assert - Verify vendor received notification
        List<Notificacion> notificaciones = notificacionRepository
                .findByUsuarioUsuarioIdOrderByFechaCreacionDesc(vendedorUsuario.getUsuarioId());
        assertThat(notificaciones).isNotEmpty();
        assertThat(notificaciones.get(0).getTitulo()).isEqualTo("Nueva Orden Recibida");
    }

    @Test
    public void testInsufficientStock() {
        // Arrange
        PedidoRequest.DetallePedidoRequest detalle = new PedidoRequest.DetallePedidoRequest();
        detalle.setProductoId(producto.getProductoId());
        detalle.setCantidad(200); // More than available stock
        detalle.setPrecioUnitario(producto.getPrecio());

        List<PedidoRequest.DetallePedidoRequest> detalles = new ArrayList<>();
        detalles.add(detalle);

        PedidoRequest pedidoRequest = new PedidoRequest();
        pedidoRequest.setDireccionEnvio("Calle Test 123");
        pedidoRequest.setMetodoPago("Tarjeta");
        pedidoRequest.setTotal(new BigDecimal("2000.00"));
        pedidoRequest.setDetalles(detalles);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(authToken);
        HttpEntity<PedidoRequest> request = new HttpEntity<>(pedidoRequest, headers);

        // Act
        ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/pedidos",
                request,
                String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("Stock insuficiente");
    }
}
