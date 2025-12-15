// AuthCallback.jsx - VERSI SIMPLE 100%
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse hash dari URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        const error = params.get('error');

        console.log('🔄 AuthCallback:', { type, error });

        // 🚨 CASE 1: Token expired
        if (error === 'access_denied') {
          console.log('❌ Token expired');
          navigate('/login', { 
            state: { error: 'Link sudah kadaluarsa. Silakan minta link baru.' }
          });
          return;
        }

        // 🟢 CASE 2: Reset Password
        if (accessToken && type === 'recovery') {
          console.log('🔄 Setting recovery session...');
          
          // SET SESSION SATU-SATUNYA DI SINI!
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            navigate('/login', { state: { error: 'Token tidak valid.' } });
            return;
          }

          // Redirect ke reset-password TANPA token di URL
          navigate('/reset-password');
          return;
        }

        // 🔵 CASE 3: Email Verification (Signup)
        if (accessToken && (type === 'signup' || type === 'email')) {
          console.log('🔄 Setting signup session...');
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            navigate('/login', { state: { error: 'Link verifikasi tidak valid.' } });
            return;
          }

          // Redirect ke dashboard
          navigate('/');
          return;
        }

        // ⚠️ Default: back to login
        navigate('/login');

      } catch (err) {
        console.error('AuthCallback error:', err);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-black text-sm">Memproses...</p>
      </div>
    </div>
  );
};

export default AuthCallback;