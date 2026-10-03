import React from 'react';
import {
  Droplets,
  Dumbbell,
  BookOpen,
  Zap,
  Moon,
  Heart,
  Sparkles,
  Brain,
  Apple,
  Flame,
  CheckCircle2,
  Sunrise,
  Coffee,
  Bed,
  Award,
  Smile,
  LucideProps,
} from 'lucide-react';

export const HABIT_ICONS: Record<string, React.FC<LucideProps>> = {
  droplets: Droplets,
  dumbbell: Dumbbell,
  book: BookOpen,
  zap: Zap,
  moon: Moon,
  heart: Heart,
  sparkles: Sparkles,
  brain: Brain,
  apple: Apple,
  flame: Flame,
  check: CheckCircle2,
  sunrise: Sunrise,
  coffee: Coffee,
  bed: Bed,
  award: Award,
  smile: Smile,
};

export const COLOR_THEMES: Record<string, {
  bg: string;
  text: string;
  border: string;
  badge: string;
  active: string;
}> = {
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/20 text-rose-300',
    active: 'bg-rose-500 text-white',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300',
    active: 'bg-emerald-500 text-white',
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-500/20 text-indigo-300',
    active: 'bg-indigo-500 text-white',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300',
    active: 'bg-amber-500 text-slate-950 font-bold',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    badge: 'bg-cyan-500/20 text-cyan-300',
    active: 'bg-cyan-500 text-slate-950 font-bold',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300',
    active: 'bg-purple-500 text-white',
  },
};
