package eco.market.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnvioRequest {
    private Integer pedidoId;
    private String codigoSeguimiento;
    private String transportista;
    private String estadoEnvio;
    private String ubicacionActual;
    private LocalDate fechaEstimadaEntrega;
}
