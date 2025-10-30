package ac.nsbm.onvent.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    // JavaMailSender bean is automatically configured by Spring Boot
    // based on the properties in application.properties
}