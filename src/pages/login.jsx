// // import { useState } from 'react';
// // import { useAuth } from '../lib/authContext';

// // const Login = () => {
// //   const { signIn, signUp, signInWithGoogle } = useAuth();

// //   const [isRegister, setIsRegister] = useState(false);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');

// //     const fn = isRegister ? signUp : signIn;
// //     const { error } = await fn(email, password);

// //     if (error) setError(error.message);
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#F4F2EA] flex items-center justify-center px-4">
// //       <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
// //         <h1 className="text-2xl font-bold text-[#626F47] text-center mb-6">
// //           {isRegister ? "Buat Akun" : "Masuk ke Akun"}
// //         </h1>

// //         {error && (
// //           <p className="mb-3 text-red-500 text-sm text-center">{error}</p>
// //         )}

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <input
// //             type="email"
// //             placeholder="Email"
// //             className="w-full border rounded-lg px-4 py-2 focus:outline-[#626F47]"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //           />

// //           <input
// //             type="password"
// //             placeholder="Password"
// //             className="w-full border rounded-lg px-4 py-2 focus:outline-[#626F47]"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //           />

// //           <button
// //             type="submit"
// //             className="w-full bg-[#626F47] text-white py-2 rounded-lg hover:bg-[#4d5938] transition"
// //           >
// //             {isRegister ? "Daftar" : "Masuk"}
// //           </button>
// //         </form>

// //         <div className="mt-4">
// //           <button
// //             onClick={signInWithGoogle}
// //             className="w-full border py-2 rounded-lg hover:bg-gray-50"
// //           >
// //             Lanjutkan dengan Google
// //           </button>
// //         </div>

// //         <p className="mt-4 text-center text-sm">
// //           {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
// //           <button
// //             onClick={() => setIsRegister(!isRegister)}
// //             className="text-[#626F47] font-semibold"
// //           >
// //             {isRegister ? "Masuk" : "Daftar"}
// //           </button>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Login;
// import { useState } from 'react';
// import { useAuth } from '../lib/authContext';
// import { useNavigate } from "react-router-dom";
// import { User, Key, Eye, EyeOff, LogIn, UserPlus, Mail,CircleUserRound } from "lucide-react";



// const Login = () => {
//   const navigate = useNavigate();

//   const { signIn, signUp, signInWithGoogle } = useAuth();

//   const [isRegister, setIsRegister] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false); // ⬅️ TAMBAHAN
//    const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     const fn = isRegister ? signUp : signIn;
//     const { error } = await fn(email, password);

//     setLoading(false);

//     if (!error) {
//       // ⬅️ Jika sukses login langsung ke halaman utama
//       navigate("/");
//       return;
//     }

//     setError(error.message);
//   };

//   return (
    
//     <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
//       <div className=" p-8 rounded-3xl w-full max-w-sm ">
//         {/* Avatar Icon */}
//         <div className="flex justify-center mb-6">
//           <div className="w-20 h-20 rounded-full flex items-center justify-center">
//             <CircleUserRound className="w-20 h-20 text-black" strokeWidth={1.5} />
//           </div>
//         </div>

//         <h1 className="text-2xl font-bold text-black text-center mb-6">
//           {isRegister ? "Buat Akun Baru" : "Masuk ke Akun"}
//         </h1>

