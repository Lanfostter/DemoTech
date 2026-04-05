# Coding Convention - DemoTech Client

## 📋 Mục lục
1. [Naming Conventions](#naming-conventions)
2. [File & Folder Structure](#file--folder-structure)
3. [Component Conventions](#component-conventions)
4. [TypeScript & Type Safety](#typescript--type-safety)
5. [Import & Export](#import--export)
6. [Code Style](#code-style)
7. [Error Handling](#error-handling)
8. [Performance](#performance)
9. [Comments & Documentation](#comments--documentation)

---

## 🏷️ Naming Conventions

### Variables & Functions
- **camelCase** cho variables, functions, parameters
```typescript
// ✅ Good
const userName = "admin";
const getUserById = (id: number) => { ... };
let isAuthenticated = false;

// ❌ Bad
const user_name = "admin";
const get_user_by_id = (id: number) => { ... };
let is_authenticated = false;
```

### Constants
- **UPPER_SNAKE_CASE** cho constants
```typescript
// ✅ Good
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = "http://localhost:8080/api";
const STORAGE_KEY = "accessToken";

// ❌ Bad
const maxRetryAttempts = 3;
const apiBaseUrl = "http://localhost:8080/api";
```

### React Components
- **PascalCase** cho component names
- File name phải match với component name
```typescript
// ✅ Good - LoginPage.tsx
export default function LoginPage() { ... }

// ❌ Bad - loginPage.tsx or login.tsx
export default function loginPage() { ... }
```

### Interfaces & Types
- **PascalCase** cho interfaces & types
- Prefix `I` cho interfaces (optional but recommended)
```typescript
// ✅ Good
interface IUserResponse {
  id: number;
  username: string;
}

type UserStatus = "active" | "inactive" | "pending";

// ❌ Bad
interface userResponse { ... }
interface user_response { ... }
```

### Hooks
- Bắt đầu với `use`
```typescript
// ✅ Good
const useAuth = () => { ... };
const useUserData = () => { ... };

// ❌ Bad
const getAuth = () => { ... };
const userDataHook = () => { ... };
```

### Enums & Constants
- **UPPER_SNAKE_CASE** hoặc **PascalCase**
```typescript
// ✅ Good
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  FORBIDDEN = 403,
}

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
} as const;
```

---

## 📁 File & Folder Structure

### Recommended Structure
```
src/
├── api/                    # API calls & axios config
│   └── axios.ts
├── assets/                 # Images, fonts, themes
│   ├── images/
│   └── shared-theme/
├── component/              # Reusable components
│   ├── AppTable.tsx
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── context/                # React Context
│   └── AuthContext.tsx
├── features/               # Redux slices
│   └── userSlice.ts
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   └── useFetch.ts
├── models/                 # TypeScript interfaces & types
│   ├── api-response.ts
│   ├── user.ts
│   └── common.ts
├── pages/                  # Page components
│   ├── Dashboard/
│   ├── User/
│   └── Setting/
├── routes/                 # Route definitions
│   ├── routes.tsx
│   └── private-routes.tsx
├── services/               # Business logic
│   ├── user-service.ts
│   └── auth-service.ts
├── store/                  # Redux store
│   └── store.ts
├── utils/                  # Utility functions
│   ├── helpers.ts
│   └── validators.ts
├── App.tsx
├── index.css
└── main.tsx
```

### Naming Rules
- **Pages**: PascalCase (e.g., `Dashboard.tsx`, `LoginPage.tsx`)
- **Components**: PascalCase (e.g., `UserTable.tsx`, `Modal.tsx`)
- **Services/Utils**: camelCase (e.g., `user-service.ts`, `api-helper.ts`)
- **Hooks**: camelCase (e.g., `useAuth.ts`, `useFetch.ts`)
- **Models/Types**: camelCase filename (e.g., `user.ts`, `api-response.ts`)

---

## ⚛️ Component Conventions

### Functional Components
```typescript
// ✅ Good
interface UserCardProps {
  userId: number;
  username: string;
  onEdit?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ userId, username, onEdit }) => {
  return <div>{username}</div>;
};

export default UserCard;
```

### Component Props
- Định nghĩa Props interface trước
- Đặt optional props cuối cùng
- Sử dụng `React.FC` hoặc function return JSX.Element
```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false, 
  variant = "primary" 
}) => {
  return <button>{label}</button>;
};

// ❌ Bad - Required props after optional
interface ButtonProps {
  disabled?: boolean;
  label: string;  // ❌ Required after optional
}
```

### State Management
```typescript
// ✅ Good - Use useState hook
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// ❌ Bad - Unclear state names
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(false);  // inconsistent naming
```

### Effects
```typescript
// ✅ Good
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response);
    } catch (err) {
      setError(err.message);
    }
  };
  
  fetchData();
}, []);

// ❌ Bad - Missing async wrapper
useEffect(async () => {
  const response = await fetchUsers();
  setUsers(response);
}, []);
```

---

## 📘 TypeScript & Type Safety

### Always Use Types
```typescript
// ✅ Good
const getUserData = (id: number): Promise<User> => {
  return api.get(`/users/${id}`);
};

// ❌ Bad
const getUserData = (id) => {
  return api.get(`/users/${id}`);
};
```

### Import Types
```typescript
// ✅ Good - Use type imports for types only
import type { User, UserResponse } from "@/models/user";
import { useAuth } from "@/hooks/useAuth";

// ❌ Bad - Mixing type and value imports
import { User, useAuth } from "@/models/user";
```

### Generic Types
```typescript
// ✅ Good - Use generics for reusable functions
const handleResponse = <T>(response: ApiResponse<T>): T => {
  return response.data;
};

// Response usage
const user = handleResponse<User>(response);
```

### Avoid `any`
```typescript
// ✅ Good
const handleError = (error: AxiosError<ErrorResponse>) => {
  console.error(error.response?.data?.message);
};

// ❌ Bad - Using any
const handleError = (error: any) => {
  console.error(error.message);
};
```

---

## 📤 Import & Export

### Import Order
1. External libraries
2. Internal modules (api, hooks, context)
3. Components
4. Types/Models
5. Styles

```typescript
// ✅ Good
import React, { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import { useAuth } from "@/hooks/useAuth";
import { login } from "@/services/user-service";

import LoginForm from "@/component/LoginForm";

import type { User } from "@/models/user";

import styles from "./LoginPage.module.css";

// ❌ Bad - Random order
import styles from "./LoginPage.module.css";
import { login } from "@/services/user-service";
import React from "react";
import type { User } from "@/models/user";
```

### Default vs Named Exports
```typescript
// ✅ Good - Page components: default export
// pages/Dashboard.tsx
export default function Dashboard() { ... }

// ✅ Good - Utilities: named export
// utils/validators.ts
export const validateEmail = (email: string): boolean => { ... };
export const validatePassword = (pwd: string): boolean => { ... };

// ✅ Good - Components: can be either
export const UserCard = () => { ... };
export default UserCard;

// or
export default function UserCard() { ... }
```

---

## 🎨 Code Style

### Formatting
- Use 2 spaces for indentation
- Line length max 100 characters
- Use single quotes for strings (unless template literals)

```typescript
// ✅ Good
const message = 'Welcome to DemoTech';
const template = `User: ${username}`;

// ❌ Bad
const message = "Welcome to DemoTech";
```

### Arrow Functions
```typescript
// ✅ Good - Consistent use of arrow functions
const handleClick = () => { ... };
const users = data.map((item) => item.name);

// ❌ Bad - Mixing function styles
function handleClick() { ... }
const users = data.map(function(item) { return item.name; });
```

### Destructuring
```typescript
// ✅ Good
const { username, email } = user;
const { data } = await api.get('/users');

// ❌ Bad
const username = user.username;
const email = user.email;
```

### Template Literals
```typescript
// ✅ Good
const message = `Hello ${username}, welcome back!`;

// ❌ Bad
const message = "Hello " + username + ", welcome back!";
```

### Optional Chaining & Nullish Coalescing
```typescript
// ✅ Good
const email = user?.email ?? 'N/A';
const roleCode = user?.role?.code?.name;

// ❌ Bad
const email = user && user.email ? user.email : 'N/A';
```

---

## ⚠️ Error Handling

### Try-Catch Pattern
```typescript
// ✅ Good
const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await api.get<User[]>('/users');
    setUsers(response);
  } catch (error) {
    const message = error instanceof AxiosError 
      ? error.response?.data?.message 
      : 'Unknown error';
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

// ❌ Bad - Silently fail
const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    setUsers(response);
  } catch (error) {
    // No error handling
  }
};
```

### Error Types
```typescript
// ✅ Good - Type your error responses
interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

const handleError = (error: AxiosError<ErrorResponse>) => {
  console.error(error.response?.data?.message);
};
```

---

## 🚀 Performance

### Memoization
```typescript
// ✅ Good - Memoize expensive computations
const MemoizedUserList = React.memo(UserList);

// ✅ Good - useMemo for expensive operations
const expensiveValue = useMemo(
  () => computeExpensiveValue(deps),
  [deps]
);
```

### Lazy Loading
```typescript
// ✅ Good - Lazy load pages
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Settings = React.lazy(() => import('@/pages/Setting'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### useCallback
```typescript
// ✅ Good - Prevent unnecessary re-renders
const handleUserClick = useCallback((userId: number) => {
  navigateTo(`/users/${userId}`);
}, []);
```

---

## 💬 Comments & Documentation

### Function Documentation
```typescript
// ✅ Good - JSDoc format
/**
 * Fetch user data by ID
 * @param userId - The user ID to fetch
 * @returns Promise containing user data
 * @throws AxiosError if user not found
 */
const getUserById = async (userId: number): Promise<User> => {
  return api.get(`/users/${userId}`);
};

// ❌ Bad - Vague comment
// Get user
const getUserById = async (userId: number) => {
  return api.get(`/users/${userId}`);
};
```

### Inline Comments
```typescript
// ✅ Good - Explain WHY, not WHAT
// Handle 401 to trigger refresh token logic
if (error.response?.status === 401) {
  return refreshToken();
}

// ❌ Bad - Obvious comment
// Check if status is 401
if (error.response?.status === 401) {
  return refreshToken();
}
```

### TODO Comments
```typescript
// ✅ Good
// TODO: Implement pagination for large datasets
// FIXME: Handle edge case for null responses
// NOTE: This relies on API caching behavior

// ❌ Bad
// fix this later
// something needs to be done here
```

---

## ✅ Checklist Trước Khi Commit

- [ ] TypeScript không có lỗi (`npm run lint`)
- [ ] Code đã được format (`npm run format`)
- [ ] Tất cả component có PropTypes hoặc TypeScript interfaces
- [ ] Error handling hoàn chỉnh
- [ ] Comments được thêm vào (nếu cần)
- [ ] Không có `console.log` trong production code
- [ ] Import statements theo đúng thứ tự
- [ ] Naming conventions được tuân theo
- [ ] Không sử dụng `any` type
- [ ] Component được memoized nếu cần

---

## 📚 References

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)

---

**Last Updated**: April 2026  
**Version**: 1.0

