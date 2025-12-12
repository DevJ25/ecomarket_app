package eco.market.service;

import eco.market.dto.CuponRequest;
import eco.market.entity.Cupon;
import eco.market.repository.CuponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CuponService {

    @Autowired
    private CuponRepository cuponRepository;

    public Cupon crearCupon(CuponRequest request) {
        Cupon cupon = new Cupon();
        cupon.setCodigo(request.getCodigo().toUpperCase());
        cupon.setDescripcion(request.getDescripcion());
        cupon.setTipoDescuento(request.getTipoDescuento());
        cupon.setValorDescuento(request.getValorDescuento());
        cupon.setMaximoDescuento(request.getMaximoDescuento());
        cupon.setMinCompra(request.getMinCompra());
        cupon.setUsosMaximos(request.getUsosMaximos());
        cupon.setFechaInicio(request.getFechaInicio());
        cupon.setFechaFin(request.getFechaFin());
        cupon.setEstaActivo(true);
        cupon.setUsosActuales(0);

        return cuponRepository.save(cupon);
    }

    public Cupon validarCupon(String codigo) {
        Cupon cupon = cuponRepository.findByCodigo(codigo.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));

        LocalDateTime ahora = LocalDateTime.now();

        if (!cupon.getEstaActivo()) {
            throw new RuntimeException("El cupón no está activo");
        }

        if (ahora.isBefore(cupon.getFechaInicio())) {
            throw new RuntimeException("El cupón aún no es válido");
        }

        if (ahora.isAfter(cupon.getFechaFin())) {
            throw new RuntimeException("El cupón ha expirado");
        }

        if (cupon.getUsosMaximos() != null && cupon.getUsosActuales() >= cupon.getUsosMaximos()) {
            throw new RuntimeException("El cupón ha alcanzado su límite de usos");
        }

        return cupon;
    }

    public void aplicarCupon(String codigo) {
        Cupon cupon = cuponRepository.findByCodigo(codigo.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));

        cupon.setUsosActuales(cupon.getUsosActuales() + 1);
        cuponRepository.save(cupon);
    }

    public List<Cupon> obtenerCuponesActivos() {
        return cuponRepository.findByEstaActivoTrue();
    }

    public void eliminarCupon(Integer cuponId) {
        Cupon cupon = cuponRepository.findById(cuponId)
                .orElseThrow(() -> new RuntimeException("Cupón no encontrado"));
        cupon.setEstaActivo(false);
        cuponRepository.save(cupon);
    }
}