//         {error && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
//             <p className="text-black-100 text-sm text-center">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email Field */}
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//               <Mail className="w-5 h-5 text-black" />
//             </div>
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-4 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               disabled={loading}
//             />
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//               <Key className="w-5 h-5 text-black/70" />
//             </div>
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               disabled={loading}
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? (
//                 <EyeOff className="w-5 h-5" />
//               ) : (
//                 <Eye className="w-5 h-5" />
//               )}
//             </button>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
//               ${loading 
//                 ? "bg-white/30 cursor-not-allowed" 
//                 : "bg-[#131313] hover:bg-[#272727] shadow-lg"
//               }`}
//           >
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span>Memproses...</span>
//               </>
//             ) : isRegister ? (
//               <>
//                 <UserPlus className="w-5 h-5" />
//                 <span>Daftar Sekarang</span>
//               </>
//             ) : (
//               <>
//                 <LogIn className="w-5 h-5" />
//                 <span>Masuk ke Akun</span>
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-6 pt-6 border-t border-white/20">
//           <p className="text-center text-black/80 text-sm">
//             {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
//             <button
//               onClick={() => !loading && setIsRegister(!isRegister)}
//               className="text-black font-semibold hover:text-black-500 transition ml-1"
//               disabled={loading}
//             >
//               {isRegister ? "Masuk disini" : "Daftar sekarang"}
//             </button>
//           </p>
//         </div>

//       </div>
//     </div>

//   );
// };

// export default Login;
////////////////////////////
// import { useState } from 'react';
// import { useAuth } from '../lib/authContext';
// import { useNavigate } from "react-router-dom";
// import { 
//   User, Key, Eye, EyeOff, LogIn, UserPlus, Mail, 
//   CircleUserRound, Lock, AlertCircle, CheckCircle 
// } from "lucide-react";

// const Login = () => {
//   const navigate = useNavigate();
//   const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

//   const [isRegister, setIsRegister] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [resetEmailSent, setResetEmailSent] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     const fn = isRegister ? signUp : signIn;
//     const { error: authError } = await fn(email, password);

//     setLoading(false);

//     if (!authError) {
//       if (isRegister) {
//         setSuccessMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi akun sebelum login.');
//         setEmail('');
//         setPassword('');
//         setIsRegister(false);
//         return;
//       }
//       navigate("/");
//       return;
//     }

//     setError(authError.message);
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       setError('Silakan masukkan email terlebih dahulu');
//       return;
//     }

//     setError('');
//     setSuccessMessage('');
//     setLoading(true);

//     const { error: resetError } = await resetPassword(email);
    
//     setLoading(false);
    
//     if (resetError) {
//       setError(resetError.message);
//     } else {
//       setResetEmailSent(true);
//       setSuccessMessage(`Email reset password telah dikirim ke ${email}. Silakan cek inbox atau spam folder Anda.`);
//     }
//   };

//   const handleForgotPasswordClick = () => {
//     if (!email) {
//       setError('Silakan masukkan email Anda terlebih dahulu');
//       return;
//     }
//     setShowForgotPassword(true);
//   };

//   return (
//     <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
//       <div className="p-8 rounded-3xl w-full max-w-sm">
//         {/* Avatar Icon */}
//         <div className="flex justify-center mb-6">
//           <div className="w-20 h-20 rounded-full flex items-center justify-center">
//             <CircleUserRound className="w-20 h-20 text-black" strokeWidth={1.5} />
//           </div>
//         </div>

//         <h1 className="text-2xl font-bold text-black text-center mb-2">
//           {showForgotPassword ? "Reset Password" : isRegister ? "Buat Akun Baru" : "Masuk ke Akun"}
//         </h1>
        
//         <p className="text-black/60 text-sm text-center mb-6">
//           {showForgotPassword 
//             ? "Masukkan email Anda untuk menerima link reset password"
//             : isRegister 
//               ? "Daftar untuk mulai menggunakan aplikasi"
//               : "Masuk untuk melanjutkan ke dashboard"}
//         </p>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
//               <p className="text-green-700 text-sm">{successMessage}</p>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
//             <div className="flex items-center gap-2">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
//               <p className="text-red-700 text-sm">{error}</p>
//             </div>
//           </div>
//         )}

//         {!showForgotPassword ? (
//           <>
//             {/* Login/Register Form */}
//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Email Field */}
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <Mail className="w-5 h-5 text-black" />
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-4 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={loading}
//                 />
//               </div>

//               {/* Password Field */}
//               {!isRegister && (
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <Key className="w-5 h-5 text-black/70" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               )}

//               {/* Forgot Password Link */}
//               {!isRegister && (
//                 <div className="text-right">
//                   <button
//                     type="button"
//                     onClick={handleForgotPasswordClick}
//                     className="text-sm text-black/70 hover:text-black transition hover:underline"
//                     disabled={loading}
//                   >
//                     Lupa password?
//                   </button>
//                 </div>
//               )}

