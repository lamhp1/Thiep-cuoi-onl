import React, { useState, useEffect } from 'react';
import { weddingAudio, playCyberLaser, playCyberClick } from '../../../../lib/audioSynth';

interface CyberpunkHeroProps {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingDateTime?: string;
  city?: string;
  romanticQuote?: string;
  coverImage?: string;
  musicUrl?: string;
}

export function CyberpunkHero({
  groomName,
  brideName,
  weddingDate,
  weddingDateTime,
  city = 'Hà Nội',
  romanticQuote = 'Hai hành tinh - Một quỹ đạo vĩnh hằng',
  coverImage,
  musicUrl,
}: CyberpunkHeroProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const unsub = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const target = new Date(weddingDateTime || weddingDate || '2026-12-20T17:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate, weddingDateTime]);

  const handleOpenGate = () => {
    playCyberLaser();
    setIsOpen(true);
    weddingAudio.play(musicUrl);
  };

  const handleToggleAudio = () => {
    playCyberClick();
    weddingAudio.toggle(musicUrl);
  };

  const defaultHeroBg = coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600';

  return (
    <div className="relative min-h-screen bg-[#050714] text-slate-100 overflow-hidden flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* 3D Hologram Gate Curtain */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 bg-[#050714] flex flex-col items-center justify-center p-6 text-center border-4 border-cyan-500/20">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
          
          <div className="relative z-10 max-w-lg w-full bg-[#0B1026]/90 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-6">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest text-cyan-400 border border-cyan-500/30 uppercase bg-cyan-950/40">
              CYBERPUNK HOLOGRAM 3D
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase font-mono bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-400 bg-clip-text text-transparent holo-glitch">
                {groomName} & {brideName}
              </h2>
              <p className="text-xs text-cyan-300/80 font-mono tracking-wide">
                INITIATING QUANTUM HOLOGRAM INVITATION • {weddingDate}
              </p>
            </div>

            <div className="py-4 border-y border-cyan-500/20 flex justify-center items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono text-cyan-300">HOLOGRAM SYSTEM READY</span>
            </div>

            <button
              onClick={handleOpenGate}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-600 text-white font-mono font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_45px_rgba(255,0,122,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <span>KÍCH HOẠT THIỆP 3D HOLOGRAM</span>
              <span className="group-hover:translate-x-1 transition-transform">⚡</span>
            </button>
          </div>
        </div>
      )}

      {/* Cyber Backdrop & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity scale-105 transition-transform duration-10000 hover:scale-100"
          style={{ backgroundImage: `url(${defaultHeroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050714]/80 via-[#050714]/90 to-[#050714]" />
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#00f0ff_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Audio Control Floating Widget */}
      <div className="relative z-30 pt-6 px-6 flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-2 bg-[#0B1026]/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>CYBER HOLOGRAM 2027</span>
        </div>

        <button
          onClick={handleToggleAudio}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-mono transition-all duration-300 ${
            isPlaying
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
              : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-500'
          }`}
        >
          <span>{isPlaying ? '🔊 ÂM THANH HOLOGRAM' : '🔇 TẮT ÂM THANH'}</span>
        </button>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20 text-center space-y-8 my-auto">
        {/* Hologram Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-950/80 to-purple-950/80 border border-cyan-500/40 px-4 py-2 rounded-full text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <span className="text-pink-400">✦</span>
          <span className="uppercase tracking-widest">KỶ NGUYÊN TÌNH YÊU 3D • {city}</span>
          <span className="text-pink-400">✦</span>
        </div>

        {/* Couple Names Headline */}
        <div className="space-y-4">
          <p className="text-xs uppercase font-mono tracking-widest text-pink-400/90">
            TRANSMITTING HOLOGRAM INVITATION
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight font-mono leading-none drop-shadow-[0_0_35px_rgba(0,240,255,0.4)]">
            <span className="bg-gradient-to-r from-cyan-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent inline-block holo-glitch">
              {groomName}
            </span>
            <span className="block my-2 text-2xl md:text-4xl text-pink-500 font-extralight tracking-widest holo-glitch">
              ⚡ & ⚡
            </span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-pink-500 bg-clip-text text-transparent inline-block holo-glitch">
              {brideName}
            </span>
          </h1>
        </div>

        {/* Romantic Quote */}
        <p className="text-sm md:text-base font-sans text-slate-300 max-w-xl mx-auto italic font-light border-x border-cyan-500/30 px-6 py-2">
          "{romanticQuote}"
        </p>

        {/* Countdown Timer Grid */}
        <div className="pt-6">
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4">
            ĐẾM NGƯỢC THỜI GIAN ĐẠI HỶ (COUNTDOWN MATRIX)
          </p>
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {[
              { label: 'NGÀY', val: timeLeft.days },
              { label: 'GIỜ', val: timeLeft.hours },
              { label: 'PHÚT', val: timeLeft.minutes },
              { label: 'GIÂY', val: timeLeft.seconds },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0B1026]/90 border border-cyan-500/30 rounded-2xl p-3 md:p-4 text-center backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:border-pink-500/50 transition-colors"
              >
                <span className="block text-2xl md:text-4xl font-mono font-bold text-white tabular-nums">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Date Anchor */}
      <div className="relative z-20 pb-8 text-center space-y-2">
        <div className="inline-block h-8 w-[1px] bg-gradient-to-b from-cyan-400 to-transparent mx-auto animate-pulse" />
        <p className="text-xs font-mono text-cyan-300/70 tracking-widest uppercase">
          THỜI GIAN LỄ CƯỚI: {weddingDate}
        </p>
      </div>
    </div>
  );
}
