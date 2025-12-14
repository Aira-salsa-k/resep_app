// import { useEffect } from 'react';
// import { supabase } from '../lib/supabaseClient';
// import { useNavigate } from 'react-router-dom';

// const AuthCallback = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     supabase.auth.getSession().then(() => {
//       navigate('/');
//     });
//   }, []);

//   return <p>Memproses login...</p>;
// };

// export default AuthCallback;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        // Redirect to home page after successful authentication
        navigate('/');
      } else if (event === 'PASSWORD_RECOVERY') {
        // User clicked password reset link
        navigate('/reset-password');
      }
    });

    // Get the session from URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      } else {
        // If no session, check for error in URL
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const error = urlParams.get('error');
        
        if (error) {
          console.error('Auth error:', error);
          navigate('/login');
        } else {
          // Try to get session again
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffd4fe]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-black">Memproses autentikasi...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
