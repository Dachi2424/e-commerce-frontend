import { useState, useEffect } from "react"
import "./PriceRangeSlider.scss"

type Props = {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

const COMMIT_DELAY_MS = 400

function PriceRangeSlider({ min, max, value, onChange }: Props) {
  // Local state updates instantly as the user drags, so the slider feels
  // responsive. The actual onChange (which triggers a refetch upstream)
  // only fires after they stop moving, so we're not hammering the API on
  // every pixel of drag.
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localValue[0] !== value[0] || localValue[1] !== value[1]) {
        onChange(localValue)
      }
    }, COMMIT_DELAY_MS)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue])

  function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = Math.min(Number(e.target.value), localValue[1] - 1)
    setLocalValue([next, localValue[1]])
  }

  function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = Math.max(Number(e.target.value), localValue[0] + 1)
    setLocalValue([localValue[0], next])
  }

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className="price-range-slider">
      <div className="price-range-slider__values">
        <span>${localValue[0]}</span>
        <span>${localValue[1]}</span>
      </div>
      <div className="price-range-slider__track-wrap">
        <div className="price-range-slider__track" />
        <div
          className="price-range-slider__track-fill"
          style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={handleMinChange}
          className="price-range-slider__input"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="price-range-slider__input"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}

export default PriceRangeSlider