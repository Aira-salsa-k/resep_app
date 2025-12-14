import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse hash dari URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        const error = params.get('error');
        const errorCode = params.get('error_code');

        console.log('🔍 Auth Callback Params:', { 
          type, 
          hasToken: !!accessToken,
          error,
          errorCode 
        });

        // 🚨 CASE 1: Ada error di URL (link expired)
        if (error === 'access_denied' && errorCode === 'otp_expired') {
          console.log('❌ Link expired detected');
          setStatus('error');
          setMessage('Link reset password sudah kadaluarsa. Silakan minta link baru.');
          
          // Redirect ke reset-password dengan pesan error
          setTimeout(() => {
            navigate('/reset-password', {
              state: { 
                error: 'Link reset password sudah kadaluarsa.',
                showNewLinkButton: true 
              }
            });
          }, 1500);
          return;
        }

        // 🟢 CASE 2: Token recovery valid
        if (accessToken && type === 'recovery') {
          console.log('🔄 Processing recovery token...');
          
          // Set session dengan token
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            setStatus('error');
            setMessage('Token tidak valid. Silakan minta link baru.');
            
            setTimeout(() => {
              navigate('/reset-password', {
                state: { 
                  error: 'Token tidak valid. Silakan minta link baru.' 
                }
              });
            }, 1500);
            return;
          }

          console.log('✅ Recovery session set successfully');
          
          // Redirect ke reset-password page untuk ganti password
          setStatus('success');
          setMessage('Token valid! Mengarahkan ke halaman reset password...');
          
          setTimeout(() => {
            navigate('/reset-password');
          }, 1500);
          return;
        }

        // 🔵 CASE 3: Magic link atau signup confirmation
        if (accessToken && (type === 'magiclink' || type === 'signup')) {
          console.log('🔗 Processing magic link/signup...');
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('❌ Magic link error:', sessionError);
            setStatus('error');
            setMessage('Link verifikasi tidak valid.');
            
            setTimeout(() => {
              navigate('/login', { 
                state: { error: 'Link verifikasi tidak valid.' } 
              });
            }, 1500);
            return;
          }

          console.log('✅ Magic link success');
          
          // Redirect ke home setelah login sukses
          setStatus('success');
          setMessage('Verifikasi berhasil! Mengarahkan ke dashboard...');
          
          setTimeout(() => {
            navigate('/');
          }, 1500);
          return;
        }

        // ⚠️ CASE 4: Tidak ada parameter yang dikenali
        console.log('⚠️ No recognizable parameters');
        setStatus('error');
        setMessage('Link tidak dikenali.');
        
        setTimeout(() => {
          navigate('/login');
        }, 1500);

      } catch (err) {
        console.error('❌ Auth callback error:', err);
        setStatus('error');
        setMessage('Terjadi kesalahan. Silakan coba lagi.');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  // UI untuk menampilkan status
  const renderStatus = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#ffd4fe] border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-black mb-2">Memproses</h2>
            <p className="text-black/60">Memverifikasi tautan Anda...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Berhasil!</h2>
            <p className="text-black/60">{message}</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Terjadi Masalah</h2>
            <p className="text-black/60">{message}</p>
            <p className="text-black/40 text-sm mt-2">Mengarahkan...</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-sm p-8 rounded-2xl max-w-md w-full border border-white/30">
        {renderStatus()}
      </div>
    </div>
  );
};

export default AuthCallback;