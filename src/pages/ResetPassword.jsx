// ResetPassword.jsx - HANYA cek session & update password
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Key, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // 🎯 SANGAT SIMPLE: Cek session aja
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        console.log('✅ User session found');
        setHasSession(true);
      } else {
        console.log('❌ No session, redirecting to login');
        navigate('/login', { 
          state: { error: 'Sesi tidak valid. Silakan minta link reset baru.' }
        });
      }
    });
  }, [navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!hasSession) {
      setError('Sesi tidak valid.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) throw updateError;

      setSuccess(true);
      
      // Logout setelah reset
      setTimeout(() => {
        supabase.auth.signOut().then(() => {
          navigate('/', { 
            state: { message: 'Password berhasil diubah! Silakan login.' } 
          });
        });
      }, 2000);
      
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.message || 'Gagal mengubah password.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasSession) {
    return null; // Akan redirect di useEffect
  }

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur p-8 rounded-2xl max-w-md w-full border border-white/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-black/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2">
            {success ? 'Berhasil!' : 'Buat Password Baru'}
          </h1>
          <p className="text-black/60">
            {success ? 'Password telah diubah.' : 'Masukkan password baru Anda.'}
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-black/80 mb-6">
              Anda akan diarahkan ke halaman login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 text-red-700 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password baru"
                className="w-full bg-white border border-white/30 rounded-xl pl-11 pr-11 py-3 text-black placeholder-black/60 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Konfirmasi password"
                className="w-full bg-white border border-white/30 rounded-xl pl-11 pr-4 py-3 text-black placeholder-black/60 focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-black/80 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;