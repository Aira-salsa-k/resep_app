// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { AuthProvider } from './lib/authContext.jsx'

// // createRoot(document.getElementById('root')).render(
// //   <StrictMode>
// //     <App />
// //   </StrictMode>,
// // )

// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import './index.css';
// import App from './App.jsx';
// import { AuthProvider } from './lib/authContext.jsx';

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// );

// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import Login from './pages/login.jsx'
// import { AuthProvider } from './lib/authContext.jsx'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import ResetPassword from './pages/ResetPassword.jsx';
// import AuthCallback from './pages/AuthCallback.jsx';

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/login" element={<Login />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//             <Route path="/auth/callback" element={<AuthCallback />} />

//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   </React.StrictMode>
// )

// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import Login from './pages/login.jsx'
// import { AuthProvider } from './lib/authContext.jsx'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import ResetPassword from './pages/ResetPassword.jsx';
// import TokenHandler from './pages/TokenHandler.jsx';

// createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/auth/callback" element={<TokenHandler />} />
//           <Route path="/auth/verify" element={<TokenHandler />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   </React.StrictMode>
// )

import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './pages/login.jsx'
import { AuthProvider } from './lib/authContext.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword.jsx'
import AuthCallback from './pages/AuthCallback.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* ✅ INI YANG PENTING: handler untuk auth callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* ✅ Alternatif routes untuk kompatibilitas */}
          <Route path="/auth/verify" element={<AuthCallback />} />
          <Route path="/auth/confirm" element={<AuthCallback />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)