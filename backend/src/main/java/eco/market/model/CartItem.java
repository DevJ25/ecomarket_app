package eco.market.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ItemsCarrito")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer item_id;

    @ManyToOne
    @JoinColumn(name = "carrito_id", nullable = false)
    @JsonIgnore // Avoid circular dependency when serializing
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Product product;

    private int cantidad;
    
    private BigDecimal precio_unitario;
}
