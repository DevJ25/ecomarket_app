package eco.market.service;

import eco.market.dto.PedidoRequest;
import eco.market.entity.DetallePedido;
import eco.market.entity.Notificacion;
import eco.market.entity.Pedido;
import eco.market.entity.Producto;
import eco.market.entity.Usuario;
import eco.market.repository.DetallePedidoRepository;
import eco.market.repository.PedidoRepository;
import eco.market.repository.ProductoRepository;
import eco.market.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private EmailService emailService;

    public Pedido crearPedido(PedidoRequest request, String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setDireccionEnvio(request.getDireccionEnvio());
        pedido.setMetodoPago(request.getMetodoPago());
        pedido.setTotal(request.getTotal());

        pedido = pedidoRepository.save(pedido);

        List<DetallePedido> detalles = new ArrayList<>();
        Set<Integer> vendedoresNotificados = new HashSet<>();

        for (PedidoRequest.DetallePedidoRequest detalleReq : request.getDetalles()) {
            Producto producto = productoRepository.findById(detalleReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalleReq.getProductoId()));

            if (producto.getStock() < detalleReq.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para producto: " + producto.getNombreProducto());
            }

            // Actualizar stock con manejo de optimistic locking
            try {
                producto.setStock(producto.getStock() - detalleReq.getCantidad());
                productoRepository.save(producto);
            } catch (ObjectOptimisticLockingFailureException e) {
                throw new RuntimeException("El producto \"" + producto.getNombreProducto() +
                        "\" fue modificado por otro usuario. Por favor, intenta nuevamente.");
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleReq.getCantidad());
            detalle.setPrecioUnitario(detalleReq.getPrecioUnitario());
            detalle.setSubtotal(detalleReq.getPrecioUnitario().multiply(new BigDecimal(detalleReq.getCantidad())));

            detalles.add(detalle);

            // Notificar al vendedor del producto (solo una vez por vendedor)
            Integer vendedorId = producto.getVendedor().getUsuarioId();
            if (!vendedoresNotificados.contains(vendedorId)) {
                notificacionService.crearNotificacion(
                        vendedorId,
                        "Nueva Orden Recibida",
                        "Has recibido un nuevo pedido de " +
                                usuario.getNombre() + " " + usuario.getApellido() + ". Total: €" + request.getTotal(),
                        Notificacion.TipoNotificacion.orden);
                vendedoresNotificados.add(vendedorId);
            }
        }

        detallePedidoRepository.saveAll(detalles);
        detallePedidoRepository.saveAll(detalles);
        pedido.setDetalles(detalles);

        // Enviar correo de confirmación al comprador
        emailService.sendPurchaseReceipt(usuario.getEmail(), usuario.getNombre(), pedido.getPedidoId(),
                pedido.getTotal());

        return pedido;
    }

    public List<Pedido> obtenerMisPedidos(String emailUsuario) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return pedidoRepository.findByUsuario_UsuarioId(usuario.getUsuarioId());
    }

    public void actualizarEstado(Integer pedidoId, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(nuevoEstado);
        pedidoRepository.save(pedido);
    }

    public List<Pedido> obtenerPedidosVendedor(String emailVendedor) {
        Usuario vendedor = usuarioRepository.findByEmail(emailVendedor)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        // Obtener pedidos que contengan productos del vendedor
        return pedidoRepository.findByDetalles_Producto_Vendedor_UsuarioId(vendedor.getUsuarioId());
    }
}
