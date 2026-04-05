# 📝 User Management - Edit/Delete Guide

## ✅ Tính năng mới: Edit & Delete User

Tôi đã thêm hoàn chỉnh tính năng chỉnh sửa và xóa người dùng.

---

## 🎯 Những gì được thêm

### 1. Action Buttons trong Table
Table user list giờ có 2 action buttons:
- **Edit** (Button xanh) - Mở form chỉnh sửa
- **Delete** (Button đỏ) - Xóa user với confirmation

### 2. Edit User
- Click button "Edit" trên bất kỳ row nào
- Form modal mở với dữ liệu user
- Có thể cập nhật: name, email, role
- Username **KHÔNG thể thay đổi** (disabled)
- Click "Cập nhật" để lưu

### 3. Delete User
- Click button "Delete" trên bất kỳ row nào
- Confirmation dialog xuất hiện
- Nếu xác nhận: user bị xóa
- Toast notification xác nhận thành công
- Table tự động refresh

---

## 📋 Các file được cập nhật

### 1. `PageUser.tsx` - Main logic
```typescript
✅ handleEditUserClick(user) - Mở form edit
✅ handleDeleteUserClick(user) - Xóa user với confirmation
✅ action={true} - Enable action buttons trong table
✅ onEdit={handleEditUserClick} - Pass edit callback
✅ onDelete={handleDeleteUserClick} - Pass delete callback
```

### 2. `user-service.ts` - API function
```typescript
export const deleteUser = async (userId: number): Promise<void>
```

Endpoint: `DELETE /api/users/{userId}`

### 3. `user.ts` - Model update
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;  // ✨ THÊM MỚI
  role: string;
}
```

### 4. `UserFormModal.tsx` - Form logic
```typescript
✅ Fix: username giờ gán từ user?.username (không phải user?.role)
✅ Auto-fill form khi edit mode
```

---

## 🚀 Cách sử dụng

### Edit User
1. Vào page "Quản lý người dùng"
2. Click button **"Edit"** (xanh) trên row user
3. Form modal mở hiển thị dữ liệu user
4. Chỉnh sửa các field (name, email, role)
5. Click **"Cập nhật"**
6. Toast success + table refresh

### Delete User
1. Vào page "Quản lý người dùng"
2. Click button **"Delete"** (đỏ) trên row user
3. Confirmation dialog xuất hiện
4. Nhấn OK để xác nhận xóa
5. Toast success + table refresh

---

## 🧪 API Endpoints (Backend)

### Get User List
```
POST /api/users/paging
Content-Type: application/json

{
  "pageIndex": 1,
  "pageSize": 10,
  "id": null,
  "name": "",
  "email": "",
  "role": ""
}
```

### Create User
```
POST /api/users
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "email@example.com",
  "username": "username",
  "password": "password123",
  "role": "USER"
}
```

### Update User
```
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "Nguyễn Văn A Updated",
  "email": "updated@example.com",
  "role": "ADMIN"
}
```

### Delete User
```
DELETE /api/users/{id}
```

**Response:**
```json
{
  "status": 200,
  "message": "Xóa người dùng thành công",
  "data": null
}
```

---

## 📊 Table Layout

```
┌─────┬────┬──────────┬──────────┬───────┬─────────────┐
│ STT │ ID │ Họ tên   │ Email    │ Role  │ Actions     │
├─────┼────┼──────────┼──────────┼───────┼─────────────┤
│  1  │ 1  │ Admin    │ a@x.com  │ ADMIN │ [Edit][Del] │
│  2  │ 2  │ User 1   │ u1@x.com │ USER  │ [Edit][Del] │
│  3  │ 3  │ User 2   │ u2@x.com │ USER  │ [Edit][Del] │
└─────┴────┴──────────┴──────────┴───────┴─────────────┘
```

---

## 💻 Code Flow

```
User Click "Edit"
    ↓
handleEditUserClick(user)
    ↓
setSelectedUser(user)
setFormModalOpen(true)
    ↓
UserFormModal opens with user data
    ↓
User fills form → Submit
    ↓
updateUser(payload) - API call
    ↓
Success → Toast + Close form
    ↓
handleFormSuccess()
    ↓
fetchUsers() - Refresh table
```

---

## 🛡️ Error Handling

### Create/Update Error
- Show Alert in form
- Show Toast notification
- Keep form open

### Delete Error
- Show Toast error
- Don't refresh table
- Keep row in table

### Network Error
- Catch AxiosError
- Extract error message from response
- Display user-friendly message

---

## 🎨 UI/UX Improvements

✅ **Confirmation Dialog** - Prevent accidental deletion  
✅ **Toast Notifications** - Immediate feedback  
✅ **Auto Refresh** - No manual refresh needed  
✅ **Disabled Field** - Prevent username change  
✅ **Color Coding** - Blue for edit, Red for delete  
✅ **Loading State** - Button disabled during submit  

---

## 📝 Table Columns Structure

| Column | Type | Editable | Searchable |
|--------|------|----------|-----------|
| STT | Auto | ❌ | ❌ |
| ID | Number | ❌ | ✅ |
| Họ tên | String | ✅ | ✅ |
| Email | Email | ✅ | ✅ |
| Role | Select | ✅ | ✅ |
| Actions | Button | ❌ | ❌ |

---

## ✅ Checklist Trước Sử Dụng

- [ ] Backend endpoint `/users/{id}` (PUT) - Update
- [ ] Backend endpoint `/users/{id}` (DELETE) - Delete
- [ ] User table trả về `username` field
- [ ] Password hashing on backend
- [ ] Authorization middleware configured
- [ ] CORS enabled
- [ ] Error responses có `message` field

---

## 🐛 Troubleshooting

### Edit button không hoạt động
- Check `onEdit` callback passed to AppTable
- Check `action={true}` enabled

### Delete không xóa được
- Check backend endpoint: `DELETE /api/users/{id}`
- Check authorization token
- Check user ID truyền đúng

### Form không hiển thị username khi edit
- Check User interface có `username` field
- Check API response trả về `username`
- Check `initialValues` assign đúng

### Confirmation dialog không hiện
- Check `window.confirm()` available
- Check browser bị block alert dialogs

---

## 🔄 Future Improvements

- [ ] Bulk delete (select multiple users)
- [ ] Edit trực tiếp trong table (inline edit)
- [ ] Undo/Redo functionality
- [ ] User activity log
- [ ] Role permission control
- [ ] Advanced filters & search
- [ ] Export to Excel
- [ ] Import from Excel

---

## 📚 References

- Material-React-Table: https://www.material-react-table.com/
- React Hooks: https://react.dev/reference/react
- Material-UI: https://mui.com/
- Formik: https://formik.org/
- Yup: https://github.com/jquense/yup

---

**Status:** ✅ Ready to use  
**Last Updated:** April 2026  
**Version:** 2.0 (Edit/Delete added)

