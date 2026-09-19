import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, Check, Play, Loader2, ArrowRight, X, User, Eye, Zap, Scissors, Sparkles, BookOpen } from 'lucide-react';
import { useAuthStore, UserProfile } from '../store/useAuthStore';
import { useMultiplayerStore, MultiplayerGameData, ChaosEvent } from '../store/useMultiplayerStore';
import { useBadgeStore } from '../store/useBadgeStore';
import { getFlagUrl } from '../data/countries';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { playMatchStartSound } from '../lib/audio';

// ==========================================
// 1. ENTRY VIEW (NOT IN ROOM)
// ==========================================
function MultiplayerEntry({
  user,
  createRoom,
  joinRoom,
  loading,
  error
}: {
  user: UserProfile;
  createRoom: (user: any) => Promise<string>;
  joinRoom: (code: string, user: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}) {
  const [joinCode, setJoinCode] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 pb-32 max-w-md mx-auto">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <Users className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Çok Oyunculu</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm">
        Arkadaşlarınla gerçek zamanlı bayrak bilmece kapışmasına katıl. Kaos ve eğlence garantili!
      </p>

      {error && (
        <div className="w-full mb-6 p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-200 dark:border-red-900/30">
          {error}
        </div>
      )}

      <div className="w-full space-y-4">
        <button
          onClick={() => createRoom(user)}
          disabled={loading}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 active:scale-[0.99] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yeni Oda Kur'}
        </button>
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-semibold tracking-wider">VEYA</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Oda Kodu (örn. A1B2C3)"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-bold text-center uppercase tracking-widest outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            maxLength={6}
          />
          <button
            onClick={() => joinRoom(joinCode, user)}
            disabled={loading || joinCode.length < 4}
            className="px-6 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Katıl'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. LOBBY VIEW (WAITING FOR PLAYERS)
// ==========================================
function MultiplayerLobby({
  roomId,
  roomData,
  user,
  leaveRoom,
  startGame
}: {
  roomId: string;
  roomData: MultiplayerGameData;
  user: UserProfile;
  leaveRoom: (uid: string) => Promise<void>;
  startGame: () => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const isHost = roomData.createdBy === user.uid;
  const playerIds = roomData.playerIds || [];
  const allReady = playerIds.length > 0 && playerIds.every(pid => roomData.players?.[pid]?.isReady);
  const myPlayer = roomData.players?.[user.uid] || {
    displayName: user.displayName || 'Oyuncu',
    photoURL: user.photoURL,
    score: 0,
    hasAnswered: false,
    isHost,
    isReady: false,
    selectedOption: null,
    jokers: { fiftyFifty: true, peek: true, double: true },
    activeJoker: null,
    hasSpunWheel: false
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FlagQuest Çok Oyunculu',
          text: `Benimle FlagQuest oyna! Oda kodum: ${roomId}`,
        });
      } catch (e) {
        navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 pb-32 max-w-md mx-auto flex flex-col min-h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" />
          Oda Lobisi
        </h2>
        <button 
          onClick={() => leaveRoom(user.uid)} 
          className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800"
          title="Odadan Ayrıl"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Room Code Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1 rounded-3xl shadow-lg shadow-indigo-500/20 mb-8 relative">
        <div className="bg-white dark:bg-slate-950 rounded-[22px] p-6 text-center relative z-10 border-4 border-transparent flex flex-col items-center">
          <p className="text-xs text-indigo-500 font-bold mb-1 uppercase tracking-widest">Davet Kodu</p>
          <div className="text-5xl font-black tracking-[0.2em] text-slate-900 dark:text-white mb-4 ml-4">
            {roomId}
          </div>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Kopyalandı!' : 'Kodu Paylaş / Kopyala'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-slate-500 dark:text-slate-400 text-sm">
          Oyuncular ({playerIds.length}/4)
        </h3>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          {allReady ? 'Herkes Hazır' : 'Bekleniyor...'}
        </span>
      </div>
      
      {/* Players Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1 content-start">
        <AnimatePresence>
          {playerIds.map((pid, idx) => {
            const p = roomData.players?.[pid] || { displayName: 'Oyuncu', photoURL: null, isHost: false, isReady: false };
            return (
              <motion.div
                key={pid}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "flex flex-col items-center p-4 rounded-2xl border-2 transition-colors relative overflow-hidden",
                  p.isReady ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-sm shadow-emerald-500/20" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                )}
              >
                {p.isHost && (
                  <div className="absolute top-2 left-2 p-1 bg-amber-100 dark:bg-amber-900/50 text-amber-600 rounded-md" title="Oda Kurucusu">
                    <Users className="w-3 h-3" />
                  </div>
                )}
                {p.isReady && (
                  <div className="absolute top-2 right-2 p-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                <div className={cn(
                  "w-16 h-16 rounded-full mb-3 flex items-center justify-center font-bold text-xl border-4",
                  p.isReady ? "border-emerald-200 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600" : "border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500",
                  "overflow-hidden"
                )}>
                  {p.photoURL ? (
                    <img src={p.photoURL} alt={p.displayName} className="w-full h-full object-cover" />
                  ) : (
                    p.displayName.charAt(0)
                  )}
                </div>
                <div className="font-bold text-sm text-center truncate w-full px-2">
                  {p.displayName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">
                  {p.isReady ? 'Hazır' : 'Bekleniyor...'}
                </div>
              </motion.div>
            );
          })}

          {/* Empty Slots */}
          {Array.from({ length: Math.max(0, 4 - playerIds.length) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 min-h-[140px]"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center mb-3">
                <User className="w-5 h-5 opacity-40" />
              </div>
              <div className="text-xs font-medium opacity-60">Boş Slot</div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Controls */}
      <div className="pt-6 mt-auto space-y-3">
        <button
          onClick={() => useMultiplayerStore.getState().toggleReady(user.uid)}
          className={cn(
            "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
            myPlayer.isReady 
              ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700" 
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
          )}
        >
          {myPlayer.isReady ? (
            <>İptal Et</>
          ) : (
            <><Check className="w-5 h-5" /> Hazırım!</>
          )}
        </button>
      
        {isHost ? (
          <button
            onClick={() => startGame()}
            disabled={!allReady}
            className={cn(
              "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
              allReady
                ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 active:scale-[0.99]"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            )}
          >
            <Play className="w-5 h-5 fill-current" /> Oyunu Başlat
          </button>
        ) : (
          <div className="w-full py-3.5 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-xl font-medium text-center text-sm border border-slate-200 dark:border-slate-800">
            {allReady ? 'Herkes hazır, maç başlatılıyor...' : 'Diğer oyuncuların hazır olması bekleniyor...'}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 3. GAMEPLAY VIEW (ACTIVE MATCH)
// ==========================================
function MultiplayerGameplay({
  roomId: _roomId,
  roomData,
  user,
  answerQuestion
}: {
  roomId: string;
  roomData: MultiplayerGameData;
  user: UserProfile;
  answerQuestion: (uid: string, code: string) => Promise<void>;
}) {
  const isHost = roomData.createdBy === user.uid;
  const questions = roomData.questions || [];
  const currentIdx = Math.min(roomData.currentQuestionIndex || 0, Math.max(0, questions.length - 1));
  const currentQ = questions[currentIdx];
  const playerIds = roomData.playerIds || [];

  const myPlayer = roomData.players?.[user.uid] || {
    displayName: user.displayName || 'Oyuncu',
    photoURL: user.photoURL,
    score: 0,
    hasAnswered: false,
    isHost,
    isReady: true,
    selectedOption: null,
    jokers: { fiftyFifty: true, peek: true, double: true },
    activeJoker: null,
    hasSpunWheel: false
  };

  const allAnswered = playerIds.length > 0 && playerIds.every(pid => roomData.players?.[pid]?.hasAnswered);

  // Eliminate 2 wrong options if fiftyFifty is active
  let eliminatedOptions: string[] = [];
  if (myPlayer.activeJoker === 'fiftyFifty' && currentQ) {
    const incorrects = currentQ.options.filter(o => o.code !== currentQ.correctOption.code);
    eliminatedOptions = incorrects.slice(0, 2).map(o => o.code);
  }

  const canPeek = myPlayer.activeJoker === 'peek' || allAnswered;

  if (!currentQ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-slate-500 text-sm font-medium">Sıradaki soru yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] pb-32 p-6 max-w-md mx-auto relative overflow-hidden">
      
      {/* Chaos Event Toasts */}
      <div className="absolute top-4 left-4 right-4 z-50 pointer-events-none flex flex-col gap-2">
        <AnimatePresence>
          {(roomData.recentEvents || []).slice(-2).map((event: ChaosEvent) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "p-3 rounded-xl text-sm font-bold shadow-lg border backdrop-blur-md",
                event.type === 'steal' ? 'bg-red-500/90 text-white border-red-400' :
                event.type === 'boost' ? 'bg-emerald-500/90 text-white border-emerald-400' :
                'bg-orange-500/90 text-white border-orange-400'
              )}
            >
              {event.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Live Scoreboard Header */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
        {playerIds.map(pid => {
          const p = roomData.players?.[pid];
          if (!p) return null;
          return (
            <div key={pid} className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0 transition-colors",
              p.hasAnswered ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700" : "bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-500/50"
            )}>
              <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] font-bold">
                {p.photoURL ? <img src={p.photoURL} alt="" /> : p.displayName.charAt(0)}
              </div>
              <span className="text-xs font-bold">{p.score}</span>
              {p.hasAnswered && <Check className="w-3 h-3 text-emerald-500" />}
            </div>
          );
        })}
      </div>
      
      {/* Question Progress Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500 rounded-full"
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="ml-4 text-xs font-bold text-slate-400 shrink-0">{currentIdx + 1} / {questions.length}</span>
      </div>

      {/* Joker Bar */}
      <div className="flex justify-between gap-3 mb-6">
        <JokerButton 
          icon={<Scissors className="w-4 h-4" />} 
          label="Yarı Yarıya" 
          available={!!myPlayer.jokers?.fiftyFifty}
          active={myPlayer.activeJoker === 'fiftyFifty'}
          onClick={() => useMultiplayerStore.getState().useJoker(user.uid, 'fiftyFifty')}
          color="bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-400"
        />
        <JokerButton 
          icon={<Eye className="w-4 h-4" />} 
          label="Kopya Çek" 
          available={!!myPlayer.jokers?.peek}
          active={myPlayer.activeJoker === 'peek'}
          onClick={() => useMultiplayerStore.getState().useJoker(user.uid, 'peek')}
          color="bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400"
        />
        <JokerButton 
          icon={<Zap className="w-4 h-4" />} 
          label="Çifte Puan" 
          available={!!myPlayer.jokers?.double}
          active={myPlayer.activeJoker === 'double'}
          onClick={() => useMultiplayerStore.getState().useJoker(user.uid, 'double')}
          color="bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800 dark:text-orange-400"
        />
      </div>

      {/* Flag Display */}
      <motion.div
        key={currentQ.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full aspect-[3/2] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 mb-6 flex items-center justify-center relative"
      >
        {myPlayer.activeJoker === 'double' && (
           <div className="absolute top-2 right-2 px-3 py-1 bg-orange-500 text-white text-xs font-black rounded-full shadow-lg z-10 animate-bounce">
             2X PUAN AKTİF!
           </div>
        )}
        <img 
          src={getFlagUrl(currentQ.correctOption.code)} 
          alt="Flag" 
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Options Grid */}
      <div className="grid gap-3 flex-1 content-start">
        {currentQ.options.map((option) => {
          const isSelected = myPlayer.selectedOption === option.code;
          const isActuallyCorrect = option.code === currentQ.correctOption.code;
          const showResult = myPlayer.hasAnswered;
          const isEliminated = eliminatedOptions.includes(option.code);
          
          // Find players who picked this option
          const peekers = playerIds.filter(pid => 
            pid !== user.uid && 
            roomData.players?.[pid]?.hasAnswered && 
            roomData.players?.[pid]?.selectedOption === option.code
          );
          
          let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800";
          
          if (isEliminated) {
            btnClass = "opacity-30 border-dashed dark:border-slate-800 bg-slate-50 dark:bg-slate-900 pointer-events-none";
          } else if (showResult) {
            if (isActuallyCorrect) {
              btnClass = "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-md shadow-emerald-500/20";
            } else if (isSelected) {
              btnClass = "bg-red-50 border-red-500 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            } else {
              btnClass = "opacity-50 border-slate-200 dark:border-slate-800";
            }
          }

          return (
            <button
              key={option.code}
              onClick={() => !isEliminated && answerQuestion(user.uid, option.code)}
              disabled={myPlayer.hasAnswered || isEliminated}
              className={cn(
                "p-4 rounded-2xl border-2 font-medium text-left flex items-center justify-between transition-all relative overflow-hidden",
                btnClass,
                !myPlayer.hasAnswered && !isEliminated && "hover:border-indigo-300 dark:hover:border-indigo-700 active:scale-[0.98]"
              )}
            >
              <span>{option.name}</span>
              
              <div className="flex items-center gap-2">
                {/* Peek Avatars */}
                {canPeek && peekers.length > 0 && (
                  <div className="flex -space-x-2 mr-2">
                    {peekers.map(pid => (
                      <div key={pid} className="w-6 h-6 rounded-full border border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] font-bold z-10 shadow-sm">
                        {roomData.players?.[pid]?.photoURL ? (
                          <img src={roomData.players[pid].photoURL!} alt="" className="w-full h-full object-cover"/>
                        ) : (
                          roomData.players?.[pid]?.displayName?.charAt(0) || '?'
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {showResult && isActuallyCorrect && <Check className="w-5 h-5 text-emerald-500 shrink-0" />}
                {showResult && isSelected && !isActuallyCorrect && <X className="w-5 h-5 text-red-500 shrink-0" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Fun Fact Display */}
      {myPlayer.hasAnswered && currentQ?.correctOption?.funFact && (
        <div className="mt-4 p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 rounded-2xl text-xs text-slate-700 dark:text-slate-300 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Ansiklopediden İlginç Bilgi
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/50">
              {currentQ.correctOption.region}
            </span>
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
            {currentQ.correctOption.name} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">• Başkent: {currentQ.correctOption.capital}</span>
          </div>
          <p className="text-xs leading-relaxed">{currentQ.correctOption.funFact}</p>
        </div>
      )}

      {/* Next Question Control */}
      <div className="pt-6 mt-auto">
        {myPlayer.hasAnswered && !allAnswered && (
          <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse text-sm font-medium">
            Diğer oyuncular bekleniyor...
          </div>
        )}

        {allAnswered && isHost && (
          <button
            onClick={() => {
              if (currentIdx < questions.length - 1) {
                useMultiplayerStore.getState().nextQuestion();
              } else {
                useMultiplayerStore.getState().finishGame();
              }
            }}
            className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {currentIdx < questions.length - 1 ? 'Sonraki Soru' : 'Kader Çarkına Geç'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

        {allAnswered && !isHost && (
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium border border-indigo-200 dark:border-indigo-800">
            Kurucunun devam etmesi bekleniyor...
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. SPINNING WHEEL VIEW
// ==========================================
function MultiplayerSpinning({
  roomId: _roomId,
  roomData,
  user
}: {
  roomId: string;
  roomData: MultiplayerGameData;
  user: UserProfile;
}) {
  const myPlayer = roomData.players?.[user.uid] || { hasSpunWheel: false };
  const playerIds = roomData.playerIds || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] pb-32 p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-black text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
        Kader Çarkı
      </h2>
      <p className="text-center text-slate-500 mb-8 font-medium text-sm">Son bir şans! Ekstra puan kazan veya ceza al.</p>
      
      {myPlayer.hasSpunWheel ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
            <Check className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black mb-2">Çarkı Çevirdin!</h3>
          <p className="text-slate-500 mb-10 font-medium text-sm">Diğer oyuncular bekleniyor...</p>
          <div className="flex gap-3 justify-center">
            {playerIds.map(pid => {
              const p = roomData.players?.[pid];
              if (!p) return null;
              return (
                <div key={pid} className={cn(
                  "w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm transition-colors",
                  p.hasSpunWheel ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-200 dark:border-slate-700 text-slate-400 bg-slate-50 dark:bg-slate-800 opacity-50"
                )}>
                  {p.photoURL ? <img src={p.photoURL} className="w-full h-full rounded-full object-cover" alt=""/> : p.displayName.charAt(0)}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <WheelOfFortune onComplete={(points) => useMultiplayerStore.getState().spinWheel(user.uid, points)} />
      )}
    </div>
  );
}

// ==========================================
// 5. RESULTS VIEW
// ==========================================
function MultiplayerResults({
  roomId: _roomId,
  roomData,
  user,
  leaveRoom
}: {
  roomId: string;
  roomData: MultiplayerGameData;
  user: UserProfile;
  leaveRoom: (uid: string) => Promise<void>;
}) {
  const navigate = useNavigate();
  const sortedPlayers = Object.entries(roomData.players || {})
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] pb-32 p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-black text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
        Maç Sonucu
      </h2>

      <div className="space-y-4 mb-8">
        {sortedPlayers.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border",
              p.id === user.uid ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-500/50" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
            )}
          >
            <div className="w-8 font-black text-2xl text-slate-300 dark:text-slate-600">
              #{index + 1}
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xl">
              {p.photoURL ? <img src={p.photoURL} alt="" /> : p.displayName.charAt(0)}
            </div>
            <div className="flex-1 font-bold text-lg">
              {p.displayName}
            </div>
            <div className="font-black text-indigo-500 text-xl">
              {p.score} <span className="text-[10px] text-slate-400 font-normal">XP</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Match Questions & Encyclopedia Highlights */}
      {roomData.questions && roomData.questions.length > 0 && (
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Maçtaki Ülkeler & Ansiklopedi Notları
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {roomData.questions.length} Ülke
            </span>
          </div>

          <div className="space-y-3">
            {roomData.questions.map((q, idx) => {
              const country = q.correctOption;
              if (!country) return null;
              return (
                <div
                  key={q.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-7 rounded overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 flex items-center justify-center">
                      <img
                        src={getFlagUrl(country.code)}
                        alt={`${country.name} Bayrağı`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                        {country.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Başkent: {country.capital} • {country.region}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border border-slate-100 dark:border-slate-800/70">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mb-0.5 text-[10px] uppercase tracking-wide">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      Ansiklopedi Bilgisi
                    </span>
                    {country.funFact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => {
            leaveRoom(user.uid);
            navigate('/');
          }}
          className="flex-1 py-4 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          Ana Sayfaya Dön
        </button>
        <button
          onClick={() => {
            leaveRoom(user.uid);
            navigate('/countries');
          }}
          className="px-4 py-4 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/40 text-sky-700 dark:text-sky-300 rounded-xl font-bold transition-colors flex items-center gap-1.5 border border-sky-200/60 dark:border-sky-800/60"
          title="Ansiklopediyi İncele"
        >
          <BookOpen className="w-4 h-4 text-sky-500" />
          <span>Ansiklopedi</span>
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 6. MAIN MULTIPLAYER COMPONENT
// ==========================================
export function Multiplayer() {
  const user = useAuthStore(state => state.user);
  const { 
    roomId, roomData, createRoom, joinRoom, leaveRoom, 
    startGame, answerQuestion, loading, error 
  } = useMultiplayerStore();

  const processedWinRef = useRef(false);
  const playedStartSoundRef = useRef(false);
  const isAutoStartingRef = useRef(false);

  // Auto clean-up on unmount
  useEffect(() => {
    return () => {
      if (user?.uid) {
        leaveRoom(user.uid);
      }
    };
  }, [user?.uid, leaveRoom]);

  // Match start sound effect trigger
  useEffect(() => {
    const isPlaying = roomData?.status === 'started';
    if (isPlaying && !playedStartSoundRef.current) {
      playMatchStartSound();
      playedStartSoundRef.current = true;
    } else if (roomData?.status === 'waiting') {
      playedStartSoundRef.current = false;
    }
  }, [roomData?.status]);

  // Match auto-start optimization: When all players in room are ready, host auto starts
  useEffect(() => {
    if (roomData?.status === 'waiting') {
      const isHost = roomData.createdBy === user?.uid;
      const playerIds = roomData.playerIds || [];
      const allReady = playerIds.length > 0 && playerIds.every(pid => roomData.players?.[pid]?.isReady);
      
      if (isHost && allReady && !isAutoStartingRef.current) {
        isAutoStartingRef.current = true;
        startGame().catch(err => {
          console.error("Auto start error:", err);
          isAutoStartingRef.current = false;
        });
      }
    } else {
      isAutoStartingRef.current = false;
    }
  }, [roomData?.status, roomData?.playerIds, roomData?.players, roomData?.createdBy, user?.uid, startGame]);

  // Confetti and badges on match completed
  useEffect(() => {
    if (roomData?.status === 'completed' && !processedWinRef.current && user) {
      processedWinRef.current = true;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      const myPlayer = roomData.players?.[user.uid];
      if (myPlayer) {
        const sorted = Object.entries(roomData.players || {})
          .sort(([, a], [, b]) => b.score - a.score);
        const isWinner = sorted.length > 0 && sorted[0][0] === user.uid;
        
        useAuthStore.getState().updateUserStats(myPlayer.score, 0, isWinner).then(() => {
          return useAuthStore.getState().checkAndAwardBadges();
        }).then((newBadges) => {
          newBadges.forEach(badgeId => {
            useBadgeStore.getState().showBadge(badgeId);
          });
        });
      }
    }
  }, [roomData?.status, user, roomData]);

  // If user is not yet ready, render loading state rather than null
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Kullanıcı oturumu kontrol ediliyor...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary fallbackTitle="Çok Oyunculu Hatası" onReset={() => { if (user?.uid) leaveRoom(user.uid); }}>
      {renderContent()}
    </ErrorBoundary>
  );

  function renderContent() {
    // 1. Not in a room
    if (!roomId || !roomData) {
      return (
        <MultiplayerEntry 
          user={user!} 
          createRoom={createRoom} 
          joinRoom={joinRoom} 
          loading={loading} 
          error={error} 
        />
      );
    }

    // 2. Waiting in lobby
    if (roomData.status === 'waiting') {
      return (
        <MultiplayerLobby 
          roomId={roomId} 
          roomData={roomData} 
          user={user!} 
          leaveRoom={leaveRoom} 
          startGame={startGame} 
        />
      );
    }

    // 3. Gameplay active
    if (roomData.status === 'started') {
      return (
        <MultiplayerGameplay 
          roomId={roomId} 
          roomData={roomData} 
          user={user!} 
          answerQuestion={answerQuestion} 
        />
      );
    }

    // 4. Spinning wheel
    if (roomData.status === 'spinning') {
      return (
        <MultiplayerSpinning 
          roomId={roomId} 
          roomData={roomData} 
          user={user!} 
        />
      );
    }

    // 5. Results
    if (roomData.status === 'completed') {
      return (
        <MultiplayerResults 
          roomId={roomId} 
          roomData={roomData} 
          user={user!} 
          leaveRoom={leaveRoom} 
        />
      );
    }

    // Fallback loading indicator with explanation
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Oyun durumu senkronize ediliyor...</p>
      </div>
    );
  }
}

// ==========================================
// HELPER COMPONENTS
// ==========================================
function JokerButton({ 
  icon, 
  label, 
  available, 
  active, 
  onClick, 
  color 
}: { 
  icon: React.ReactNode, 
  label: string, 
  available: boolean, 
  active: boolean, 
  onClick: () => void,
  color: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={!available || active}
      className={cn(
        "flex-1 py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all border relative overflow-hidden",
        active ? color + " ring-2 ring-indigo-500 shadow-md scale-[1.02]" :
        available ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" :
        "bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed"
      )}
    >
      {icon}
      <span className="text-[10px] font-bold text-center leading-none">{label}</span>
      {!available && !active && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-[1px] rounded-xl">
          <X className="w-5 h-5 text-slate-400/50" />
        </div>
      )}
    </button>
  );
}

const WHEEL_SLICES = [
  { label: '+100 XP', points: 100, color: '#10b981' },
  { label: '-50 XP', points: -50, color: '#ef4444' },
  { label: '+50 XP', points: 50, color: '#34d399' },
  { label: '0 XP', points: 0, color: '#94a3b8' },
  { label: '+25 XP', points: 25, color: '#6366f1' },
  { label: '-20 XP', points: -20, color: '#f97316' },
];

function WheelOfFortune({ onComplete }: { onComplete: (points: number) => void }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const sliceIndex = Math.floor(Math.random() * 6);
    const target = 1800 - (sliceIndex * 60);
    const offset = Math.floor(Math.random() * 40) - 20;
    setRotation(target + offset);

    setTimeout(() => {
      onComplete(WHEEL_SLICES[sliceIndex].points);
    }, 4500);
  };

  const conic = `conic-gradient(from -30deg, ${WHEEL_SLICES.map((s, i) => `${s.color} ${i * 60}deg ${(i+1)*60}deg`).join(', ')})`;

  return (
    <div className="flex flex-col items-center flex-1 justify-center relative">
      <div className="relative mb-10 mt-4">
        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[28px] border-t-slate-900 dark:border-t-white z-20 drop-shadow-lg filter"></div>
        
        {/* Wheel */}
        <div className="w-72 h-72 rounded-full border-[6px] border-white dark:border-slate-800 shadow-2xl overflow-hidden relative">
          <div 
            className="w-full h-full relative transition-transform duration-[4000ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{ transform: `rotate(${rotation}deg)`, background: conic }}
          >
            {WHEEL_SLICES.map((slice, i) => (
               <div 
                 key={i} 
                 className="absolute inset-0 flex items-start justify-center pt-8"
                 style={{ transform: `rotate(${i * 60}deg)` }}
               >
                 <span className="font-black text-white text-2xl drop-shadow-md leading-none">{slice.label}</span>
               </div>
            ))}
          </div>
        </div>
      </div>
      <button 
        onClick={spin} 
        disabled={spinning}
        className="px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-indigo-500/30 disabled:opacity-50 transition-all text-lg active:scale-95"
      >
        {spinning ? 'Dönüyor...' : 'Şansını Dene!'}
      </button>
    </div>
  );
}
