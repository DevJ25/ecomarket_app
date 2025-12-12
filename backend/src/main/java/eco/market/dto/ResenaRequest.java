package eco.market.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResenaRequest {
    @NotNull(message = "El ID del producto es requerido")
    private Integer productoId;

    @NotNull(message = "El ID del pedido es requerido")
    private Integer pedidoId;

    @NotNull(message = "La calificación es requerida")
    @Min(value = 1, message = "La calificación mínima es 1")
    @Max(value = 5, message = "La calificación máxima es 5")
    private Integer calificacion;

    private String comentario;
}
