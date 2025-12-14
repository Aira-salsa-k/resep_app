// AuthConfirm.jsx - Versi lengkap
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AuthConfirm = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Parse BOTH query params dan hash fragment
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Coba ambil dari query params terlebih dahulu
        let token_hash = searchParams.get('token_hash');
        let type = searchParams.get('type');
        
        // Jika tidak ada di query params, coba dari hash
        if (!token_hash) {
          token_hash = hashParams.get('token_hash');
        }
        if (!type) {
          type = hashParams.get('type');
        }
        
        // Juga coba format OTP (access_token) untuk compatibility
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log('🔍 AuthConfirm Params:', { 
          token_hash: token_hash ? 'found' : 'not found',
          type,
          hasAccessToken: !!accessToken,
          search: window.location.search,
          hash: window.location.hash.substring(1, 50) + '...'
        });

        // CASE 1: Token hash dari email template (paling umum)
        if (token_hash && type) {
          console.log(`🔄 Verifying ${type} with token hash...`);
          
          try {
            // Verifikasi OTP untuk email confirmation
            const { error } = await supabase.auth.verifyOtp({
              token_hash,
              type: type // 'signup', 'email', 'recovery', dll
            });

            if (error) {
              console.error('❌ OTP verification error:', error);
              throw error;
            }

            console.log('✅ Email verified successfully!');
            setStatus('success');
            setMessage('Email berhasil diverifikasi! Mengarahkan ke login...');
            
            setTimeout(() => {
              navigate('/login', { 
                state: { 
                  message: 'Email berhasil diverifikasi! Silakan login.',
                  emailVerified: true
                }
              });
            }, 2000);
            return;
            
          } catch (err) {
            console.error('❌ Verification failed:', err);
            setStatus('error');
            setMessage('Link verifikasi tidak valid atau sudah kadaluarsa.');
            
            setTimeout(() => {
              navigate('/login', { 
                state: { error: 'Link verifikasi tidak valid.' }
              });
            }, 2000);
            return;
          }
        }

        // CASE 2: Access token dari hash (fallback untuk compatibility)
        if (accessToken && (type === 'signup' || type === 'email')) {
          console.log('🔄 Setting session with access token...');
          
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (sessionError) {
            console.error('❌ Session error:', sessionError);
            throw sessionError;
          }

          console.log('✅ Session set successfully');
          setStatus('success');
          setMessage('Verifikasi berhasil! Mengarahkan ke dashboard...');
          
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        // CASE 3: Tidak ada parameter yang valid
        console.log('⚠️ No valid parameters found');
        setStatus('error');
        setMessage('Link tidak dikenali atau sudah kadaluarsa.');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } catch (err) {
        console.error('❌ AuthConfirm error:', err);
        setStatus('error');
        setMessage(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
        
        setTimeout(() => {
          navigate('/login', { 
            state: { error: 'Gagal memverifikasi email.' }
          });
        }, 2000);
      }
    };

    confirmEmail();
  }, [navigate]);

  // UI untuk menampilkan status
  const renderStatus = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[#ffd4fe] border-t-black rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-black mb-2">Memverifikasi Email</h2>
              <p className="text-black/60">Harap tunggu sebentar...</p>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">Berhasil!</h2>
              <p className="text-black/60">{message}</p>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="min-h-screen bg-[#ffd4fe] flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-black mb-2">Gagal Verifikasi</h2>
              <p className="text-black/60">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 text-sm text-black/70 hover:text-black underline"
              >
                Kembali ke Login
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderStatus();
};

export default AuthConfirm;