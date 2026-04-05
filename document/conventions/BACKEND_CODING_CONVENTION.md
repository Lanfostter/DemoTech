# 📏 Backend Coding Convention - DemoTech

## 📋 Mục lục
1. [Project Structure](#project-structure)
2. [Naming Conventions](#naming-conventions)
3. [Package Organization](#package-organization)
4. [Class Design](#class-design)
5. [Exception Handling](#exception-handling)
6. [API Design](#api-design)
7. [Database & JPA](#database--jpa)
8. [Security](#security)
9. [Testing](#testing)
10. [Code Quality](#code-quality)
11. [Documentation](#documentation)

---

## 🏗️ Project Structure

### Recommended Structure
```
src/main/java/com/example/demotech/
├── DemotechApplication.java          # Main application class
├── base/                             # Core business logic
│   ├── config/                       # Configuration classes
│   ├── domain/                       # JPA entities
│   ├── dto/                          # Data Transfer Objects
│   ├── repository/                   # Data access layer
│   ├── service/                      # Business logic layer
│   │   ├── impl/                     # Service implementations
│   ├── rest/                         # REST controllers
│   ├── mapper/                       # Object mappers
│   └── helper/                       # Utility classes
└── resources/
    ├── application.properties        # Main config
    ├── application-prod.properties   # Production config
    └── templates/                    # Email templates
```

### Test Structure
```
src/test/java/com/example/demotech/
├── DemotechApplicationTests.java     # Main test class
└── base/
    ├── controller/                   # Controller tests
    ├── service/                      # Service tests
    └── repository/                   # Repository tests
```

---

## 🏷️ Naming Conventions

### Classes & Interfaces
- **PascalCase** cho tất cả class names
- Interfaces: **PascalCase** (không cần prefix `I`)
```java
// ✅ Good
public class UserServiceImpl implements UserService {
public interface AuthService {
public class JwtAuthenticationFilter extends OncePerRequestFilter {

// ❌ Bad
public class userServiceImpl implements userService {
public interface IAuthService {
public class jwt_authentication_filter extends OncePerRequestFilter {
```

### Methods & Variables
- **camelCase** cho methods và variables
- Constants: **UPPER_SNAKE_CASE**
```java
// ✅ Good
private String userName;
public User findById(Long id) {
private static final String JWT_SECRET = "secret";

// ❌ Bad
private String user_name;
public User FindById(Long id) {
private static final String jwtSecret = "secret";
```

### Packages
- **lowercase** cho package names
- Theo chức năng: `repository`, `service`, `controller`
```java
// ✅ Good
package com.example.demotech.base.service;
package com.example.demotech.base.repository;

// ❌ Bad
package com.example.demotech.base.Service;
package com.example.demotech.Base.Repository;
```

### Database Tables & Columns
- **snake_case** cho table/column names
- Entity classes: **PascalCase**
```java
// Entity class
@Entity
@Table(name = "user_info")  // snake_case
public class User {
    @Column(name = "first_name")  // snake_case
    private String firstName;      // camelCase
}
```

---

## 📦 Package Organization

### Controller Layer (`rest/`)
- REST endpoints
- Request/Response mapping
- Validation annotations
```java
@RestController
@RequestMapping("/api/users")
public class RestUserController {
    // Only HTTP concerns
}
```

### Service Layer (`service/`)
- Business logic
- Transaction management
- Interface + Implementation pattern
```java
public interface UserService {
    User createUser(CreateUserRequest request);
}

@Service
public class UserServiceImpl implements UserService {
    // Business logic implementation
}
```

### Repository Layer (`repository/`)
- Data access
- JPA/Hibernate queries
- Custom query methods
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
```

### Domain Layer (`domain/`)
- JPA entities
- Database mapping
- Relationships
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```

### DTO Layer (`dto/`)
- Request/Response objects
- Validation
- API contracts
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {
    @NotBlank
    private String username;

    @Email
    private String email;
}
```

---

## 🏛️ Class Design

### Entity Classes
- Use Lombok for boilerplate
- Proper JPA annotations
- Validation annotations
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank
    private String username;

    @Column(nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    @JsonIgnore  // Don't serialize password
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### Service Classes
- Interface segregation
- Single responsibility
- Transaction boundaries
```java
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User createUser(CreateUserRequest request) {
        // Validation
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists");
        }

        // Business logic
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        return userRepository.save(user);
    }
}
```

### Controller Classes
- Thin controllers
- Proper HTTP status codes
- Response entities
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class RestUserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.ok(ApiResponse.success("User created successfully", user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }
}
```

---

## ⚠️ Exception Handling

### Custom Exceptions
- Extend RuntimeException
- Meaningful names
- Include error codes
```java
public class BusinessException extends RuntimeException {
    private final String errorCode;

    public BusinessException(String message) {
        super(message);
        this.errorCode = "BUSINESS_ERROR";
    }

    public BusinessException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(String.format("%s not found with id: %s", resource, id));
    }
}
```

### Global Exception Handler
- Centralized error handling
- Proper HTTP status codes
- Consistent error responses
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Internal server error"));
    }
}
```

---

## 🌐 API Design

### RESTful Endpoints
- Proper HTTP methods
- Resource-based URLs
- Consistent naming
```java
// ✅ Good
GET    /api/users          // List users
GET    /api/users/{id}     // Get user by ID
POST   /api/users          // Create user
PUT    /api/users/{id}     // Update user
DELETE /api/users/{id}     // Delete user
POST   /api/auth/login     // Login

// ❌ Bad
GET    /api/getAllUsers
POST   /api/createNewUser
GET    /api/userDetails?id=123
```

### Response Format
- Consistent API response wrapper
- Include status, message, data
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}
```

### Request Validation
- Bean validation annotations
- Custom validation messages
```java
public class CreateUserRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
```

---

## 🗄️ Database & JPA

### Entity Relationships
- Proper cascade types
- Fetch strategies
- Bidirectional relationships
```java
@Entity
@Table(name = "users")
public class User {
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
}

@Entity
@Table(name = "orders")
public class Order {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
```

### Repository Queries
- Method name queries
- @Query annotations
- Custom repository interfaces
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Method name query
    Optional<User> findByUsername(String username);

    // Custom query
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.active = true")
    Optional<User> findActiveUserByEmail(@Param("email") email);

    // Native query
    @Query(value = "SELECT * FROM users WHERE created_at >= :startDate", nativeQuery = true)
    List<User> findUsersCreatedAfter(@Param("startDate") LocalDateTime startDate);
}
```

### Database Migrations
- Use Flyway or Liquibase
- Versioned scripts
- Descriptive names
```sql
-- V1__create_users_table.sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔒 Security

### Password Encoding
- Use BCryptPasswordEncoder
- Never store plain passwords
```java
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### JWT Authentication
- Secure token generation
- Proper expiration
- Refresh token pattern
```java
@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
}
```

### CORS Configuration
- Proper origin restrictions
- Method allowances
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

---

## 🧪 Testing

### Unit Tests
- Test business logic
- Mock dependencies
- Use @SpringBootTest for integration
```java
@SpringBootTest
class UserServiceTest {

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Test
    void createUser_ShouldCreateUser_WhenValidRequest() {
        // Given
        CreateUserRequest request = new CreateUserRequest("testuser", "test@example.com", "password");
        User savedUser = new User(1L, "testuser", "test@example.com", "encodedPassword", Role.USER);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // When
        User result = userService.createUser(request);

        // Then
        assertThat(result.getUsername()).isEqualTo("testuser");
        verify(userRepository).save(any(User.class));
    }
}
```

### Controller Tests
- Test HTTP endpoints
- MockMvc for integration testing
```java
@SpringBootTest
@AutoConfigureMockMvc
class RestUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void createUser_ShouldReturn201_WhenValidRequest() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest("testuser", "test@example.com", "password123");

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
```

### Test Naming Convention
- **methodName_ShouldExpectedResult_WhenCondition**
```java
// ✅ Good
createUser_ShouldThrowException_WhenUsernameExists
login_ShouldReturnToken_WhenValidCredentials
getUser_ShouldReturnUser_WhenUserExists

// ❌ Bad
testCreateUser
testLogin
userTest
```

---

## 🧹 Code Quality

### Code Formatting
- Use consistent indentation (4 spaces)
- Line length max 120 characters
- Proper imports organization

### Code Smells to Avoid
- Long methods (> 30 lines)
- Large classes (> 300 lines)
- Deep nesting (> 3 levels)
- Magic numbers/strings
- Duplicate code

### SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable for base types
- **Interface Segregation**: Clients shouldn't depend on unused methods
- **Dependency Inversion**: Depend on abstractions, not concretions

---

## 📚 Documentation

### JavaDoc Comments
- Classes, interfaces, methods
- Parameter descriptions
- Return value descriptions
- Exception documentation
```java
/**
 * Service class for user management operations.
 * Handles user creation, authentication, and profile management.
 */
@Service
public class UserServiceImpl implements UserService {

    /**
     * Creates a new user with the provided information.
     *
     * @param request the user creation request containing username, email, and password
     * @return the created user entity
     * @throws BusinessException if username already exists
     */
    @Override
    public User createUser(CreateUserRequest request) {
        // Implementation
    }
}
```

### README Files
- Project setup instructions
- API documentation
- Deployment guides
- Contributing guidelines

### API Documentation
- Use SpringDoc OpenAPI
- Comprehensive endpoint documentation
```java
@Operation(summary = "Create a new user", description = "Creates a new user account")
@ApiResponse(responseCode = "200", description = "User created successfully")
@PostMapping
public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody CreateUserRequest request) {
    // Implementation
}
```

---

## ✅ Checklist Trước Khi Commit

- [ ] Code compiles without errors
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Code follows naming conventions
- [ ] No magic numbers/strings
- [ ] Proper exception handling
- [ ] Database queries are optimized
- [ ] Security best practices followed
- [ ] Code is documented with JavaDoc
- [ ] No sensitive data in logs
- [ ] Code reviewed by peer

---

## 📚 References

- [Spring Boot Best Practices](https://spring.io/guides)
- [Java Coding Standards](https://google.github.io/styleguide/javaguide.html)
- [REST API Design](https://restfulapi.net/)
- [OWASP Security Guidelines](https://owasp.org/)
- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Framework**: Spring Boot 3.x  
**Language**: Java 17

