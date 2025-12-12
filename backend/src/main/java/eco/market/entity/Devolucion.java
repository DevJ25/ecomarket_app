package eco.market.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "Devoluciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Devolucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "devolucion_id")
    private Integer devolucionId;

    @ManyToOne
    @JoinColumn(name = "orden_id", nullable = false)
    private Pedido orden;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "motivo", nullable = false, columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "estado", length = 20)
    private String estado = "solicitada"; // solicitada, en_revision, aprobada, rechazada, reembolsada

    @Column(name = "monto_reembolso", precision = 10, scale = 2)
    private BigDecimal montoReembolso;

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud = LocalDateTime.now();

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @Column(name = "comentario_admin", columnDefinition = "TEXT")
    private String comentarioAdmin;

    @Column(name = "imagen_evidencia", length = 255)
    private String imagenEvidencia;
}
