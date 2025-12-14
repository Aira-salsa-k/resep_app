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

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';


const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          
        },
      });

      if (error) throw error;
      
      // Email verifikasi dikirim otomatis
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

const resetPassword = async (email) => {
  try {
    // Pastikan menggunakan origin yang benar
    const origin = window.location.origin;
    const redirectUrl = `${origin}/auth/callback`;
    
    console.log('🔐 Requesting reset password for:', email);
    console.log('🔗 Redirect URL:', redirectUrl);
    console.log('🏠 Origin:', origin);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email, 
      {
        redirectTo: redirectUrl,
        // Tambahkan captcha token jika diperlukan
        // captchaToken: 'optional-captcha-token'
      }
    );

    if (error) {
      console.error('❌ Reset password error:', error);
      
      // Tangani error spesifik
      if (error.message.includes('rate limit')) {
        throw new Error('Terlalu banyak permintaan. Coba lagi nanti.');
      }
      if (error.message.includes('email not found')) {
        throw new Error('Email tidak terdaftar.');
      }
      
      throw error;
    }
    
    console.log('✅ Reset password email sent successfully');
    
    // Return informasi tambahan
    return { 
      data: { 
        ...data,
        message: 'Email reset password telah dikirim. Cek inbox atau spam folder Anda.',
        emailSent: true
      }, 
      error: null 
    };
  } catch (error) {
    console.error('❌ Reset password catch error:', error);
    return { 
      data: null, 
      error: {
        message: error.message,
        userFriendly: error.message.includes('rate limit') 
          ? 'Terlalu banyak permintaan. Coba lagi dalam beberapa menit.'
          : 'Gagal mengirim email reset. Pastikan email benar dan coba lagi.'
      }
    };
  }
};

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};