package eco.market.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Reseñas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resena {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reseña_id")
    private Integer resenaId;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido orden;

    @Column(name = "calificacion", nullable = false)
    private Integer calificacion; // 1-5

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "es_verificado")
    private Boolean esVerificado = false;

    @Column(name = "reportada")
    private Boolean reportada = false;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion = LocalDateTime.now();
}
