package eco.market.repository;

import eco.market.entity.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CuponRepository extends JpaRepository<Cupon, Integer> {
    Optional<Cupon> findByCodigo(String codigo);

    List<Cupon> findByEstaActivoTrue();
}
