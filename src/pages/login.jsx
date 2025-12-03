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

const Login = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // ⬅️ TAMBAHAN

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // mulai loading

    const fn = isRegister ? signUp : signIn;
    const { error } = await fn(email, password);

    if (error) setError(error.message);

    setLoading(false); // selesai loading
  };

  return (
    <div className="min-h-screen bg-[#F4F2EA] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#626F47] text-center mb-6">
          {isRegister ? "Buat Akun" : "Masuk ke Akun"}
        </h1>

        {error && (
          <p className="mb-3 text-red-500 text-sm text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-[#626F47]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 focus:outline-[#626F47]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-lg transition 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#626F47] hover:bg-[#4d5938]"}
            `}
          >
            {loading ? "Memproses..." : isRegister ? "Daftar" : "Masuk"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={signInWithGoogle}
            disabled={loading}
            className={`w-full border py-2 rounded-lg transition 
                ${loading ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}
            `}
          >
            {loading ? "Tunggu..." : "Lanjutkan dengan Google"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <button
            onClick={() => !loading && setIsRegister(!isRegister)}
            className="text-[#626F47] font-semibold"
            disabled={loading}
          >
            {isRegister ? "Masuk" : "Daftar"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
