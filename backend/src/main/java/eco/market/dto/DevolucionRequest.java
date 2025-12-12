package eco.market.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DevolucionRequest {
    @NotNull(message = "El ID del pedido es requerido")
    private Integer pedidoId;

    @NotNull(message = "El ID del producto es requerido")
    private Integer productoId;

    @NotNull(message = "La cantidad es requerida")
    private Integer cantidad;

    @NotNull(message = "El motivo es requerido")
    private String motivo;

    private String imagenEvidencia;
}
