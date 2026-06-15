import { useState } from 'react';
import { Button, CircularProgress, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../user-service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Vui lòng nhập email'); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl border border-gray-200">
        {sent ? (
          <div className="text-center space-y-4">
            <div className="text-5xl">📧</div>
            <h2 className="text-2xl font-bold text-gray-800">Kiểm tra email</h2>
            <p className="text-gray-500 text-sm">
              Nếu email <strong>{email}</strong> tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
            </p>
            <p className="text-gray-400 text-xs">Không nhận được? Kiểm tra thư mục spam hoặc thử lại.</p>
            <Link to="/reset-password" className="block text-indigo-600 font-semibold text-sm hover:underline">
              Nhập token đặt lại mật khẩu →
            </Link>
            <Link to="/login" className="block text-gray-400 text-sm hover:underline">← Quay lại đăng nhập</Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Quên mật khẩu</h1>
              <p className="text-sm text-gray-500 mt-1">Nhập email để nhận link đặt lại mật khẩu</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TextField label="Email" type="email" fullWidth value={email}
                onChange={e => setEmail(e.target.value)} required />
              <Button type="submit" variant="contained" fullWidth disabled={loading}
                sx={{ py: 1.5, fontWeight: 'bold', background: 'linear-gradient(to right, #7F00FF, #E100FF)', color: '#fff', '&:hover': { background: 'linear-gradient(to right, #E100FF, #7F00FF)' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Gửi hướng dẫn'}
              </Button>
              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">← Quay lại đăng nhập</Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
