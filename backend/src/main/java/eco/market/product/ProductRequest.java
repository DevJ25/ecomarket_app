package eco.market.product;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private String nombre_producto;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String imagen_principal;
    private boolean es_organico;
    // We can add more fields here as needed, like categoria_id
}
