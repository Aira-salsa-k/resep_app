import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Key, Eye, EyeOff, Lock, CheckCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Fungsi untuk parse hash dari URL
  const parseHashParams = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    return {
      accessToken: params.get('access_token'),
      refreshToken: params.get('refresh_token'),
      type: params.get('type'),
      error: params.get('error'),
      errorCode: params.get('error_code'),
      errorDesc: params.get('error_description')
    };
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const { accessToken, refreshToken, type, error, errorCode } = parseHashParams();
        
        console.log('🔍 URL Parameters:', { 
          hasToken: !!accessToken, 
          type, 
          error, 
          errorCode 
        });
        
        // 🚨 CEK 1: Jika ada error di URL
        if (error === 'access_denied' && errorCode === 'otp_expired') {
          setError('Link reset password sudah kedaluwarsa atau tidak valid. Silakan request link baru.');
          setCanReset(false);
          setIsChecking(false);
          
          // Bersihkan URL hash
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }
        
        // 🟢 CEK 2: Jika ada token recovery di URL
        if (accessToken && type === 'recovery') {
          console.log('🔄 Menemukan token recovery, mengatur session...');
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });
          
          if (sessionError) {
            console.error('❌ Gagal mengatur session:', sessionError);
            setError('Token tidak valid. Silakan minta link baru.');
            setCanReset(false);
          } else {
            console.log('✅ Session berhasil diatur');
            setCanReset(true);
          }
          
          setIsChecking(false);
          return;
        }
        
        // 🔵 CEK 3: Cek session yang sudah ada
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Session aktif ditemukan');
          setCanReset(true);
        } else {
          console.log('❌ Tidak ada session aktif');
          setError('Link reset password tidak valid. Silakan minta link baru.');
          setCanReset(false);
        }
        
        setIsChecking(false);
        
      } catch (err) {
        console.error('❌ Error saat inisialisasi:', err);
        setError('Terjadi kesalahan. Silakan coba lagi.');
        setCanReset(false);
        setIsChecking(false);
      }
    };

    initialize();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY') {
        setCanReset(true);
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!canReset) {
      setError('Anda tidak dapat mereset password. Silakan minta link baru.');
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
      
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password berhasil diubah! Silakan login.' } 
        });
      }, 3000);
      
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.message || 'Gagal mengubah password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/login', { 
      state: { 
        showForgotPassword: true,
        message: 'Silakan masukkan email untuk mendapatkan link reset baru.'
      }
    });
  };

  // Tampilan loading
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Memverifikasi tautan...</p>
        </div>
      </div>
    );
  }

  // Tampilan error (link expired)
  if (!canReset && !success) {
    return (
      <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur p-8 rounded-2xl max-w-md w-full border border-white/30">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-600 mb-4" />
            <h1 className="text-2xl font-bold text-black mb-3">Link Tidak Valid</h1>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-black/80">{error}</p>
              <p className="text-black/60 text-sm mt-2">
                Link reset password hanya berlaku untuk waktu terbatas.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRequestNewLink}
                className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-black/80 transition"
              >
                <RefreshCw className="w-5 h-5" />
                Minta Link Baru
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full border border-black/20 text-black py-3 rounded-xl hover:bg-black/5 transition"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan form reset password
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