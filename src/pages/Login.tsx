import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AlertTriangle, LogIn } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { useTema } from '../lib/tema';
import { logoYolu } from '../lib/logo';
import { Buton } from '../components/ds';

export function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);
  const tema = useTema();
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
        setError(`Bu alan adı yetkili değil. Firebase Console'da Authentication > Ayarlar > Yetkilendirilmiş alan adları listesine "${window.location.hostname}" adresini ekle.`);
      } else if (err.code === 'auth/popup-blocked') {
        setError('Giriş penceresini tarayıcı engelledi. Engelleyiciyi kapat veya misafir olarak gir.');
      } else {
        setError(err.message || 'Giriş yapılamadı. Yeniden dene.');
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
      displayName: `Gezgin ${Math.floor(1000 + Math.random() * 9000)}`,
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-zemin p-6">
      <div className="w-full max-w-sm rounded-xl border border-cizgi bg-zemin-yukseltilmis p-8 text-center">
        {/* Dikey kilit 259,8 x 129 oranındadır; en az 140 px genişlikte kullanılır. */}
        <img
          src={logoYolu(tema, 'dikey')}
          alt="FlagQuest"
          width={160}
          height={79}
          className="mx-auto mb-6 h-auto w-40"
        />

        <p className="govde text-metin-yumusak">
          195 ülkenin bayrağını öğren, doğru bildiğin her ülkeyi pasaportuna mühürle.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 flex gap-2 rounded-lg border border-damga bg-damga-yumusak p-3 text-left"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-damga" aria-hidden="true" />
            <p className="govde-sm text-damga">{error}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Buton
            cesit="birincil"
            boyut="lg"
            tamGenislik
            disabled={isLoading}
            onClick={handleGoogleLogin}
            ikon={<GoogleIsareti />}
          >
            {isLoading ? 'Bağlanıyor' : 'Google ile gir'}
          </Buton>

          <Buton
            cesit="ikincil"
            boyut="lg"
            tamGenislik
            disabled={isLoading}
            onClick={handleGuestLogin}
            ikon={<LogIn size={18} />}
          >
            Misafir olarak gir
          </Buton>
        </div>

        <p className="belge-sm mt-6 text-metin-silik">
          MİSAFİR KAYDI YALNIZ BU CİHAZDA TUTULUR
        </p>
      </div>
    </div>
  );
}

function GoogleIsareti() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
