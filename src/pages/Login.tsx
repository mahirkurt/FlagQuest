import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { Flag, LogIn, Loader2 } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userRef = doc(db, 'users', user.uid);
      let userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Oyuncu',
        photoURL: user.photoURL,
        xp: 0,
        level: 1,
        stats: { gamesPlayed: 0, totalScore: 0, correctAnswers: 0 },
        settings: { darkMode: true, notifications: true },
        badges: []
      };

      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          userProfile = userSnap.data() as UserProfile;
        } else {
          await setDoc(userRef, {
            ...userProfile,
            createdAt: new Date(),
            lastActive: new Date()
          });
        }
      } catch (firestoreErr) {
        console.warn("Firestore sync during login deferred (offline/caching):", firestoreErr);
      }
      
      setUser(userProfile);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError(`Lütfen Firebase Console'da Authentication > Ayarlar > Yetkilendirilmiş alan adları kısmına "${window.location.hostname}" adresini ekleyin.`);
      } else if (err.code === 'auth/popup-blocked') {
        setError("Giriş penceresi tarayıcınız tarafından engellendi. Lütfen pop-up engelleyiciyi kapatın veya Misafir Olarak Giriş Yapın.");
      } else {
        setError(err.message || 'Giriş yapılamadı. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
    const guestProfile: UserProfile = {
      uid: guestId,
      email: '',
      displayName: `Gezgin #${Math.floor(1000 + Math.random() * 9000)}`,
      photoURL: null,
      xp: 0,
      level: 1,
      stats: { gamesPlayed: 0, totalScore: 0, correctAnswers: 0 },
      settings: { darkMode: true, notifications: true },
      badges: []
    };
    setUser(guestProfile);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-100 dark:border-slate-800 text-center"
      >
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
          <Flag className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">FlagQuest</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Dünya bayraklarını keşfet ve arkadaşlarınla yarış!</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm text-left">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full relative flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors py-4 px-6 rounded-2xl font-medium"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google ile Giriş Yap
              </>
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold tracking-wider">VEYA</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white transition-colors py-3.5 px-6 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 text-sm"
          >
            <LogIn className="w-4 h-4" />
            Misafir Olarak Giriş Yap
          </button>
        </div>
      </motion.div>
    </div>
  );
}
