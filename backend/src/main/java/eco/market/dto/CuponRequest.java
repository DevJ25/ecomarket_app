package eco.market.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CuponRequest {
    private String codigo;
    private String descripcion;
    private String tipoDescuento; // "porcentaje" o "monto_fijo"
    private BigDecimal valorDescuento;
    private BigDecimal maximoDescuento;
    private BigDecimal minCompra;
    private Integer usosMaximos;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
