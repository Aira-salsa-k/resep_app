// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from './supabaseClient';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check active session
//     const checkSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setUser(session?.user || null);
//       setLoading(false);

//       // Listen for auth changes
//       const { data: { subscription } } = await supabase.auth.onAuthStateChange(
//         (_event, session) => {
//           setUser(session?.user || null);
//           setLoading(false);
//         }
//       );

//       return () => {
//         subscription.unsubscribe();
//       };
//     };

//     checkSession();
//   }, []);

//   const signUp = async (email, password) => {
//     return await supabase.auth.signUp({ email, password });
//   };

//   const signIn = async (email, password) => {
//     return await supabase.auth.signInWithPassword({ email, password });
//   };

//   const signInWithGoogle = async () => {
//     return await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         redirectTo: window.location.origin
//       }
//     });
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     setUser(null);
//   };

//   const value = {
//     user,
//     signUp,
//     signIn,
//     signInWithGoogle,
//     signOut,
//     loading
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
////////////////////////
// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from './supabaseClient';


// const AuthContext = createContext({});

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check active sessions
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   const signUp = async (email, password) => {
//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/auth/callback`,
          
//         },
//       });

//       if (error) throw error;
      
//       // Email verifikasi dikirim otomatis
//       return { data, error: null };
//     } catch (error) {
//       return { data: null, error };
//     }
//   };

//   const signIn = async (email, password) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;
//       return { data, error: null };
//     } catch (error) {
//       return { data: null, error };
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       const { data, error } = await supabase.auth.signInWithOAuth({
//         provider: 'google',
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//         },
//       });

//       if (error) throw error;
//       return { data, error: null };
//     } catch (error) {
//       return { data: null, error };
//     }
//   };

//   const resetPassword = async (email) => {
//     try {
//       const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });

//       if (error) throw error;
//       return { data, error: null };
//     } catch (error) {
//       return { data: null, error };
//     }
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//   };

//   const value = {
//     user,
//     loading,
//     signUp,
//     signIn,
//     signInWithGoogle,
//     resetPassword,
//     signOut,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

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
