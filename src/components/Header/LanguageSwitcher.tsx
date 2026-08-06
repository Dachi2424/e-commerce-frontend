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
  const [closing, setClosing] = useState(false)
  const [current, setCurrent] = useState<string>(() => localStorage.getItem("lang") || "EN")
  const ref = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (mobile) return
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setClosing(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobile])

  // Cancel any pending open/close timeout if the component unmounts
  // mid-animation.
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  function selectLanguage(code: string) {
    setCurrent(code)
    localStorage.setItem("lang", code)
    setOpen(false)
    setClosing(false)
    // This only stores the preference for now — it doesn't translate
    // anything yet. See note at the bottom of this file.
  }

  function toggleProfile(){
    // Cancel any pending close from a moment ago — otherwise it fires
    // later and overrides whatever state a fast follow-up click already set.
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }

    // Three real states, not two: closed, fully open, or mid-close.
    // Only a fully-open panel should start closing — clicking while it's
    // ALREADY mid-close means "I changed my mind, snap back open," not
    // "close it again."
    const isFullyOpen = open && !closing

    if (isFullyOpen) {
      setClosing(true)
      closeTimeoutRef.current = setTimeout(() => {
        setOpen(false)
        setClosing(false)
        closeTimeoutRef.current = null
      }, 400)
    } else {
      setClosing(false)
      setOpen(true)
    }
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
        onClick={() => toggleProfile()}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe size={18} />
        <span>{current}</span>
      </button>
      {open && (
        <div className={`lang-switcher__panel ${closing ? "lang-switcher__panel--closing" : ""}`}>
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