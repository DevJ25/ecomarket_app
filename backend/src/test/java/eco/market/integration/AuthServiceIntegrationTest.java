package eco.market.integration;

import eco.market.dto.LoginRequest;
import eco.market.dto.RegistroRequest;
import eco.market.dto.AuthResponse;
import eco.market.repository.UsuarioRepository;
import eco.market.repository.RolRepository;
import eco.market.entity.Usuario;
import eco.market.entity.Rol;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class AuthServiceIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String baseUrl;

    @BeforeEach
    public void setUp() {
        baseUrl = "http://localhost:" + port + "/api/auth";
        // Clean up test data
        usuarioRepository.deleteAll();
    }

    @Test
    public void testUserRegistrationWithPasswordHashing() {
        // Arrange
        RegistroRequest request = new RegistroRequest();
        request.setNombre("Test");
        request.setApellido("User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setRol("COMPRADOR");

        // Act
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                baseUrl + "/registro",
                request,
                AuthResponse.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isNotEmpty();

        // Verify password is hashed
        Usuario usuario = usuarioRepository.findByEmail("test@example.com").orElse(null);
        assertThat(usuario).isNotNull();
        assertThat(usuario.getPasswordHash()).isNotEqualTo("password123");
        assertThat(passwordEncoder.matches("password123", usuario.getPasswordHash())).isTrue();
    }

    @Test
    public void testLoginWithValidCredentials() {
        // Arrange - Create a verified user
        Rol rol = rolRepository.findByNombreRol("COMPRADOR").orElseThrow();
        Usuario usuario = new Usuario();
        usuario.setNombre("Test");
        usuario.setApellido("User");
        usuario.setEmail("testlogin@example.com");
        usuario.setPasswordHash(passwordEncoder.encode("password123"));
        usuario.setRol(rol);
        usuario.setEsVerificado(true);
        usuario.setEstaActivo(true);
        usuarioRepository.save(usuario);

        LoginRequest request = new LoginRequest();
        request.setEmail("testlogin@example.com");
        request.setPassword("password123");

        // Act
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                baseUrl + "/login",
                request,
                AuthResponse.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isNotEmpty();
        assertThat(response.getBody().getEmail()).isEqualTo("testlogin@example.com");
    }

    @Test
    public void testLoginWithInvalidCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("wrongpassword");

        // Act
        ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/login",
                request,
                String.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testJWTTokenGeneration() {
        // Arrange
        RegistroRequest request = new RegistroRequest();
        request.setNombre("JWT");
        request.setApellido("Test");
        request.setEmail("jwttest@example.com");
        request.setPassword("password123");
        request.setRol("VENDEDOR");

        // Act
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(
                baseUrl + "/registro",
                request,
                AuthResponse.class);

        // Assert
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        String token = response.getBody().getToken();
        assertThat(token).isNotEmpty();
        // JWT tokens have 3 parts separated by dots
        assertThat(token.split("\\.")).hasSize(3);
    }
}
