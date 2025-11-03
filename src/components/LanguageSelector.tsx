import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Language } from '../i18n/locales'

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const languages: { code: Language; label: string }[] = [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center justify-center relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-200 hover:bg-amber-200 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-sm"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-amber-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{currentLanguage?.label}</span>
        <svg
          className={`w-4 h-4 text-amber-800 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-[min(200px,90vw)] min-w-[160px] bg-white rounded-lg shadow-xl border-2 border-amber-300 overflow-hidden z-50" style={{
          animation: 'fadeIn 0.2s ease-out forwards'
        }}>
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`w-full px-4 py-3 text-left text-sm sm:text-base font-semibold transition-colors duration-150 ${
                language === lang.code
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-amber-800 hover:bg-amber-50'
              } ${index !== languages.length - 1 ? 'border-b border-amber-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span>{lang.label}</span>
                {language === lang.code && (
                  <svg
                    className="w-5 h-5 text-amber-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

