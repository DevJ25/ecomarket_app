package eco.market.service;

import eco.market.dto.DevolucionRequest;
import eco.market.entity.Devolucion;
import eco.market.entity.Pedido;
import eco.market.entity.Producto;
import eco.market.entity.Usuario;
import eco.market.repository.DevolucionRepository;
import eco.market.repository.PedidoRepository;
import eco.market.repository.ProductoRepository;
import eco.market.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DevolucionService {

    @Autowired
    private DevolucionRepository devolucionRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Devolucion solicitarDevolucion(DevolucionRequest request, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!pedido.getUsuario().getUsuarioId().equals(usuario.getUsuarioId())) {
            throw new RuntimeException("Este pedido no te pertenece");
        }

        Devolucion devolucion = new Devolucion();
        devolucion.setOrden(pedido);
        devolucion.setUsuario(usuario);
        devolucion.setProducto(producto);
        devolucion.setCantidad(request.getCantidad());
        devolucion.setMotivo(request.getMotivo());
        devolucion.setImagenEvidencia(request.getImagenEvidencia());
        devolucion.setEstado("solicitada");

        return devolucionRepository.save(devolucion);
    }

    public List<Devolucion> obtenerDevolucionesComprador(String email) {
        return devolucionRepository.findByUsuario_Email(email);
    }

    public List<Devolucion> obtenerDevolucionesVendedor(String email) {
        return devolucionRepository.findByVendedorEmail(email);
    }

    public Devolucion actualizarEstadoDevolucion(Integer devolucionId, String nuevoEstado, String email) {
        Devolucion devolucion = devolucionRepository.findById(devolucionId)
                .orElseThrow(() -> new RuntimeException("Devolución no encontrada"));

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar que el usuario sea el vendedor del producto o admin
        boolean esVendedor = devolucion.getProducto().getVendedor().getUsuarioId().equals(usuario.getUsuarioId());
        boolean esAdmin = usuario.getRol().getNombreRol().equals("ADMIN");

        if (!esVendedor && !esAdmin) {
            throw new RuntimeException("No tienes permiso para actualizar esta devolución");
        }

        devolucion.setEstado(nuevoEstado);
        if (nuevoEstado.equals("aprobada") || nuevoEstado.equals("rechazada")) {
            devolucion.setFechaResolucion(LocalDateTime.now());
        }

        return devolucionRepository.save(devolucion);
    }

    public Devolucion procesarReembolso(Integer devolucionId) {
        Devolucion devolucion = devolucionRepository.findById(devolucionId)
                .orElseThrow(() -> new RuntimeException("Devolución no encontrada"));

        if (!devolucion.getEstado().equals("aprobada")) {
            throw new RuntimeException("La devolución debe estar aprobada para procesar el reembolso");
        }

        // Aquí iría la lógica real de reembolso con el procesador de pagos
        // Por ahora solo simulamos
        devolucion.setEstado("reembolsada");
        devolucion.setFechaResolucion(LocalDateTime.now());

        return devolucionRepository.save(devolucion);
    }
}
