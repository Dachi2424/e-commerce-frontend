import { useState, useRef, useEffect } from "react"
import { Globe } from "lucide-react"

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "RU", label: "Русский" },
  { code: "KA", label: "ქართული" },
] as const

type Props = {
  mobile?: boolean
}

function LanguageSwitcher({ mobile = false }: Props) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string>(() => localStorage.getItem("lang") || "EN")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mobile) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobile])

  function selectLanguage(code: string) {
    setCurrent(code)
    localStorage.setItem("lang", code)
    setOpen(false)
    // This only stores the preference for now — it doesn't translate
    // anything yet. See note at the bottom of this file.
  }

  if (mobile) {
    return (
      <div className="mobile-drawer__section">
        <span className="mobile-drawer__section-label">Language</span>
        <div className="lang-switcher__segmented">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-switcher__segment ${current === lang.code ? "lang-switcher__segment--active" : ""}`}
              onClick={() => selectLanguage(lang.code)}
            >
              {lang.code}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe size={18} />
        <span>{current}</span>
      </button>
      {open && (
        <div className="lang-switcher__panel">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              className={`lang-switcher__item ${current === lang.code ? "lang-switcher__item--active" : ""}`}
              onClick={() => selectLanguage(lang.code)}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher

/*
  When you're ready to wire up real translations:
    npm install react-i18next i18next
  Then replace the local `current` state with i18next's useTranslation()
  hook, and call i18n.changeLanguage(code) inside selectLanguage.
*/