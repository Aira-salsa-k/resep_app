import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Key, Eye, EyeOff, Lock, CheckCircle, AlertTriangle, ArrowLeft, Mail } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Cek session yang aktif
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }

        if (session?.user) {
          setEmail(session.user.email || '');
          setHasValidSession(true);
          console.log('✅ Valid session found for:', session.user.email);
        } else {
          // Coba ambil dari location state
          const token = location.state?.token;
          const stateEmail = location.state?.email;
          
          if (stateEmail) {
            setEmail(stateEmail);
          }
          
          if (token) {
            console.log('🔑 Token from state:', token.substring(0, 20) + '...');
          }
          
          // Jika tidak ada session, tapi ada di state, tetap izinkan
          if (token || stateEmail) {
            setHasValidSession(true);
          } else {
            console.log('❌ No valid session or token');
            setError('Sesi tidak valid. Silakan minta link reset password baru.');
          }
        }
      } catch (err) {
        console.error('Check session error:', err);
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        if (session?.user) {
          setEmail(session.user.email || '');
          setHasValidSession(true);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!hasValidSession) {
      setError('Sesi tidak valid. Silakan minta link reset password baru.');
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
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        console.error('Update password error:', updateError);
        
        if (updateError.message.includes('expired') || 
            updateError.message.includes('invalid') || 
            updateError.message.includes('session')) {
          setError('Sesi telah berakhir. Silakan minta link reset password baru.');
          setHasValidSession(false);
        } else {
          throw updateError;
        }
        return;
      }

      console.log('✅ Password updated successfully');
      setSuccess(true);
      
      // Tampilkan pesan sukses selama 3 detik, lalu redirect
      setTimeout(() => {
        supabase.auth.signOut().then(() => {
          navigate('/login', {
            state: {
              message: 'Password berhasil diubah! Silakan login dengan password baru.',
              prefillEmail: email
            }
          });
        });
      }, 3000);

    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Gagal mengubah password. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const requestNewLink = () => {
    navigate('/login', {
      state: {
        prefillEmail: email,
        showForgotPassword: true,
        error: 'Link reset password tidak valid. Silakan request link baru.'
      }
    });
  };

  // Jika tidak ada session valid dan bukan success state
  if (!hasValidSession && !success && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffd4fe] p-4">
        <div className="bg-white/20 backdrop-blur p-8 rounded-2xl max-w-md w-full text-center border border-white/30">
          <button
            onClick={() => navigate('/login')}
            className="mb-6 flex items-center gap-2 text-black/70 hover:text-black transition mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </button>
          
          <AlertTriangle className="w-16 h-16 mx-auto text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-black mb-3">
            Tidak Dapat Reset Password
          </h1>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-black/80 mb-2">
              {error || 'Link reset password tidak valid atau sudah kedaluwarsa.'}
            </p>
            <p className="text-black/60 text-sm">
              Link hanya berlaku untuk waktu terbatas dan hanya bisa digunakan sekali.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={requestNewLink}
              className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-black/80 transition"
            >
              <Mail className="w-5 h-5" />
              <span>Minta Link Reset Baru</span>
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full border border-black/20 text-black px-6 py-3 rounded-xl hover:bg-black/5 transition"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md border border-white/30">
        {!success && (
          <button
            onClick={() => navigate('/login')}
            className="mb-4 flex items-center gap-2 text-black/70 hover:text-black transition text-sm"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </button>
        )}

        <div className="flex justify-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            success ? 'bg-green-500/20' : 'bg-black/10'
          }`}>
            {success ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Lock className="w-8 h-8 text-black" />
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-black mb-2">
          {success ? 'Password Berhasil Diubah!' : 'Buat Password Baru'}
        </h1>
        
        {email && !success && (
          <p className="text-center text-black/60 text-sm mb-2">
            Untuk akun: <span className="font-semibold text-black">{email}</span>
          </p>
        )}
        
        <p className="text-black/60 text-sm text-center mb-6">
          {success 
            ? 'Anda akan diarahkan ke halaman login...'
            : 'Masukkan password baru Anda'
          }
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-black/70">
              Password Anda telah berhasil diperbarui.
            </p>
            <p className="text-black/60 text-sm">
              Silakan login dengan password baru Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {error && (
              <div className="bg-red-500/20 text-red-700 p-3 rounded-xl text-sm text-center border border-red-500/30">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-black/70 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white border border-white/30 rounded-xl pl-11 pr-11 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 hover:text-black transition"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-black/70 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ketik ulang password baru"
                    className="w-full bg-white border border-white/30 rounded-xl pl-11 pr-4 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300
                ${loading 
                  ? "bg-black/30 cursor-not-allowed" 
                  : "bg-black hover:bg-black/80 shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan Password...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Simpan Password Baru</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;