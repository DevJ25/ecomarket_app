package eco.market.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import eco.market.model.Product;
import eco.market.model.User;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByVendedor(User vendedor);
}
