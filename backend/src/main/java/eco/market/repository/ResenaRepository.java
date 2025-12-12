package eco.market.repository;

import eco.market.entity.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Integer> {
    List<Resena> findByProducto_ProductoId(Integer productoId);

    List<Resena> findByUsuario_UsuarioId(Integer usuarioId);

    List<Resena> findByProducto_Vendedor_Email(String email);

    List<Resena> findByReportadaTrue();
}
