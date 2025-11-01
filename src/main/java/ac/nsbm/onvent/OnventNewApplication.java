package ac.nsbm.onvent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "ac.nsbm.onvent.newsystem")
public class OnventNewApplication {
    public static void main(String[] args) {
        // Set the active profile to ensure we use the new configuration
        System.setProperty("spring.profiles.active", "new");
        SpringApplication.run(OnventNewApplication.class, args);
    }
}