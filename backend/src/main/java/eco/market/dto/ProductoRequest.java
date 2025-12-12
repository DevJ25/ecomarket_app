package eco.market.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoRequest {
    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombreProducto;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private BigDecimal precio;

    private BigDecimal precioOriginal;

    @NotNull(message = "El stock es obligatorio")
    @Positive(message = "El stock debe ser mayor o igual a 0")
    private Integer stock;

    private String imagenPrincipal;

    @NotNull(message = "La categoría es obligatoria")
    private Integer categoriaId;

    private Boolean esOrganico;
    private Boolean esVegano;
    private BigDecimal peso;
    private String unidadMedida;
}
