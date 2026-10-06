import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import {
  ArrowDown,
  ListOrdered,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
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
  isReducedMotion: boolean;
}

const InteractiveWord: React.FC<InteractiveWordProps> = ({
  word,
  index,
  containerMouse,
  isReducedMotion,
}) => {
  const wordRef = useRef<HTMLSpanElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('translate3d(0, 0, 0) scale(1)');
  const [isNear, setIsNear] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);

  useEffect(() => {
    if (isReducedMotion || !containerMouse || !wordRef.current) {
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

    const radius = 180; // Proximity field in pixels

    if (distance < radius) {
      const proximity = 1 - distance / radius; // 0 to 1
      const pullFactor = 8 * proximity;
      const angle = Math.atan2(distY, distX);
      const moveX = Math.cos(angle) * pullFactor;
      const moveY = Math.sin(angle) * pullFactor;
      const scale = 1 + proximity * 0.035;

      setTransformStyle(`translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`);
      setIsNear(true);
      setGlowIntensity(proximity);
    } else {
      setTransformStyle('translate3d(0, 0, 0) scale(1)');
      setIsNear(false);
      setGlowIntensity(0);
    }
  }, [containerMouse, isReducedMotion]);

  const isBrandAccent = index === 2; // "Package." / "প্যাকেজ।"

  return (
    <span
      ref={wordRef}
      className="inline-block relative cursor-default select-none transition-transform duration-300 ease-out will-change-transform animate-word-entrance"
      style={{
        transform: transformStyle,
        animationDelay: `${index * 0.16}s`,
        filter: isNear
          ? isBrandAccent
            ? `drop-shadow(0 4px 14px rgba(56, 189, 248, ${(glowIntensity * 0.55).toFixed(2)}))`
            : `drop-shadow(0 4px 12px rgba(37, 99, 235, ${(glowIntensity * 0.35).toFixed(2)}))`
          : 'none',
      }}
    >
      <span
        className={`inline-block transition-all duration-300 font-extrabold tracking-tight ${
          isBrandAccent
            ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent'
            : isNear
            ? 'text-blue-900'
            : 'text-slate-900'
        }`}
      >
        {word}
      </span>
      {/* Space between words */}
      <span className="inline-block w-2.5 sm:w-4" />
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
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const touchQuery = window.matchMedia('(hover: none)');
    setIsReducedMotion(motionQuery.matches || touchQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches || touchQuery.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const headlineWords = [
    t.heroHeadlinePart1,
    t.heroHeadlinePart2,
    t.heroHeadlinePart3,
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion) return;
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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white via-slate-50/90 to-blue-50/40 text-slate-900 shadow-sm border border-slate-200/90 p-6 sm:p-9 lg:p-11 mb-8 transition-all"
    >
      {/* 1. Very Soft Ambient Light Gradient Orbs (CSS Keyframe Floats with Low Opacity) */}
      <div className="absolute -top-20 -left-16 w-80 h-80 rounded-full bg-blue-300/15 blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute -bottom-24 right-4 w-96 h-96 rounded-full bg-indigo-300/15 blur-3xl pointer-events-none animate-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-200/20 blur-3xl pointer-events-none" />

      {/* 2. Interactive Cursor-Following Ambient Light Glow (Soft, never darkens) */}
      {localMouse && !isReducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${localMouse.x}px ${localMouse.y}px, rgba(59, 130, 246, 0.08), transparent 65%)`,
          }}
        />
      )}

      {/* 3. Subtle Vector Grid Pattern (Clean Government / Architecture Precision) */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #475569 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hero Content: Centered Vertically & Horizontally */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-blue-700 text-[11px] font-bold tracking-widest uppercase mb-4 shadow-2xs backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-sm shadow-blue-500/40" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Large Centered Interactive Headline */}
        <div className="my-2 flex justify-center w-full">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-900 drop-shadow-2xs flex flex-wrap items-center justify-center">
            {headlineWords.map((word, idx) => (
              <InteractiveWord
                key={`${word}-${idx}`}
                word={word}
                index={idx}
                containerMouse={globalMouse}
                isReducedMotion={isReducedMotion}
              />
            ))}
          </h2>
        </div>

        {/* Supporting Line */}
        <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl text-center">
          {t.heroSupporting}
        </p>

        {/* Action CTAs: Centered with Refined Hierarchy */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToUpload}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:shadow-blue-500/15 transition-all cursor-pointer group active:scale-[0.99]"
          >
            <span>{t.heroCtaStart}</span>
            <ArrowDown className="w-4 h-4 text-blue-100 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onScrollToRequirements}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300/90 font-semibold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer group"
          >
            <ListOrdered className="w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span>{t.heroCtaRequirements}</span>
          </button>
        </div>

        {/* Value Indicators: Clean Light Surface with Subtle Separators */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 w-full flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-700 font-semibold">{t.heroFeature1}</span>
          </div>

          <span className="hidden sm:inline-block text-slate-300 font-light">•</span>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-slate-700 font-semibold">{t.heroFeature2}</span>
          </div>

          <span className="hidden sm:inline-block text-slate-300 font-light">•</span>

          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-slate-700 font-semibold">{t.heroFeature3}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
