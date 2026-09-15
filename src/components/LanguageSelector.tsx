import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageOption } from '../i18n';

interface LanguageSelectorProps {
  compact?: boolean;
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  compact = false,
  className = '',
  showLabel = true,
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = i18n.language || 'en';
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: LanguageOption) => {
    i18n.changeLanguage(lang.code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t('common.selectLanguage', 'Select Language')}
        className={`inline-flex items-center gap-2 rounded-lg font-bold transition-all cursor-pointer border shadow-2xs ${
          compact
            ? 'px-2.5 py-1.5 text-xs bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            : 'px-3 py-2 text-xs bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-blue-500 ring-offset-1 focus:outline-none focus:ring-2 focus:ring-blue-600'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span className="font-bold text-slate-900 tracking-tight">
          {currentLang.nativeName}
        </span>
        {showLabel && !compact && (
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            ({currentLang.name})
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white shadow-xl border border-slate-200 ring-1 ring-black/5 z-50 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {t('common.selectLanguage', 'Select Language')}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
              6 Languages
            </span>
          </div>

          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  role="menuitem"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-50/80 text-blue-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base leading-none" aria-hidden="true">
                      {lang.flag}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold tracking-tight text-slate-900 group-hover:text-blue-700">
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {lang.name} • {lang.script}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/70 text-[10px] text-slate-500 leading-tight">
            <span>Instant switch • Localized under RFCTLARR Act 2013</span>
          </div>
        </div>
      )}
    </div>
  );
};
