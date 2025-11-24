import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleError = () => {
    console.error('❌ Image failed to load:', props.src);
    setDidError(true)
  }

  const handleLoad = () => {
    console.log('✅ Image loaded successfully:', props.src);
    setIsLoaded(true)
  }

  const { src, alt, style, className, ...rest } = props

  // If no src provided, show nothing (invisible until loaded)
  if (!src) {
    return (
      <div
        className={`inline-flex items-center justify-center bg-transparent ${className ?? ''}`}
        style={{ ...style, opacity: 0 }}
      >
      </div>
    );
  }

  // If error, show nothing (invisible)
  return didError ? (
    <div
      className={`inline-flex items-center justify-center bg-transparent ${className ?? ''}`}
      style={{ ...style, opacity: 0 }}
    >
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out'
      }} 
      {...rest} 
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}