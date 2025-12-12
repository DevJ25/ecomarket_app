package eco.market.service;

import eco.market.dto.*;
import eco.market.entity.*;
import eco.market.repository.*;
import eco.market.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private EmailService emailService;

    public AuthResponse registrarUsuario(RegistroRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Determinar rol (por defecto COMPRADOR)
        String nombreRol = request.getRol() != null && !request.getRol().isEmpty() ? request.getRol().toUpperCase()
                : "COMPRADOR";

        // Validar que sea un rol permitido
        if (!nombreRol.equals("COMPRADOR") && !nombreRol.equals("VENDEDOR") && !nombreRol.equals("ADMIN")) {
            throw new RuntimeException("Rol no válido. Debe ser COMPRADOR, VENDEDOR o ADMIN");
        }

        // Convertir a minúsculas para buscar en BD (los roles están en minúsculas)
        String nombreRolBD = nombreRol.equals("ADMIN") ? "administrador" : nombreRol.toLowerCase();

        Rol rolAsignado = rolRepository.findByNombreRol(nombreRolBD)
                .orElseThrow(() -> new RuntimeException("Rol " + nombreRolBD + " no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setTelefono(request.getTelefono());
        usuario.setDireccion(request.getDireccion());
        usuario.setCiudad(request.getCiudad());
        usuario.setPais(request.getPais());
        usuario.setCodigoPostal(request.getCodigoPostal());
        usuario.setRol(rolAsignado);

        // Generar código de verificación de 6 dígitos
        String verificationCode = generateVerificationCode();
        usuario.setVerificationCode(verificationCode);
        usuario.setCodeExpiresAt(LocalDateTime.now().plusMinutes(15)); // Expira en 15 minutos
        usuario.setVerificationAttempts(0);
        usuario.setEsVerificado(false);

        usuario = usuarioRepository.save(usuario);

        // Enviar notificación de bienvenida
        notificacionService.crearNotificacion(
                usuario.getUsuarioId(),
                "¡Bienvenido a EcoMarket!",
                "Tu cuenta ha sido creada exitosamente. Por favor verifica tu email con el código enviado.",
                Notificacion.TipoNotificacion.sistema);

        // Enviar email con código de verificación
        emailService.sendVerificationCodeEmail(usuario.getEmail(), usuario.getNombre(), verificationCode);

        // NO se devuelve token JWT hasta que verifique el email
        return new AuthResponse(null, usuario.getUsuarioId(), usuario.getEmail(),
                usuario.getNombre(), usuario.getRol().getNombreRol());
    }

    private String generateVerificationCode() {
        // Generar código de 6 dígitos aleatorio
        return String.format("%06d", (int) (Math.random() * 1000000));
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        if (!usuario.getEstaActivo()) {
            throw new RuntimeException("Cuenta desactivada");
        }

        if (!usuario.getEsVerificado()) {
            throw new RuntimeException("Cuenta no verificada. Por favor revisa tu email.");
        }

        String token = jwtUtil.generateToken(usuario.getEmail());

        return new AuthResponse(token, usuario.getUsuarioId(), usuario.getEmail(),
                usuario.getNombre(), usuario.getRol().getNombreRol());
    }

    public String verifyCode(VerifyCodeRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validar si ya está verificado
        if (usuario.getEsVerificado()) {
            return "La cuenta ya está verificada";
        }

        // Validar intentos
        if (usuario.getVerificationAttempts() >= 5) {
            throw new RuntimeException("Demasiados intentos fallidos. Por favor, solicita un nuevo código.");
        }

        // Validar código
        if (!request.getCode().equals(usuario.getVerificationCode())) {
            usuario.setVerificationAttempts(usuario.getVerificationAttempts() + 1);
            usuarioRepository.save(usuario);
            throw new RuntimeException("Código incorrecto");
        }

        // Validar expiración
        if (usuario.getCodeExpiresAt() != null && usuario.getCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El código ha expirado. Por favor, solicita uno nuevo.");
        }

        // Verificar cuenta
        usuario.setEsVerificado(true);
        usuario.setVerificationCode(null);
        usuario.setCodeExpiresAt(null);
        usuario.setVerificationAttempts(0);
        usuarioRepository.save(usuario);

        // Notificar
        notificacionService.crearNotificacion(
                usuario.getUsuarioId(),
                "¡Cuenta Verificada!",
                "Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar sesión.",
                Notificacion.TipoNotificacion.sistema);

        return "Cuenta verificada exitosamente";
    }
}