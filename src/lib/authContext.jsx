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
    // Gunakan URL yang benar - langsung ke reset-password
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    console.log('🔐 Requesting reset password for:', email);
    console.log('🔗 Redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      email, 
      {
        redirectTo: redirectUrl,
      }
    );

    if (error) {
      console.error('❌ Reset password error:', error);
      throw error;
    }
    
    console.log('✅ Reset password email sent');
    return { data, error: null };
  } catch (error) {
    console.error('❌ Reset password catch error:', error);
    return { data: null, error };
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