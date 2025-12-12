package eco.market.service;

import eco.market.dto.ResenaRequest;
import eco.market.entity.Resena;
import eco.market.entity.Producto;
import eco.market.entity.Usuario;
import eco.market.entity.Pedido;
import eco.market.repository.ResenaRepository;
import eco.market.repository.ProductoRepository;
import eco.market.repository.UsuarioRepository;
import eco.market.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public Resena crearResena(ResenaRequest request, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Verificar que el usuario haya comprado el producto
        if (!pedido.getUsuario().getUsuarioId().equals(usuario.getUsuarioId())) {
            throw new RuntimeException("No puedes reseñar un producto que no has comprado");
        }

        Resena resena = new Resena();
        resena.setUsuario(usuario);
        resena.setProducto(producto);
        resena.setOrden(pedido);
        resena.setCalificacion(request.getCalificacion());
        resena.setComentario(request.getComentario());
        resena.setEsVerificado(true); // Verificado porque compró el producto
        resena.setReportada(false);

        Resena savedResena = resenaRepository.save(resena);

        // Actualizar calificación promedio del producto
        actualizarCalificacionProducto(producto.getProductoId());

        return savedResena;
    }

    public List<Resena> obtenerResenasPorProducto(Integer productoId) {
        return resenaRepository.findByProducto_ProductoId(productoId);
    }

    public void reportarResena(Integer resenaId) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        resena.setReportada(true);
        resenaRepository.save(resena);
    }

    public void eliminarResena(Integer resenaId, String email) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Solo el autor o un admin pueden eliminar
        if (!resena.getUsuario().getUsuarioId().equals(usuario.getUsuarioId()) &&
                !usuario.getRol().getNombreRol().equals("ADMIN")) {
            throw new RuntimeException("No tienes permiso para eliminar esta reseña");
        }

        Integer productoId = resena.getProducto().getProductoId();
        resenaRepository.delete(resena);

        // Actualizar calificación promedio del producto
        actualizarCalificacionProducto(productoId);
    }

    public List<Resena> obtenerResenasReportadas() {
        return resenaRepository.findByReportadaTrue();
    }

    public List<Resena> obtenerResenasVendedor(String email) {
        return resenaRepository.findByProducto_Vendedor_Email(email);
    }

    private void actualizarCalificacionProducto(Integer productoId) {
        List<Resena> resenas = resenaRepository.findByProducto_ProductoId(productoId);
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (resenas.isEmpty()) {
            producto.setCalificacionPromedio(BigDecimal.ZERO);
            producto.setTotalCalificaciones(0);
        } else {
            double promedio = resenas.stream()
                    .mapToInt(Resena::getCalificacion)
                    .average()
                    .orElse(0.0);

            producto.setCalificacionPromedio(BigDecimal.valueOf(promedio).setScale(2, RoundingMode.HALF_UP));
            producto.setTotalCalificaciones(resenas.size());
        }

        productoRepository.save(producto);
    }
}