//               {/* Register Password Field */}
//               {isRegister && (
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <Lock className="w-5 h-5 text-black/70" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password (minimal 6 karakter)"
//                     className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-12 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     disabled={loading}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/70 hover:text-black transition"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={loading}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               )}

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
//                   ${loading 
//                     ? "bg-white/30 cursor-not-allowed" 
//                     : "bg-[#131313] hover:bg-[#272727] shadow-lg"
//                   }`}
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Memproses...</span>
//                   </>
//                 ) : isRegister ? (
//                   <>
//                     <UserPlus className="w-5 h-5" />
//                     <span>Daftar Sekarang</span>
//                   </>
//                 ) : (
//                   <>
//                     <LogIn className="w-5 h-5" />
//                     <span>Masuk ke Akun</span>
//                   </>
//                 )}
//               </button>
//             </form>

//             {/* Divider */}
//             {/* <div className="my-6 flex items-center">
//               <div className="flex-1 h-px bg-white/30"></div>
//               <span className="px-4 text-black/60 text-sm">atau</span>
//               <div className="flex-1 h-px bg-white/30"></div>
//             </div> */}

//             {/* Google Sign In */}
//             {/* <button
//               onClick={signInWithGoogle}
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-3 bg-white border border-white/30 text-black py-3 rounded-xl hover:bg-white/90 transition disabled:opacity-50"
//             >
//               <img 
//                 src="https://www.google.com/favicon.ico" 
//                 alt="Google" 
//                 className="w-5 h-5"
//               />
//               <span>Lanjutkan dengan Google</span>
//             </button> */}

//             {/* Toggle Register/Login */}
//             <div className="mt-6 pt-6 border-t border-white/20">
//               <p className="text-center text-black/80 text-sm">
//                 {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
//                 <button
//                   onClick={() => !loading && setIsRegister(!isRegister)}
//                   className="text-black font-semibold hover:text-black/80 transition ml-1"
//                   disabled={loading}
//                 >
//                   {isRegister ? "Masuk disini" : "Daftar sekarang"}
//                 </button>
//               </p>
//             </div>
//           </>
//         ) : (
//           <>
//             {/* Forgot Password Form */}
//             <div className="space-y-5">
//               <div className="relative">
//                 <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                   <Mail className="w-5 h-5 text-black" />
//                 </div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-4 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   disabled={loading}
//                 />
//               </div>

//               <button
//                 onClick={handleForgotPassword}
//                 disabled={loading}
//                 className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
//                   ${loading 
//                     ? "bg-white/30 cursor-not-allowed" 
//                     : "bg-[#131313] hover:bg-[#272727] shadow-lg"
//                   }`}
//               >
//                 {loading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     <span>Mengirim email...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Mail className="w-5 h-5" />
//                     <span>Kirim Link Reset Password</span>
//                   </>
//                 )}
//               </button>

//               <button
//                 onClick={() => setShowForgotPassword(false)}
//                 disabled={loading}
//                 className="w-full text-center text-black/70 hover:text-black transition py-2 text-sm"
//               >
//                 ← Kembali ke login
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;


import { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { useNavigate } from "react-router-dom";

import { 
  User, Key, Eye, EyeOff, LogIn, UserPlus, Mail, 
  CircleUserRound, Lock, AlertCircle, CheckCircle, ArrowLeft
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const fn = isRegister ? signUp : signIn;
    const { error: authError } = await fn(email, password);

    setLoading(false);

    if (!authError) {
      if (isRegister) {
        setSuccessMessage('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi akun sebelum login.');
        setEmail('');
        setPassword('');
        setIsRegister(false);
        return;
      }
      navigate("/");
      return;
    }

    setError(authError.message);
  };

  // Function untuk handle forgot password
  const handleForgotPasswordClick = () => {
    setError(''); // Reset error
    setSuccessMessage(''); // Reset success message
    setShowForgotPassword(true); // Langsung tampilkan form forgot password
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Silakan masukkan email terlebih dahulu');
      return;
    }

    setError('');
    setSuccessMessage('');
    setLoading(true);

    const { error: resetError } = await resetPassword(email);
    
    setLoading(false);
    
    if (resetError) {
      setError(resetError.message);
    } else {
      setResetEmailSent(true);
      setSuccessMessage(`Email reset password telah dikirim ke ${email}. Silakan cek inbox atau spam folder Anda.`);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetEmailSent(false);
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className="p-8 rounded-3xl w-full max-w-sm">
        {/* Back Button untuk forgot password */}
    

        {/* Avatar Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center">
            <CircleUserRound className="w-20 h-20 text-black" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-black text-center mb-2">
          {showForgotPassword 
            ? resetEmailSent 
              ? "Email Terkirim!" 
              : "Reset Password" 
            : isRegister 
              ? "Buat Akun Baru" 
              : "Masuk ke Akun"}
        </h1>
        
        <p className="text-black/60 text-sm text-center mb-6">
          {showForgotPassword 
            ? resetEmailSent
              ? "Silakan cek email Anda untuk melanjutkan"
              : "Kami akan mengirim link reset password ke email Anda"
            : isRegister 
              ? "Daftar untuk mulai menggunakan aplikasi"
              : "Masuk untuk melanjutkan ke dashboard"}
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* TAMPILAN FORGOT PASSWORD */}
        {showForgotPassword ? (
          resetEmailSent ? (
            // Tampilan setelah email reset dikirim
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-black/80 mb-6">
                  Kami telah mengirim link reset password ke:<br />
                  <span className="font-semibold text-black">{email}</span>
                </p>
                <p className="text-sm text-black/60 mb-2">
                  Periksa inbox email Anda dan ikuti instruksi untuk membuat password baru.
                </p>
                <p className="text-sm text-black/60">
                  Tidak menerima email? Cek folder spam atau 
                  <button
                    onClick={() => setResetEmailSent(false)}
                    className="text-black font-semibold ml-1 hover:underline"
                  >
                    kirim ulang
                  </button>
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center gap-2 text-black border border-black/20 py-3 rounded-xl hover:bg-black/5 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Kembali ke Login
                </button>
              </div>
            </div>
          ) : (
            // Form Forgot Password
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="w-full bg-white border border-white/30 rounded-xl pl-12 pr-4 py-3 text-black placeholder-black/60 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading || !email}
                className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                  ${loading || !email
                    ? "bg-black/30 cursor-not-allowed" 
                    : "bg-[#131313] hover:bg-[#272727] shadow-lg"
                  }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Kirim Link Reset Password</span>
                  </>
                )}
              </button>

                  {showForgotPassword && !resetEmailSent && (
                <button
                  onClick={handleBackToLogin}
                  className="mb-4 flex items-center gap-2 text-black/70 hover:text-black transition text-sm"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke login
                </button>
        )}
            </div>



          )
        ) : (
          // TAMPILAN LOGIN/REGISTER (DEFAULT)
          <>
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
              {!isRegister && (
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
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              )}

              {/* Forgot Password Link - TAMPIL HANYA DI LOGIN */}
              {!isRegister && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-sm text-black/70 hover:text-black transition hover:underline"
                    disabled={loading}
                  >
                    Lupa password?
                  </button>
                </div>
              )}

              {/* Register Password Field */}
              {isRegister && (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-black/70" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password (minimal 6 karakter)"
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
              )}

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

            {/* Divider - Hanya tampil di mode login/register, bukan forgot password */}
            {/* <div className="my-6 flex items-center">
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="px-4 text-black/60 text-sm">atau</span>
              <div className="flex-1 h-px bg-white/30"></div>
            </div> */}

            {/* Google Sign In - Hanya di login/register */}
            {/* <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-white/30 text-black py-3 rounded-xl hover:bg-white/90 transition disabled:opacity-50"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span>Lanjutkan dengan Google</span>
            </button> */}

            {/* Toggle Register/Login - Hanya di login/register */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-center text-black/80 text-sm">
                {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
                <button
                  onClick={() => !loading && setIsRegister(!isRegister)}
                  className="text-black font-semibold hover:text-black/80 transition ml-1"
                  disabled={loading}
                >
                  {isRegister ? "Masuk disini" : "Daftar sekarang"}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;