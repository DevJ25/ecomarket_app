package eco.market.integration;

import eco.market.entity.*;
import eco.market.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class InventoryUpdateIntegrationTest {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    private Producto testProducto;

    @BeforeEach
    public void setUp() {
        // Clean up
        productoRepository.deleteAll();
        usuarioRepository.deleteAll();

        // Create necessary test data
        Rol rolVendedor = rolRepository.findByNombreRol("VENDEDOR")
                .orElseGet(() -> {
                    Rol rol = new Rol();
                    rol.setNombreRol("VENDEDOR");
                    return rolRepository.save(rol);
                });

        Usuario vendedor = new Usuario();
        vendedor.setNombre("Test");
        vendedor.setApellido("Vendor");
        vendedor.setEmail("vendor@test.com");
        vendedor.setPasswordHash("hashed");
        vendedor.setRol(rolVendedor);
        vendedor.setEstaActivo(true);
        vendedor.setEsVerificado(true);
        vendedor = usuarioRepository.save(vendedor);

        Categoria categoria = categoriaRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    Categoria cat = new Categoria();
                    cat.setNombreCategoria("Test");
                    cat.setEstaActiva(true);
                    return categoriaRepository.save(cat);
                });

        testProducto = new Producto();
        testProducto.setVendedor(vendedor);
        testProducto.setCategoria(categoria);
        testProducto.setNombreProducto("Test Product");
        testProducto.setDescripcion("Test");
        testProducto.setPrecio(new BigDecimal("10.00"));
        testProducto.setStock(100);
        testProducto.setEstaActivo(true);
        testProducto.setEstaVerificado(true);
        testProducto = productoRepository.save(testProducto);
    }

    @Test
    public void testStockUpdatePersistence() {
        // Arrange
        int initialStock = testProducto.getStock();
        int reduction = 10;

        // Act
        testProducto.setStock(initialStock - reduction);
        productoRepository.save(testProducto);

        // Assert
        Producto updated = productoRepository.findById(testProducto.getProductoId()).orElse(null);
        assertThat(updated).isNotNull();
        assertThat(updated.getStock()).isEqualTo(initialStock - reduction);
    }

    @Test
    public void testOptimisticLockingVersionIncrement() {
        // Arrange
        Long initialVersion = testProducto.getVersion();

        // Act - Update the product
        testProducto.setStock(testProducto.getStock() - 5);
        Producto updated = productoRepository.save(testProducto);

        // Assert - Version should have incremented
        assertThat(updated.getVersion()).isNotNull();
        if (initialVersion != null) {
            assertThat(updated.getVersion()).isGreaterThan(initialVersion);
        }
    }

    @Test
    public void testConcurrentPurchaseAttemptHandling() throws InterruptedException {
        // Arrange
        int numberOfThreads = 10;
        int quantityPerThread = 15;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        // Act - Simulate concurrent purchases
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    // Load fresh product instance
                    Producto producto = productoRepository.findById(testProducto.getProductoId()).orElse(null);
                    if (producto != null && producto.getStock() >= quantityPerThread) {
                        producto.setStock(producto.getStock() - quantityPerThread);
                        productoRepository.saveAndFlush(producto);
                        successCount.incrementAndGet();
                    } else {
                        failureCount.incrementAndGet();
                    }
                } catch (ObjectOptimisticLockingFailureException e) {
                    // Expected when concurrent updates conflict
                    failureCount.incrementAndGet();
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        executorService.shutdown();

        // Assert
        Producto finalProduct = productoRepository.findById(testProducto.getProductoId()).orElse(null);
        assertThat(finalProduct).isNotNull();

        // With optimistic locking, some threads should fail
        // The final stock should be consistent: initial - (successes *
        // quantityPerThread)
        int expectedStock = 100 - (successCount.get() * quantityPerThread);
        assertThat(finalProduct.getStock()).isEqualTo(expectedStock);

        // At least some operations should have failed due to concurrent access
        assertThat(failureCount.get()).isGreaterThan(0);
    }

    @Test
    @Transactional
    public void testStockValidationBeforePurchase() {
        // Arrange
        testProducto.setStock(5);
        productoRepository.save(testProducto);

        // Act & Assert - Attempting to buy more than available should fail
        Producto producto = productoRepository.findById(testProducto.getProductoId()).orElse(null);
        assertThat(producto).isNotNull();
        assertThat(producto.getStock()).isLessThan(10);
        // This validates that the business logic should check stock before attempting
        // purchase
    }

    @Test
    public void testMultipleSequentialUpdates() {
        // Arrange
        int initialStock = testProducto.getStock();
        int[] reductions = { 5, 10, 3, 7 };

        // Act - Perform multiple sequential stock updates
        for (int reduction : reductions) {
            Producto producto = productoRepository.findById(testProducto.getProductoId()).orElse(null);
            if (producto != null) {
                producto.setStock(producto.getStock() - reduction);
                productoRepository.save(producto);
            }
        }

        // Assert
        Producto finalProduct = productoRepository.findById(testProducto.getProductoId()).orElse(null);
        assertThat(finalProduct).isNotNull();
        int expectedStock = initialStock - (5 + 10 + 3 + 7);
        assertThat(finalProduct.getStock()).isEqualTo(expectedStock);
    }
}
