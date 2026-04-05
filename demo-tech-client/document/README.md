# 📚 Documentation - DemoTech Client

## 📁 Folder Structure

```
demo-tech-client/
├── document/
│   ├── features/          # 📋 Mô tả chức năng & features
│   │   ├── COMPLETE_SUMMARY.md          # Tổng quan toàn bộ hệ thống
│   │   ├── FORM_SUMMARY.md              # Tóm tắt form components
│   │   ├── PASSWORD_CHANGE_FEATURE.md   # Tính năng đổi mật khẩu
│   │   ├── USER_FORM_GUIDE.md           # Hướng dẫn form user
│   │   └── USER_MANAGEMENT_GUIDE.md     # Hướng dẫn quản lý user (CRUD)
│   └── conventions/       # 📏 Coding conventions & standards
│       └── CODING_CONVENTION.md         # Frontend coding standards
```

---

## 📋 Features Documentation

### 📖 COMPLETE_SUMMARY.md
- **Mô tả**: Tổng quan toàn bộ hệ thống quản lý user
- **Nội dung**: CRUD operations, API endpoints, UI components
- **Đối tượng**: Developers & stakeholders

### 📝 FORM_SUMMARY.md
- **Mô tả**: Tóm tắt các form components
- **Nội dung**: UserFormModal, validation, props, usage
- **Đối tượng**: Frontend developers

### 🔐 PASSWORD_CHANGE_FEATURE.md
- **Mô tả**: Tính năng checkbox "Đổi mật khẩu" khi edit user
- **Nội dung**: Implementation, validation, security, testing
- **Đối tượng**: Developers implementing password features

### 📋 USER_FORM_GUIDE.md
- **Mô tả**: Hướng dẫn chi tiết UserFormModal component
- **Nội dung**: Props, interfaces, examples, customization
- **Đối tượng**: Developers using the form component

### 👥 USER_MANAGEMENT_GUIDE.md
- **Mô tả**: Hướng dẫn quản lý user (Create, Read, Update, Delete)
- **Nội dung**: UI flow, API integration, error handling
- **Đối tượng**: End users & developers

---

## 📏 Conventions Documentation

### 📏 CODING_CONVENTION.md
- **Mô tả**: Quy tắc coding & best practices cho dự án
- **Nội dung**: Naming conventions, TypeScript, React patterns, error handling
- **Đối tượng**: All developers working on the project

---

## 🎯 Quick Access

### For New Developers:
1. **Start with**: `CODING_CONVENTION.md` - Learn coding standards
2. **Then**: `COMPLETE_SUMMARY.md` - Understand the system
3. **Finally**: Specific feature guides as needed

### For Code Reviews:
- **Standards Check**: `CODING_CONVENTION.md`
- **Feature Verification**: Relevant feature guide

---

## 📝 Contributing to Documentation

### Adding New Features:
1. Create feature documentation in `features/` folder
2. Follow naming convention: `FEATURE_NAME.md`
3. Include: description, implementation, usage, testing

### Updating Conventions:
1. Update `CODING_CONVENTION.md` in `conventions/` folder
2. Ensure all team members are aware of changes
3. Update this README if needed

---

## 🔗 Related Links

- [Project Root](../../README.md)
- [Source Code](../src/)
- [API Documentation](../../src/main/java/) (Backend)

---

**Last Updated**: April 2026  
**Version**: 1.0  
**Maintainer**: Development Team
