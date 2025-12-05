// import { useState } from 'react';
// import { useAuth } from '../lib/authContext';

// const Login = () => {
//   const { signIn, signUp, signInWithGoogle } = useAuth();

//   const [isRegister, setIsRegister] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     const fn = isRegister ? signUp : signIn;
//     const { error } = await fn(email, password);

//     if (error) setError(error.message);
//   };

//   return (
//     <div className="min-h-screen bg-[#F4F2EA] flex items-center justify-center px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
//         <h1 className="text-2xl font-bold text-[#626F47] text-center mb-6">
//           {isRegister ? "Buat Akun" : "Masuk ke Akun"}
//         </h1>

//         {error && (
//           <p className="mb-3 text-red-500 text-sm text-center">{error}</p>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full border rounded-lg px-4 py-2 focus:outline-[#626F47]"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full border rounded-lg px-4 py-2 focus:outline-[#626F47]"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button
//             type="submit"
//             className="w-full bg-[#626F47] text-white py-2 rounded-lg hover:bg-[#4d5938] transition"
//           >
//             {isRegister ? "Daftar" : "Masuk"}
//           </button>
//         </form>

//         <div className="mt-4">
//           <button
//             onClick={signInWithGoogle}
//             className="w-full border py-2 rounded-lg hover:bg-gray-50"
//           >
//             Lanjutkan dengan Google
//           </button>
//         </div>

//         <p className="mt-4 text-center text-sm">
//           {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
//           <button
//             onClick={() => setIsRegister(!isRegister)}
//             className="text-[#626F47] font-semibold"
//           >
//             {isRegister ? "Masuk" : "Daftar"}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { useNavigate } from "react-router-dom";
import { User, Key, Eye, EyeOff, LogIn, UserPlus, Mail,CircleUserRound } from "lucide-react";



const Login = () => {
  const navigate = useNavigate();

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ⬅️ TAMBAHAN
   const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fn = isRegister ? signUp : signIn;
    const { error } = await fn(email, password);

    setLoading(false);

    if (!error) {
      // ⬅️ Jika sukses login langsung ke halaman utama
      navigate("/");
      return;
    }

    setError(error.message);
  };

  return (
    
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className=" p-8 rounded-3xl w-full max-w-sm ">
        {/* Avatar Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center">
            <CircleUserRound className="w-20 h-20 text-black" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-black text-center mb-6">
          {isRegister ? "Buat Akun Baru" : "Masuk ke Akun"}
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-black-100 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Mail className="w-5 h-5 text-black" />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-4 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Key className="w-5 h-5 text-black/70" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Submit Button */}
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
            ) : isRegister ? (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Daftar Sekarang</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Masuk ke Akun</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-center text-black/80 text-sm">
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
            <button
              onClick={() => !loading && setIsRegister(!isRegister)}
              className="text-black font-semibold hover:text-black-500 transition ml-1"
              disabled={loading}
            >
              {isRegister ? "Masuk disini" : "Daftar sekarang"}
            </button>
          </p>
        </div>
      </div>
    </div>

  );
};

export default Login;
