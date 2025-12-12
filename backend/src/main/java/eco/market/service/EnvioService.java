package eco.market.service;

import eco.market.dto.EnvioRequest;
import eco.market.entity.Envio;
import eco.market.entity.Pedido;
import eco.market.entity.Usuario;
import eco.market.repository.EnvioRepository;
import eco.market.repository.PedidoRepository;
import eco.market.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class EnvioService {

    @Autowired
    private EnvioRepository envioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Envio crearEnvio(EnvioRequest request, String emailVendedor) {
        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        Usuario vendedor = usuarioRepository.findByEmail(emailVendedor)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        // Verificar que el pedido contenga productos del vendedor
        // (simplificado - en producción verificaríamos todos los detalles)

        Envio envio = new Envio();
        envio.setOrden(pedido);
        envio.setCodigoSeguimiento(request.getCodigoSeguimiento());
        envio.setTransportista(request.getTransportista());
        envio.setEstadoEnvio(request.getEstadoEnvio() != null ? request.getEstadoEnvio() : "preparando");
        envio.setUbicacionActual(request.getUbicacionActual());
        envio.setFechaEstimadaEntrega(request.getFechaEstimadaEntrega());
        envio.setFechaActualizacion(LocalDateTime.now());

        // Actualizar estado del pedido
        if (envio.getEstadoEnvio().equals("en_transito")) {
            pedido.setEstado("ENVIADO");
            pedidoRepository.save(pedido);
        }

        return envioRepository.save(envio);
    }

    public Envio actualizarEstadoEnvio(Integer envioId, String nuevoEstado, String emailVendedor) {
        Envio envio = envioRepository.findById(envioId)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));

        Usuario vendedor = usuarioRepository.findByEmail(emailVendedor)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));

        envio.setEstadoEnvio(nuevoEstado);
        envio.setFechaActualizacion(LocalDateTime.now());

        // Actualizar estado del pedido según el estado del envío
        Pedido pedido = envio.getOrden();
        switch (nuevoEstado) {
            case "en_transito":
                pedido.setEstado("ENVIADO");
                break;
            case "entregado":
                pedido.setEstado("ENTREGADO");
                break;
        }
        pedidoRepository.save(pedido);

        return envioRepository.save(envio);
    }

    public Envio obtenerEnvioPorPedido(Integer pedidoId) {
        return envioRepository.findByOrden_PedidoId(pedidoId)
                .orElse(null);
    }

    public Envio actualizarEnvio(Integer envioId, EnvioRequest request) {
        Envio envio = envioRepository.findById(envioId)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));

        if (request.getCodigoSeguimiento() != null) {
            envio.setCodigoSeguimiento(request.getCodigoSeguimiento());
        }
        if (request.getTransportista() != null) {
            envio.setTransportista(request.getTransportista());
        }
        if (request.getUbicacionActual() != null) {
            envio.setUbicacionActual(request.getUbicacionActual());
        }
        if (request.getFechaEstimadaEntrega() != null) {
            envio.setFechaEstimadaEntrega(request.getFechaEstimadaEntrega());
        }

        envio.setFechaActualizacion(LocalDateTime.now());

        return envioRepository.save(envio);
    }
}
