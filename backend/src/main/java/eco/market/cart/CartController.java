package eco.market.cart;

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

import eco.market.model.Cart;
import eco.market.model.User;
import eco.market.service.CartService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@AuthenticationPrincipal User user, @RequestBody AddItemRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(user, request));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<Cart> updateItem(
            @AuthenticationPrincipal User user,
            @PathVariable Integer productId,
            @RequestBody UpdateItemRequest request) {
        return ResponseEntity.ok(cartService.updateItemQuantity(user, productId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeItem(
            @AuthenticationPrincipal User user,
            @PathVariable Integer productId) {
        cartService.removeItemFromCart(user, productId);
        return ResponseEntity.noContent().build();
    }
}
