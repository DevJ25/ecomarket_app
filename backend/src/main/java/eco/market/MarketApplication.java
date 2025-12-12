package eco.market;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MarketApplication {

	public static void main(String[] args) {
		// 1. Cargar el archivo .env desde la raíz del proyecto.
		Dotenv dotenv = Dotenv.load();

		// 2. Exportar las variables cargadas al System Environment
		// para que Spring Boot pueda leerlas usando ${...} en appñlication.properties.
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		// 3. Inicializar la aplicación Spring Boot.
		SpringApplication.run(MarketApplication.class, args);
	}
}