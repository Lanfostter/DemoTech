import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String passwordHash = encoder.encode("admin");
        System.out.println("Hash for 'admin': " + passwordHash);
        
        // Verify
        boolean matches = encoder.matches("admin", passwordHash);
        System.out.println("Verify 'admin' matches: " + matches);
    }
}

