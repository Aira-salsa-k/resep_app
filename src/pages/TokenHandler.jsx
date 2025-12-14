// TokenHandler.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const TokenHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const processToken = async () => {
      try {
        // Ambil hash dari URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        const error = params.get('error');

        console.log('🔑 Token Params:', { 
          hasToken: !!accessToken, 
          type, 
          error,
          hashLength: hash.length 
        });

        // Jika ada error di URL
        if (error) {
          console.error('❌ URL Error:', error);
          if (error === 'otp_expired') {
            navigate('/login', { 
              state: { 
                error: 'Link reset password sudah kedaluwarsa. Silakan minta link baru.' 
              } 
            });
          } else {
            navigate('/login', { state: { error: 'Token tidak valid.' } });
          }
          return;
        }

        // Jika ada access token (recovery atau magic link)
        if (accessToken && type === 'recovery') {
          console.log('🔄 Processing recovery token...');
          
          // Coba set session dengan token
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            navigate('/login', { 
              state: { 
                error: 'Token tidak valid atau sudah kadaluarsa.' 
              } 
            });
            return;
          }

          console.log('✅ Session set successfully');
          
          // Redirect ke reset-password dengan token di state
          navigate('/reset-password', {
            state: {
              token: accessToken,
              email: sessionData.user?.email
            }
          });
          return;
        }

        // Jika tidak ada token yang valid
        console.log('⚠️ No valid token found');
        navigate('/login');
        
      } catch (err) {
        console.error('❌ Token processing error:', err);
        setError('Terjadi kesalahan saat memproses token.');
        setTimeout(() => navigate('/login'), 3000);
      } finally {
        setProcessing(false);
      }
    };

    processToken();
  }, [navigate, location]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffd4fe]">
        <div className="text-center p-8">
          <div className="text-red-600 mb-4">❌</div>
          <p className="text-black">{error}</p>
          <p className="text-black/60 text-sm mt-2">Mengarahkan ke login...</p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffd4fe]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Memproses tautan...</p>
          <p className="text-black/60 text-sm mt-2">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  return null;
};

export default TokenHandler;