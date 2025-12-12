package eco.market.repository;

import eco.market.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    List<Pedido> findByUsuario_UsuarioId(Integer usuarioId);

    @Query("SELECT DISTINCT p FROM Pedido p JOIN FETCH p.detalles d WHERE d.producto.vendedor.usuarioId = :vendedorId")
    List<Pedido> findByDetalles_Producto_Vendedor_UsuarioId(@Param("vendedorId") Integer vendedorId);
}
