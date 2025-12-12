package eco.market.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PedidoRequest {
    private String direccionEnvio;
    private String metodoPago;
    private BigDecimal total;
    private List<DetallePedidoRequest> detalles;

    @Data
    public static class DetallePedidoRequest {
        private Integer productoId;
        private Integer cantidad;
        private BigDecimal precioUnitario;
    }
}
