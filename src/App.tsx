import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore, syncUserFromFirestore } from './store/useAuthStore';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Multiplayer } from './pages/Multiplayer';
import { Countries } from './pages/Countries';
import { Passport } from './pages/Passport';
import { MistakeVault } from './pages/MistakeVault';
import { BadgeToast } from './components/BadgeToast';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(state => state.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { setInitialized, setLoading, setUser } = useAuthStore();
  const darkMode = useAuthStore(state => state.user?.settings.darkMode ?? true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserFromFirestore(firebaseUser.uid);
      } else {
        const currentUser = useAuthStore.getState().user;
        // Only clear user if not an active guest session
        if (!currentUser?.uid.startsWith('guest_')) {
          setUser(null);
        }
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setInitialized, setLoading, setUser]);

  return (
    <BrowserRouter>
      <BadgeToast />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="game" element={<Game />} />
          <Route path="passport" element={<Passport />} />
          <Route path="mistakes" element={<MistakeVault />} />
          <Route path="multiplayer" element={<Multiplayer />} />
          <Route path="countries" element={<Countries />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
