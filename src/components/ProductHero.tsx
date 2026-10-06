import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import {
  ArrowDown,
  ListOrdered,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface ProductHeroProps {
  language: Language;
  onScrollToUpload?: () => void;
  onScrollToRequirements?: () => void;
}

interface InteractiveWordProps {
  word: string;
  index: number;
  containerMouse: { x: number; y: number } | null;
}

const InteractiveWord: React.FC<InteractiveWordProps> = ({
  word,
  index,
  containerMouse,
}) => {
  const wordRef = useRef<HTMLSpanElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('translate3d(0, 0, 0) scale(1)');
  const [isNear, setIsNear] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => {
    if (!containerMouse || !wordRef.current) {
      setTransformStyle('translate3d(0, 0, 0) scale(1)');
      setIsNear(false);
      setGlowIntensity(0);
      return;
    }

    const rect = wordRef.current.getBoundingClientRect();
    const wordCenterX = rect.left + rect.width / 2;
    const wordCenterY = rect.top + rect.height / 2;

    const distX = containerMouse.x - wordCenterX;
    const distY = containerMouse.y - wordCenterY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    const radius = 170; // interaction field in pixels

    if (distance < radius) {
      const proximity = 1 - distance / radius; // 0 to 1
      const pullFactor = 9 * proximity;
      const angle = Math.atan2(distY, distX);
      const moveX = Math.cos(angle) * pullFactor;
      const moveY = Math.sin(angle) * pullFactor;
      const scale = 1 + proximity * 0.04;

      setTransformStyle(`translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`);
      setIsNear(true);
      setGlowIntensity(proximity);
    } else {
      setTransformStyle('translate3d(0, 0, 0) scale(1)');
      setIsNear(false);
      setGlowIntensity(0);
    }
  }, [containerMouse]);

  return (
    <span
      ref={wordRef}
      className="inline-block relative cursor-default select-none transition-transform duration-300 ease-out will-change-transform animate-word-entrance"
      style={{
        transform: transformStyle,
        animationDelay: `${index * 0.18}s`,
        filter: isNear
          ? `drop-shadow(0 0 ${(glowIntensity * 16).toFixed(1)}px rgba(96, 165, 250, 0.65))`
          : 'none',
      }}
    >
      <span
        className={`inline-block transition-all duration-300 font-black tracking-tight ${
          isNear
            ? 'bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent'
            : index === 0
            ? 'text-white'
            : index === 1
            ? 'text-slate-100'
            : 'bg-gradient-to-r from-blue-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent'
        }`}
      >
        {word}
      </span>
      {/* Non-breaking space separator */}
      <span className="inline-block w-2 sm:w-3" />
    </span>
  );
};

export const ProductHero: React.FC<ProductHeroProps> = ({
  language,
  onScrollToUpload,
  onScrollToRequirements,
}) => {
  const t = translations[language];
  const heroRef = useRef<HTMLDivElement>(null);
  const [globalMouse, setGlobalMouse] = useState<{ x: number; y: number } | null>(null);
  const [localMouse, setLocalMouse] = useState<{ x: number; y: number } | null>(null);

  const headlineWords = [
    t.heroHeadlinePart1,
    t.heroHeadlinePart2,
    t.heroHeadlinePart3,
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });

    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      setLocalMouse({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseLeave = () => {
    setGlobalMouse(null);
    setLocalMouse(null);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl border border-slate-800/90 p-6 sm:p-8 lg:p-10 mb-8 transition-all"
    >
      {/* 1. Subtle Animated Gradient Background Orbs (CSS Keyframe Animations) */}
      <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-28 right-4 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* 2. Interactive Cursor-Following Ambient Spotlight (Subtle Glow Micro-interaction) */}
      {localMouse && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${localMouse.x}px ${localMouse.y}px, rgba(56, 189, 248, 0.12), transparent 60%)`,
          }}
        />
      )}

      {/* 3. Subtle Vector Grid Pattern (CSS SVG Grid) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-[11px] font-bold tracking-widest uppercase mb-4 shadow-2xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-sm shadow-blue-400/50" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Large Interactive Headline with Word-by-Word Parallax & Magnetic Hover */}
        <div className="my-2">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white drop-shadow-sm flex flex-wrap items-center">
            {headlineWords.map((word, idx) => (
              <InteractiveWord
                key={`${word}-${idx}`}
                word={word}
                index={idx}
                containerMouse={globalMouse}
              />
            ))}
          </h2>
        </div>

        {/* Supporting Line */}
        <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
          {t.heroSupporting}
        </p>

        {/* Action CTAs & Smooth Scroll Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToUpload}
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer group"
          >
            <span>{t.heroCtaStart}</span>
            <ArrowDown className="w-4 h-4 text-blue-200 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onScrollToRequirements}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 active:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-xs sm:text-sm transition-all cursor-pointer backdrop-blur-sm"
          >
            <ListOrdered className="w-4 h-4 text-slate-400" />
            <span>{t.heroCtaRequirements}</span>
          </button>
        </div>

        {/* Value Indicators */}
        <div className="mt-7 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-medium">{t.heroFeature1}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-slate-300 font-medium">{t.heroFeature2}</span>
          </div>

          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-300 font-medium">{t.heroFeature3}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
