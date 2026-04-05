# 📚 Backend Documentation - DemoTech

## 📁 Folder Structure

```
DemoTech/
├── document/
│   └── BACKEND_CODING_CONVENTION.md    # 📏 Backend coding standards
├── src/main/java/com/example/demotech/
│   ├── DemotechApplication.java
│   └── base/
│       ├── config/                     # Configuration classes
│       ├── domain/                     # JPA entities
│       ├── dto/                        # Data Transfer Objects
│       ├── repository/                 # Data access layer
│       ├── service/                    # Business logic layer
│       │   └── impl/                   # Service implementations
│       ├── rest/                       # REST controllers
│       ├── mapper/                     # Object mappers
│       └── helper/                     # Utility classes
└── src/test/java/com/example/demotech/
    └── base/                           # Test classes
```

---

## 📏 Backend Coding Convention

### 📖 BACKEND_CODING_CONVENTION.md
- **Mô tả**: Quy tắc coding & best practices cho phần backend
- **Nội dung**: Java coding standards, Spring Boot patterns, API design principles
- **Đối tượng**: Backend developers working with Java/Spring Boot

**Các chủ đề chính:**
- ✅ **Project Structure** - Spring Boot package organization
- ✅ **Naming Conventions** - PascalCase, camelCase, UPPER_SNAKE_CASE
- ✅ **Class Design** - Entity, Service, Controller patterns
- ✅ **Exception Handling** - Custom exceptions & global handlers
- ✅ **API Design** - RESTful endpoints, response format, validation
- ✅ **Database & JPA** - Entity relationships, repository queries
- ✅ **Security** - Password encoding, JWT, CORS configuration
- ✅ **Testing** - Unit tests, integration tests, naming conventions
- ✅ **Code Quality** - SOLID principles, documentation, best practices

---

## 🎯 Quick Start for Backend Developers

### 1. Read the Convention
```bash
# Open the coding convention file
open document/BACKEND_CODING_CONVENTION.md
```

### 2. Understand Project Structure
- `config/` - Spring configuration classes
- `domain/` - JPA entities with database mapping
- `dto/` - Request/Response objects
- `repository/` - Data access layer
- `service/impl/` - Business logic implementations
- `rest/` - REST API controllers

### 3. Follow Best Practices
- Use Lombok for boilerplate code
- Implement proper exception handling
- Write comprehensive unit tests
- Document APIs with proper responses
- Follow security best practices

---

## 📝 Key Guidelines

### 🏷️ Naming
```java
// Classes: PascalCase
public class UserServiceImpl implements UserService

// Methods: camelCase
public User findById(Long id)

// Constants: UPPER_SNAKE_CASE
private static final String JWT_SECRET = "secret";
```

### 📦 Package Structure
```
com.example.demotech.base
├── config/          # @Configuration classes
├── domain/          # @Entity classes
├── dto/             # Request/Response DTOs
├── repository/      # @Repository interfaces
├── service/         # Business logic interfaces
│   └── impl/        # Service implementations
└── rest/            # @RestController classes
```

### 🌐 API Design
```java
@RestController
@RequestMapping("/api/users")
public class RestUserController {
    @PostMapping
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody CreateUserRequest request) {
        // Implementation
    }
}
```

### 🧪 Testing
```java
@SpringBootTest
class UserServiceTest {
    @Test
    void createUser_ShouldCreateUser_WhenValidRequest() {
        // Test implementation
    }
}
```

---

## 🔗 Related Documentation

- [Frontend Documentation](../demo-tech-client/document/README.md)
- [Project Root](../README.md)
- [Source Code](../src/main/java/)

---

## 📚 References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Java Coding Standards](https://google.github.io/styleguide/javaguide.html)
- [REST API Design](https://restfulapi.net/)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Framework**: Spring Boot 3.x  
**Language**: Java 17

