// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../lib/supabaseClient';
// import { Key, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);

//   const handleResetPassword = async (e) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setError('Password tidak cocok');
//       return;
//     }
    
//     if (password.length < 6) {
//       setError('Password minimal 6 karakter');
//       return;
//     }
    
//     setError('');
//     setLoading(true);
    
//     try {
//       const { error } = await supabase.auth.updateUser({
//         password: password
//       });
      
//       if (error) throw error;
      
//       setSuccess(true);
//       setTimeout(() => {
//         navigate('/login');
//       }, 3000);
      
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
//       <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md border border-white/20">
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 rounded-full bg-[#131313]/10 flex items-center justify-center">
//             <Lock className="w-8 h-8 text-black" />
//           </div>
//         </div>
        
//         <h1 className="text-2xl font-bold text-black text-center mb-2">
//           Buat Password Baru
//         </h1>
//         <p className="text-black/60 text-sm text-center mb-8">
//           Masukkan password baru Anda
//         </p>
        
//         {success ? (
//           <div className="text-center space-y-4">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <h2 className="text-xl font-bold text-black">Password Berhasil Diubah!</h2>
//             <p className="text-black/60">
//               Anda akan diarahkan ke halaman login dalam 3 detik...
//             </p>
//           </div>
//         ) : (
//           <form onSubmit={handleResetPassword} className="space-y-5">
//             {error && (
//               <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
//                 <p className="text-red-700 text-sm text-center">{error}</p>
//               </div>
//             )}
            
//             {/* Password Field */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                 <Key className="w-5 h-5 text-black/70" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password Baru"
//                 className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition"
//                 onClick={() => setShowPassword(!showPassword)}
//                 disabled={loading}
//               >
//                 {showPassword ? (
//                   <EyeOff className="w-5 h-5" />
//                 ) : (
//                   <Eye className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
            
//             {/* Confirm Password Field */}
//             <div className="relative">
//               <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                 <Key className="w-5 h-5 text-black/70" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Konfirmasi Password"
//                 className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 disabled={loading}
//               />
//             </div>
            
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
//                 ${loading 
//                   ? "bg-white/30 cursor-not-allowed" 
//                   : "bg-[#131313] hover:bg-[#272727] shadow-lg"
//                 }`}
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Memproses...</span>
//                 </>
//               ) : (
//                 <>
//                   <Lock className="w-5 h-5" />
//                   <span>Reset Password</span>
//                 </>
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Key, Eye, EyeOff, Lock, CheckCircle, AlertTriangle } from 'lucide-react';

const ResetPassword = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [canReset, setCanReset] = useState(false);

  // 🔑 VALIDASI RESET SESSION DARI SUPABASE
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setCanReset(true);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!canReset) {
      setError('Link reset password tidak valid atau sudah kedaluwarsa.');
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
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Gagal mengubah password.');
    } finally {
      setLoading(false);
    }
  };

  // ❌ LINK EXPIRED / TIDAK VALID
  if (!canReset && !success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffd4fe] p-4">
        <div className="bg-white/20 backdrop-blur p-8 rounded-2xl max-w-md w-full text-center">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-600 mb-4" />
          <h1 className="text-xl font-bold text-black mb-2">
            Link Tidak Valid
          </h1>
          <p className="text-black/70 mb-6">
            Link reset password sudah kedaluwarsa atau sudah digunakan.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-black" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-black mb-2">
          Buat Password Baru
        </h1>
        <p className="text-black/60 text-sm text-center mb-6">
          Masukkan password baru untuk akun Anda
        </p>

        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle className="w-14 h-14 mx-auto text-green-600" />
            <h2 className="text-xl font-bold text-black">
              Password Berhasil Diubah
            </h2>
            <p className="text-black/60">
              Anda akan diarahkan ke halaman login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 text-red-700 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password Baru"
                className="w-full pl-11 pr-11 py-3 rounded-xl border focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm */}
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Password"
                className="w-full pl-11 pr-4 py-3 rounded-xl border focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-neutral-800 transition"
            >
              {loading ? 'Memproses...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
