import { useState, useRef, useEffect, type PointerEvent, type WheelEvent } from "react"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import "./ImageSlider.scss"

type Props = {
  images: string[]
  initialIndex: number
  onClose: () => void
}

const SWIPE_THRESHOLD = 90
const MIN_ZOOM = 1
const MAX_ZOOM = 3

function ImageSlider({ images, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [visible, setVisible] = useState(false)

  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const panStart = useRef({ x: 0, y: 0 })
  const isPanningRef = useRef(false)

  // Mount at opacity 0, then flip to visible on the next tick so the
  // opacity transition actually has something to animate from.
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  function handleClose() {
    setVisible(false)
    // Wait for the fade-out to finish before actually unmounting.
    setTimeout(onClose, 300)
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowLeft") goTo(index - 1)
      if (e.key === "ArrowRight") goTo(index + 1)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  function resetZoom() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function goTo(nextIndex: number) {
    const clamped = (nextIndex + images.length) % images.length
    setIndex(clamped)
    resetZoom()
  }

  function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    dragStart.current = { x: e.clientX, y: e.clientY }
    panStart.current = pan
    isPanningRef.current = zoom > 1
    setIsDragging(true)
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y

    if (isPanningRef.current) {
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy })
    } else {
      setDragOffset(dx)
    }
  }

  function handlePointerUp() {
    if (!isPanningRef.current) {
      if (dragOffset > SWIPE_THRESHOLD) {
        goTo(index - 1)
      } else if (dragOffset < -SWIPE_THRESHOLD) {
        goTo(index + 1)
      }
      setDragOffset(0)
    }
    dragStart.current = null
    setIsDragging(false)
  }

  function handleWheel(e: WheelEvent<HTMLDivElement>) {
    e.preventDefault()
    setZoom((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.002))
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  function handleDoubleClick() {
    if (zoom > 1) {
      resetZoom()
    } else {
      setZoom(2)
    }
  }

  return (
    <div className={`image-slider ${visible ? "image-slider--visible" : ""}`} onClick={handleClose}>
      <button type="button" className="image-slider__close" onClick={handleClose} aria-label="Close">
        <X size={24} />
      </button>

      <div className="image-slider__zoom-controls" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - 0.5))} aria-label="Zoom out">
          <ZoomOut size={18} />
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + 0.5))} aria-label="Zoom in">
          <ZoomIn size={18} />
        </button>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="image-slider__nav image-slider__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              goTo(index - 1)
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            type="button"
            className="image-slider__nav image-slider__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              goTo(index + 1)
            }}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div
        className="image-slider__stage"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={images[index]}
          alt=""
          className="image-slider__image"
          style={{
            transform: `translate(${pan.x + dragOffset}px, ${pan.y}px) scale(${zoom})`,
            transition: isDragging ? "none" : "transform 0.2s ease",
            cursor: zoom > 1 ? "grab" : "default",
          }}
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <div className="image-slider__thumbnails" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`image-slider__thumbnail ${i === index ? "image-slider__thumbnail--active" : ""}`}
              onClick={() => goTo(i)}
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageSlider