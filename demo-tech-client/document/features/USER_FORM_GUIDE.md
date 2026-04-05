# User Form Modal - Hướng dẫn sử dụng

## 📋 Tổng quan

`UserFormModal` là một component React dialog dùng để **tạo người dùng mới** hoặc **chỉnh sửa người dùng hiện tại**. Component tuân theo CODING_CONVENTION.md của dự án.

## 📁 Các file liên quan

```
src/pages/User/List/
├── UserFormModal.tsx          # Component form dialog
├── PageUser.tsx               # Page sử dụng UserFormModal
└── ListUser.tsx

src/models/
└── user.ts                    # User interfaces & types

src/pages/User/
└── user-service.ts            # API service functions
```

## 🎯 Tính năng

### ✅ Tạo người dùng mới
- Nhập tên đầy đủ, email, tên đăng nhập
- Thiết lập mật khẩu (bắt buộc)
- Xác nhận mật khẩu
- Chọn vai trò (Admin/User)

### ✏️ Chỉnh sửa người dùng
- Cập nhật tên, email, vai trò
- Tên đăng nhập không thể thay đổi (disabled)
- Không cần nhập lại mật khẩu

### 🛡️ Validation
- Họ tên: bắt buộc, tối thiểu 2 ký tự
- Email: bắt buộc, định dạng hợp lệ
- Tên đăng nhập: bắt buộc, tối thiểu 3 ký tự
- Mật khẩu: tối thiểu 6 ký tự (khi tạo mới)
- Xác nhận mật khẩu: phải trùng với mật khẩu

### 🎨 Styling
- Material-UI components
- Gradient button styling
- Responsive dialog layout
- Error messages & alerts

---

## 💻 Cách sử dụng

### Import Component
```typescript
import UserFormModal from '@/pages/User/List/UserFormModal';
```

### Component Props

```typescript
interface UserFormModalProps {
  open: boolean;              // Kiểm soát mở/đóng dialog
  user?: User | null;         // User data nếu edit, null nếu tạo mới
  onClose: () => void;        // Callback khi đóng dialog
  onSuccess: () => void;      // Callback khi form submit thành công
}
```

### Ví dụ sử dụng

```typescript
import { useState } from 'react';
import type { User } from '@/models/user';
import UserFormModal from '@/pages/User/List/UserFormModal';

function MyPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAddUser = () => {
    setSelectedUser(null);  // Tạo mới
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);  // Chỉnh sửa
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    // Làm gì đó sau khi form thành công
    // Ví dụ: refresh danh sách user
  };

  return (
    <>
      <button onClick={handleAddUser}>Thêm mới</button>
      <button onClick={() => handleEditUser(user)}>Chỉnh sửa</button>

      <UserFormModal
        open={formOpen}
        user={selectedUser}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
```

---

## 🔌 API Integration

### Create User API

```typescript
// src/pages/User/user-service.ts
export const createUser = async (payload: CreateUserPayload) => {
  return await api.post<User>(`/users`, payload);
};
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "username": "nguyenvana",
  "password": "password123",
  "role": "USER"
}
```

### Update User API

```typescript
// src/pages/User/user-service.ts
export const updateUser = async (payload: UpdateUserPayload) => {
  return await api.put<User>(`/users/${payload.id}`, data);
};
```

**Request Body:**
```json
{
  "id": 1,
  "name": "Nguyễn Văn A Updated",
  "email": "updated@example.com",
  "role": "ADMIN"
}
```

---

## 🎨 Data Models

### User Interface
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
```

### CreateUserPayload
```typescript
interface CreateUserPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}
```

### UpdateUserPayload
```typescript
interface UpdateUserPayload {
  id: number;
  name: string;
  email: string;
  username?: string;
  role: string;
}
```

---

## 🛠️ Tùy chỉnh

### Thêm/Xóa trường form
Sửa file `UserFormModal.tsx`:

1. Thêm field vào `UserFormValues` interface
2. Thêm validation schema
3. Thêm TextField component
4. Cập nhật `initialValues`
5. Cập nhật payload khi submit

**Ví dụ thêm trường phone:**

```typescript
interface UserFormValues {
  // ...existing fields...
  phone: string;
}

const userValidationSchema = Yup.object().shape({
  // ...existing validation...
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
});

// Trong JSX
<TextField
  label="Số điện thoại"
  name="phone"
  fullWidth
  value={formik.values.phone}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.phone && Boolean(formik.errors.phone)}
  helperText={formik.touched.phone && formik.errors.phone}
/>
```

### Thay đổi vai trò (roles)
Sửa hằng số `USER_ROLES`:

```typescript
const USER_ROLES = [
  { value: 'ADMIN', label: 'Quản trị viên' },
  { value: 'MANAGER', label: 'Quản lý' },
  { value: 'USER', label: 'Người dùng' },
];
```

### Thay đổi styling
Material-UI sx props có thể tùy chỉnh:

```typescript
<Button
  sx={{
    background: 'your-color',
    '&:hover': {
      background: 'hover-color',
    },
  }}
>
  Your Button
</Button>
```

---

## ⚠️ Error Handling

Component xử lý các lỗi sau:

1. **Network Error**: Hiển thị alert "Đã xảy ra lỗi khi xử lý yêu cầu"
2. **Validation Error**: Hiển thị lỗi dưới từng field
3. **API Error**: Hiển thị message từ server qua alert và toast

```typescript
catch (error: any) {
  const errorMessage =
    error?.response?.data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu';
  setSubmitError(errorMessage);
  toast.error(errorMessage);
}
```

---

## 📝 Coding Convention Tuân theo

✅ **Component Naming**: `UserFormModal.tsx` (PascalCase)  
✅ **Props Interface**: `UserFormModalProps` (PascalCase)  
✅ **Function Names**: `handleFormSubmit`, `handleFormClose` (camelCase)  
✅ **Validation**: Sử dụng Yup schema  
✅ **TypeScript**: Strict typing cho tất cả props & state  
✅ **Import Order**: External libs → Internal modules → Components → Types → Styles  
✅ **Error Handling**: Try-catch với toast notifications  
✅ **JSDoc Comments**: Function có documentation  
✅ **Destructuring**: Props destructured trong function signature  

---

## 🐛 Troubleshooting

### Form không hiển thị
- Kiểm tra `open={true}` được pass vào component
- Kiểm tra Modal render trong JSX

### Validation không hoạt động
- Kiểm tra Yup schema định nghĩa đúng
- Kiểm tra field `name` match với `initialValues`

### API call fail
- Kiểm tra backend endpoint: `POST /users` và `PUT /users/:id`
- Kiểm tra request payload match backend expectations
- Kiểm tra authorization token hợp lệ

### Style không áp dụng
- Kiểm tra Material-UI import đúng
- Kiểm tra sx props syntax đúng
- Kiểm tra Tailwind CSS configured đúng

---

## 📚 References

- [Formik Documentation](https://formik.org/)
- [Yup Validation](https://github.com/jquense/yup)
- [Material-UI Dialog](https://mui.com/material-ui/react-dialog/)
- [Material-UI TextField](https://mui.com/material-ui/react-text-field/)

---

**Last Updated**: April 2026  
**Version**: 1.0

