"use client";

import React, { useState } from "react";

// ==========================================
// 1. NEUMORPHIC CARD
// ==========================================
interface NeuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "raised" | "raised-sm" | "raised-lg" | "inset" | "flat";
  hoverEffect?: boolean;
  className?: string;
}

export function NeuCard({
  children,
  variant = "raised",
  hoverEffect = false,
  className = "",
  ...props
}: NeuCardProps) {
  const variantClass = {
    raised: "neu-raised",
    "raised-sm": "neu-raised-sm",
    "raised-lg": "neu-raised-lg",
    inset: "neu-inset",
    flat: "bg-[#E8F0F4]",
  }[variant];

  return (
    <div
      className={`rounded-[24px] p-6 ${variantClass} ${
        hoverEffect ? "neu-raised-hover cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ==========================================
// 2. NEUMORPHIC BUTTON
// ==========================================
interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "inset" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  pill?: boolean;
  children: React.ReactNode;
}

export function NeuButton({
  variant = "secondary",
  size = "md",
  pill = true,
  children,
  className = "",
  ...props
}: NeuButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs font-semibold gap-1.5",
    md: "px-6 py-3 text-sm font-semibold gap-2",
    lg: "px-8 py-4 text-base font-bold gap-2.5",
  }[size];

  const variantClasses = {
    primary: "neu-btn-primary",
    secondary: "neu-btn-secondary",
    inset:
      "neu-inset text-slate-700 active:scale-[0.98] transition-all hover:text-slate-900",
    danger:
      "bg-rose-500 text-white shadow-[0_8px_20px_rgba(244,63,94,0.35)] hover:bg-rose-600 active:scale-[0.98]",
    emerald:
      "bg-emerald-600 text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)] hover:bg-emerald-700 active:scale-[0.98]",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center select-none transition-all duration-200 ${
        pill ? "rounded-full" : "rounded-2xl"
      } ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ==========================================
// 3. NEUMORPHIC INPUT
// ==========================================
interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function NeuInput({
  label,
  icon,
  helperText,
  className = "",
  ...props
}: NeuInputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-2xl neu-input py-3.5 ${
            icon ? "pl-11 pr-4" : "px-4"
          } text-sm text-slate-800 placeholder-slate-400 font-medium ${className}`}
          {...props}
        />
      </div>
      {helperText && (
        <p className="text-xs text-slate-500 ml-1">{helperText}</p>
      )}
    </div>
  );
}

// ==========================================
// 4. NEUMORPHIC TOGGLE SWITCH
// ==========================================
interface NeuToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function NeuToggle({
  checked,
  onChange,
  label,
  description,
}: NeuToggleProps) {
  return (
    <label className="inline-flex items-center justify-between gap-4 cursor-pointer select-none">
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-slate-800">{label}</span>
          )}
          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
      <div
        onClick={() => onChange(!checked)}
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-250 ${
          checked ? "bg-[#3155FF]/90 shadow-inner" : "neu-inset"
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-[2px_2px_5px_rgba(0,0,0,0.18)] transform transition-transform duration-250 flex items-center justify-center ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {checked && (
            <div className="w-2 h-2 rounded-full bg-[#3155FF]" />
          )}
        </div>
      </div>
    </label>
  );
}

// ==========================================
// 5. NEUMORPHIC SLIDER
// ==========================================
interface NeuSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  formatValue?: (val: number) => string;
}

export function NeuSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  formatValue = (v) => `${v}`,
}: NeuSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
        {label && <span>{label}</span>}
        <span className="text-[#3155FF] font-extrabold">{formatValue(value)}</span>
      </div>
      <div className="relative flex items-center h-6">
        <div className="w-full h-3 neu-inset rounded-full relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3155FF] to-[#287BFF] rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute w-6 h-6 rounded-full bg-white shadow-[0_3px_8px_rgba(49,85,255,0.35),2px_2px_5px_rgba(120,140,155,0.3)] border-2 border-[#3155FF] pointer-events-none transition-all duration-150 -ml-3"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ==========================================
// 6. NEUMORPHIC TABS
// ==========================================
interface NeuTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function NeuTabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: NeuTabsProps) {
  return (
    <div
      className={`inline-flex p-1.5 rounded-full neu-inset gap-1.5 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
              isActive
                ? "neu-raised text-[#3155FF] shadow-[3px_3px_8px_rgba(120,140,155,0.22),-3px_-3px_8px_rgba(255,255,255,0.9)]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ==========================================
// 7. NEUMORPHIC BADGE
// ==========================================
interface NeuBadgeProps {
  variant?: "primary" | "emerald" | "amber" | "rose" | "purple" | "neutral";
  pill?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function NeuBadge({
  variant = "primary",
  pill = true,
  children,
  icon,
  className = "",
}: NeuBadgeProps) {
  const variantStyles = {
    primary:
      "bg-blue-50 text-[#3155FF] border border-blue-200/80 shadow-[2px_2px_5px_rgba(49,85,255,0.12)]",
    emerald:
      "bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-[2px_2px_5px_rgba(16,185,129,0.12)]",
    amber:
      "bg-amber-50 text-amber-600 border border-amber-200/80 shadow-[2px_2px_5px_rgba(245,158,11,0.12)]",
    rose: "bg-rose-50 text-rose-600 border border-rose-200/80 shadow-[2px_2px_5px_rgba(244,63,94,0.12)]",
    purple:
      "bg-purple-50 text-purple-600 border border-purple-200/80 shadow-[2px_2px_5px_rgba(139,92,246,0.12)]",
    neutral:
      "neu-inset text-slate-600 border border-white/60",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${
        pill ? "rounded-full" : "rounded-lg"
      } ${variantStyles} ${className}`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

// ==========================================
// 8. NEUMORPHIC PROGRESS BAR
// ==========================================
interface NeuProgressProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  color?: "blue" | "emerald" | "amber";
}

export function NeuProgress({
  value,
  label,
  showPercent = true,
  color = "blue",
}: NeuProgressProps) {
  const gradient = {
    blue: "from-[#3155FF] to-[#287BFF]",
    emerald: "from-emerald-500 to-teal-400",
    amber: "from-amber-400 to-orange-500",
  }[color];

  return (
    <div className="w-full space-y-1.5">
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs font-bold text-slate-600">
          {label && <span>{label}</span>}
          {showPercent && <span className="font-extrabold">{value}%</span>}
        </div>
      )}
      <div className="w-full h-3 neu-inset rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-[0_2px_6px_rgba(49,85,255,0.3)] transition-all duration-300`}
          style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}

// ==========================================
// 9. NEUMORPHIC STAT CARD
// ==========================================
interface NeuStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  subtitle?: string;
}

export function NeuStatCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}: NeuStatCardProps) {
  return (
    <NeuCard variant="raised" hoverEffect className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isPositive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <p className="text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
        )}
      </div>
    </NeuCard>
  );
}

// ==========================================
// 10. NEUMORPHIC MODAL
// ==========================================
interface NeuModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function NeuModal({ isOpen, onClose, title, children }: NeuModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg neu-raised-lg rounded-[28px] p-6 sm:p-8 space-y-6 relative border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
          <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full neu-inset flex items-center justify-center text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}
