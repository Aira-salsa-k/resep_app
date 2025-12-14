import { useState } from 'react';
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }
    
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md border border-white/20">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#131313]/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-black" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-black text-center mb-2">
          Buat Password Baru
        </h1>
        <p className="text-black/60 text-sm text-center mb-8">
          Masukkan password baru Anda
        </p>
        
        {success ? (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-black">Password Berhasil Diubah!</h2>
            <p className="text-black/60">
              Anda akan diarahkan ke halaman login dalam 3 detik...
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-700 text-sm text-center">{error}</p>
              </div>
            )}
            
            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Key className="w-5 h-5 text-black/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password Baru"
                className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Key className="w-5 h-5 text-black/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                ${loading 
                  ? "bg-white/30 cursor-not-allowed" 
                  : "bg-[#131313] hover:bg-[#272727] shadow-lg"
                }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Reset Password</span>
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