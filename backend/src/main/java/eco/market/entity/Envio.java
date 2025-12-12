package eco.market.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "SeguimientoEnvios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seguimiento_id")
    private Integer seguimientoId;

    @OneToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido orden;

    @Column(name = "estado_envio", length = 20)
    private String estadoEnvio = "preparando"; // preparando, en_transito, en_reparto, entregado, devuelto

    @Column(name = "ubicacion_actual", length = 255)
    private String ubicacionActual;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();

    @Column(name = "fecha_estimada_entrega")
    private LocalDate fechaEstimadaEntrega;

    @Column(name = "codigo_seguimiento", unique = true, length = 100)
    private String codigoSeguimiento;

    @Column(name = "transportista", length = 100)
    private String transportista;
}
