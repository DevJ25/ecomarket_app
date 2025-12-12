package eco.market.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import eco.market.cart.AddItemRequest;
import eco.market.cart.UpdateItemRequest;
import eco.market.model.Cart;
import eco.market.model.CartItem;
import eco.market.model.Product;
import eco.market.model.User;
import eco.market.repository.CartItemRepository;
import eco.market.repository.CartRepository;
import eco.market.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Cart getCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> createCart(user));
    }

    private Cart createCart(User user) {
        Cart newCart = Cart.builder()
                .user(user)
                .items(new ArrayList<>())
                .build();
        return cartRepository.save(newCart);
    }

    @Transactional
    public Cart addItemToCart(User user, AddItemRequest request) {
        Cart cart = getCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item is already in cart
        CartItem existingItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(null);

        if (existingItem != null) {
            existingItem.setCantidad(existingItem.getCantidad() + request.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .cantidad(request.getQuantity())
                    .precio_unitario(product.getPrecio())
                    .build();
            cart.getItems().add(newItem);
            cartRepository.save(cart);
        }
        return cart;
    }

    @Transactional
    public Cart updateItemQuantity(User user, Integer productId, UpdateItemRequest request) {
        Cart cart = getCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        cartItem.setCantidad(request.getQuantity());
        cartItemRepository.save(cartItem);
        return cart;
    }

    @Transactional
    public void removeItemFromCart(User user, Integer productId) {
        Cart cart = getCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        cartRepository.save(cart);
    }
}
