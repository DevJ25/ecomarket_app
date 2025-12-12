package eco.market.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eco.market.model.Cart;
import eco.market.model.CartItem;
import eco.market.model.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
