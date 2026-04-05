import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  MenuItem,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Formik, Form } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import type { CreateUserPayload, UpdateUserPayload, User } from '../../../models/user';
import { createUser, updateUser } from '../user-service';

interface UserFormModalProps {
  open: boolean;
  user?: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserFormValues {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  changePassword?: boolean;
  newPassword?: string;
  confirmNewPassword?: string;
}

const USER_ROLES = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'User' },
];

const userValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vui lòng nhập họ tên')
    .min(2, 'Họ tên phải ít nhất 2 ký tự'),
  email: Yup.string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ'),
  username: Yup.string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải ít nhất 3 ký tự'),
  password: Yup.string()
    .test('password-required', 'Vui lòng nhập mật khẩu', function (value) {
      return this.parent.user ? true : !!value;
    })
    .min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
  confirmPassword: Yup.string()
    .test('passwords-match', 'Mật khẩu xác nhận không trùng khớp', function (value) {
      return this.parent.password === value;
    }),
  role: Yup.string().required('Vui lòng chọn vai trò'),
  newPassword: Yup.string()
    .when('changePassword', {
      is: true,
      then: Yup.string()
        .required('Vui lòng nhập mật khẩu mới')
        .min(6, 'Mật khẩu mới phải ít nhất 6 ký tự'),
    }),
  confirmNewPassword: Yup.string()
    .when('changePassword', {
      is: true,
      then: Yup.string()
        .required('Vui lòng xác nhận mật khẩu mới')
        .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu xác nhận không khớp'),
    }),
});

/**
 * User Form Modal Component
 * Used for creating new users or editing existing users
 * @param open - Whether the dialog is open
 * @param user - User data if editing (null if creating)
 * @param onClose - Callback when dialog is closed
 * @param onSuccess - Callback when form is successfully submitted
 */
const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  user,
  onClose,
  onSuccess,
}) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const isEditMode = !!user;
  const dialogTitle = isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới';

  const initialValues: UserFormValues = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    username: user?.username ?? '',
    password: '',
    confirmPassword: '',
    role: user?.role ?? 'USER',
    changePassword: false,
    newPassword: '',
    confirmNewPassword: '',
  };

  const handleFormSubmit = async (
    values: UserFormValues,
    { setSubmitting }: FormikHelpers<UserFormValues>
  ) => {
    try {
      setSubmitError(null);

      if (isEditMode && user) {
        // Update existing user
        const updatePayload: UpdateUserPayload = {
          id: user.id,
          name: values.name,
          email: values.email,
          role: values.role,
        };

        // Add password if changing
        if (values.changePassword && values.newPassword) {
          (updatePayload as any).password = values.newPassword;
        }

        await updateUser(updatePayload);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        // Create new user
        const createPayload: CreateUserPayload = {
          name: values.name,
          email: values.email,
          username: values.username,
          password: values.password,
          role: values.role,
        };
        await createUser(createPayload);
        toast.success('Tạo người dùng thành công!');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu';
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitError(null);
    setChangePassword(false); // Reset checkbox state
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={userValidationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
      >
        {(formik) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                {submitError && <Alert severity="error">{submitError}</Alert>}

                <TextField
                  label="Họ tên"
                  name="name"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={
                    formik.touched.name && typeof formik.errors.name === 'string'
                      ? formik.errors.name
                      : ''
                  }
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={
                    formik.touched.email && typeof formik.errors.email === 'string'
                      ? formik.errors.email
                      : ''
                  }
                />

                <TextField
                  label="Tên đăng nhập"
                  name="username"
                  fullWidth
                  disabled={isEditMode}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={
                    isEditMode
                      ? 'Không thể thay đổi tên đăng nhập'
                      : formik.touched.username && typeof formik.errors.username === 'string'
                      ? formik.errors.username
                      : ''
                  }
                />

                {!isEditMode && (
                  <>
                    <TextField
                      label="Mật khẩu"
                      name="password"
                      type="password"
                      fullWidth
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.password && Boolean(formik.errors.password)}
                      helperText={
                        formik.touched.password && typeof formik.errors.password === 'string'
                          ? formik.errors.password
                          : ''
                      }
                    />

                    <TextField
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type="password"
                      fullWidth
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.confirmPassword &&
                        Boolean(formik.errors.confirmPassword)
                      }
                      helperText={
                        formik.touched.confirmPassword &&
                        typeof formik.errors.confirmPassword === 'string'
                          ? formik.errors.confirmPassword
                          : ''
                      }
                    />
                  </>
                )}

                <TextField
                  label="Vai trò"
                  name="role"
                  select
                  fullWidth
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.role && Boolean(formik.errors.role)}
                  helperText={
                    formik.touched.role && typeof formik.errors.role === 'string'
                      ? formik.errors.role
                      : ''
                  }
                >
                  {USER_ROLES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                {isEditMode && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Đổi mật khẩu"
                  />
                )}

                {changePassword && (
                  <>
                    <TextField
                      label="Mật khẩu mới"
                      name="newPassword"
                      type="password"
                      fullWidth
                      value={formik.values.newPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                      helperText={
                        formik.touched.newPassword &&
                        typeof formik.errors.newPassword === 'string'
                          ? formik.errors.newPassword
                          : ''
                      }
                    />

                    <TextField
                      label="Xác nhận mật khẩu mới"
                      name="confirmNewPassword"
                      type="password"
                      fullWidth
                      value={formik.values.confirmNewPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.confirmNewPassword &&
                        Boolean(formik.errors.confirmNewPassword)
                      }
                      helperText={
                        formik.touched.confirmNewPassword &&
                        typeof formik.errors.confirmNewPassword === 'string'
                          ? formik.errors.confirmNewPassword
                          : ''
                      }
                    />
                  </>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button onClick={handleClose} variant="outlined">
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
                sx={{
                  background: 'linear-gradient(to right, #7F00FF, #E100FF)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #E100FF, #7F00FF)',
                  },
                }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                ) : null}
                {isEditMode ? 'Cập nhật' : 'Tạo'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default UserFormModal;

