import { Button, CircularProgress, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../user-service';

const Schema = Yup.object({
  name: Yup.string().required('Vui lòng nhập họ tên'),
  email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  username: Yup.string().min(3, 'Tối thiểu 3 ký tự').required('Vui lòng nhập tên đăng nhập'),
  password: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Tạo tài khoản</h1>
          <p className="text-sm text-gray-500 mt-1">Học tiếng Anh cùng EnglishPro</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', username: '', password: '', confirmPassword: '' }}
          validationSchema={Schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await register({
                name: values.name,
                email: values.email,
                username: values.username,
                password: values.password,
              });
              if (res.status === 200) {
                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login');
              } else {
                toast.error(res.message || 'Đăng ký thất bại');
              }
            } catch {
              toast.error('Đăng ký thất bại. Vui lòng thử lại.');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {formik => (
            <Form className="flex flex-col gap-4">
              <TextField label="Họ và tên" name="name" fullWidth
                value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name} />
              <TextField label="Email" name="email" fullWidth
                value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email} />
              <TextField label="Tên đăng nhập" name="username" fullWidth
                value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username} />
              <TextField label="Mật khẩu" name="password" type="password" fullWidth
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password} />
              <TextField label="Xác nhận mật khẩu" name="confirmPassword" type="password" fullWidth
                value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} />
              <Button type="submit" variant="contained" fullWidth disabled={formik.isSubmitting}
                sx={{ py: 1.5, fontWeight: 'bold', background: 'linear-gradient(to right, #7F00FF, #E100FF)', color: '#fff', '&:hover': { background: 'linear-gradient(to right, #E100FF, #7F00FF)' } }}>
                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Đăng ký'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Đăng nhập</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
