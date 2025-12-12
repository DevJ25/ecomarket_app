package eco.market.service;

import java.util.List;

import org.springframework.stereotype.Service;

import eco.market.model.Product;
import eco.market.model.User;
import eco.market.product.ProductRequest;
import eco.market.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
    }

    public List<Product> getProductsBySeller(User seller) {
        // In a real app, you might want to add pagination here
        return productRepository.findByVendedor(seller);
    }

    @Transactional
    public Product createProduct(ProductRequest request, User seller) {
        Product product = Product.builder()
                .nombre_producto(request.getNombre_producto())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .stock(request.getStock())
                .imagen_principal(request.getImagen_principal())
                .es_organico(request.isEs_organico())
                .vendedor(seller)
                .esta_activo(true) // Products are active by default
                .build();
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Integer productId, ProductRequest request, User seller) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Authorization check: ensure the product belongs to the seller
        if (!product.getVendedor().getUsuario_id().equals(seller.getUsuario_id())) {
            throw new SecurityException("You are not authorized to update this product.");
        }

        product.setNombre_producto(request.getNombre_producto());
        product.setDescripcion(request.getDescripcion());
        product.setPrecio(request.getPrecio());
        product.setStock(request.getStock());
        product.setImagen_principal(request.getImagen_principal());
        product.setEs_organico(request.isEs_organico());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Integer productId, User seller) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        // Authorization check
        if (!product.getVendedor().getUsuario_id().equals(seller.getUsuario_id())) {
            throw new SecurityException("You are not authorized to delete this product.");
        }

        productRepository.delete(product);
    }
}
