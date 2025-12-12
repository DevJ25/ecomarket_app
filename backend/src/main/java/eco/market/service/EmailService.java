package eco.market.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @org.springframework.scheduling.annotation.Async
    public void sendRegistrationConfirmationEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("¡Bienvenido a Ecomarket!");
        message.setFrom("noreply@ecomarket.com"); // Use a no-reply address

        String text = String.format(
                "Hola %s,\n\n" +
                        "Gracias por registrarte en Ecomarket, tu comunidad para productos sostenibles y ecológicos.\n\n"
                        +
                        "Estamos encantados de tenerte con nosotros.\n\n" +
                        "Saludos,\n" +
                        "El equipo de Ecomarket",
                name);

        message.setText(text);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            // Log the exception, but don't let it break the registration process
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void sendRegistrationConfirmationEmail(String email, String nombre, String verificationToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Confirma tu registro en Ecomarket");
        message.setFrom("noreply@ecomarket.com");

        String verificationLink = "http://localhost:3000/verify?token=" + verificationToken;

        String text = String.format(
                "Hola %s,\\n\\n" +
                        "Gracias por registrarte en Ecomarket.\\n\\n" +
                        "Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:\\n" +
                        "%s\\n\\n" +
                        "O usa este código de verificación: %s\\n\\n" +
                        "Si no solicitaste este registro, ignora este correo.\\n\\n" +
                        "Saludos,\\n" +
                        "El equipo de Ecomarket",
                nombre,
                verificationLink,
                verificationToken);

        message.setText(text);

        try {
            mailSender.send(message);
            System.out.println("Email de verificación enviado a: " + email);
        } catch (Exception e) {
            // Log the exception, but don't let it break the registration process
            System.err.println("Error sending verification email: " + e.getMessage());
            // Don't throw exception - registration should succeed even if email fails
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void sendVerificationCodeEmail(String email, String nombre, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Código de Verificación - Ecomarket");
        message.setFrom("noreply@ecomarket.com");

        String text = String.format(
                "Hola %s,\n\n" +
                        "Gracias por registrarte en Ecomarket.\n\n" +
                        "Tu código de verificación es: %s\n\n" +
                        "Este código expira en 15 minutos.\n\n" +
                        "Si no solicitaste este registro, ignora este correo.\n\n" +
                        "Saludos,\n" +
                        "El equipo de Ecomarket",
                nombre,
                code);

        message.setText(text);

        try {
            mailSender.send(message);
            System.out.println("Código de verificación enviado a: " + email);
        } catch (Exception e) {
            System.err.println("Error sending verification code: " + e.getMessage());
        }
    }

    @org.springframework.scheduling.annotation.Async
    public void sendPurchaseReceipt(String email, String nombre, Integer pedidoId, java.math.BigDecimal total) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Confirmación de Pedido #" + pedidoId + " - Ecomarket");
        message.setFrom("noreply@ecomarket.com");

        String text = String.format(
                "Hola %s,\n\n" +
                        "¡Gracias por tu compra en Ecomarket!\n\n" +
                        "Tu pedido #%d ha sido confirmado con éxito.\n" +
                        "Total: €%.2f\n\n" +
                        "Puedes ver el detalle de tu pedido en tu historial de compras.\n\n" +
                        "Gracias por apoyar el comercio sostenible.\n\n" +
                        "Saludos,\n" +
                        "El equipo de Ecomarket",
                nombre,
                pedidoId,
                total);

        message.setText(text);

        try {
            mailSender.send(message);
            System.out.println("Comprobante de compra enviado a: " + email);
        } catch (Exception e) {
            System.err.println("Error enviando comprobante de compra: " + e.getMessage());
        }
    }
}
