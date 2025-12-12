package eco.market.repository;

import eco.market.entity.Devolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DevolucionRepository extends JpaRepository<Devolucion, Integer> {
    List<Devolucion> findByUsuario_Email(String email);

    @Query("SELECT d FROM Devolucion d WHERE d.producto.vendedor.email = :email")
    List<Devolucion> findByVendedorEmail(@Param("email") String email);

    List<Devolucion> findByEstado(String estado);
}
