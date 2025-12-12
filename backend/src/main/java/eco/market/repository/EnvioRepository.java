package eco.market.repository;

import eco.market.entity.Envio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface EnvioRepository extends JpaRepository<Envio, Integer> {
    Optional<Envio> findByOrden_PedidoId(Integer pedidoId);

    Optional<Envio> findByCodigoSeguimiento(String codigoSeguimiento);
}
