import { useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../user-service';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newPassword) { toast.error('Vui lòng điền đủ thông tin'); return; }
    if (newPassword.length < 6) { toast.error('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    if (newPassword !== confirm) { toast.error('Mật khẩu xác nhận không khớp'); return; }
    setLoading(true);
    try {
      const res = await resetPassword(token.trim(), newPassword);
      if (res.status === 200) {
        toast.success('Đặt lại mật khẩu thành công!');
        navigate('/login');
      } else {
        toast.error(res.message || 'Token không hợp lệ hoặc đã hết hạn');
      }
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Đặt lại mật khẩu</h1>
          <p className="text-sm text-gray-500 mt-1">Nhập token từ email và mật khẩu mới</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Token xác nhận" fullWidth value={token}
            onChange={e => setToken(e.target.value)} required
            helperText="Kiểm tra email để lấy token" />
          <TextField label="Mật khẩu mới" type="password" fullWidth value={newPassword}
            onChange={e => setNewPassword(e.target.value)} required />
          <TextField label="Xác nhận mật khẩu mới" type="password" fullWidth value={confirm}
            onChange={e => setConfirm(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth disabled={loading}
            sx={{ py: 1.5, fontWeight: 'bold', background: 'linear-gradient(to right, #7F00FF, #E100FF)', color: '#fff', '&:hover': { background: 'linear-gradient(to right, #E100FF, #7F00FF)' } }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đặt lại mật khẩu'}
          </Button>
          <p className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">← Quay lại đăng nhập</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
