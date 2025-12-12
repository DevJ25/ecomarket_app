package eco.market.product;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eco.market.model.Product;
import eco.market.model.User;
import eco.market.service.ProductService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Public endpoint to get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Public endpoint to get a single product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") Integer productId) {
        return ResponseEntity.ok(productService.getProductById(productId));
    }

    // Endpoint for sellers to get their own products
    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts(@AuthenticationPrincipal User seller) {
        return ResponseEntity.ok(productService.getProductsBySeller(seller));
    }

    // Endpoint for sellers to create a new product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request, @AuthenticationPrincipal User seller) {
        Product createdProduct = productService.createProduct(request, seller);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    // Endpoint for sellers to update their product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") Integer productId, @RequestBody ProductRequest request, @AuthenticationPrincipal User seller) {
        Product updatedProduct = productService.updateProduct(productId, request, seller);
        return ResponseEntity.ok(updatedProduct);
    }

    // Endpoint for sellers to delete their product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Integer productId, @AuthenticationPrincipal User seller) {
        productService.deleteProduct(productId, seller);
        return ResponseEntity.noContent().build();
    }
}
