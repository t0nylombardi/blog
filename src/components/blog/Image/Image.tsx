type Variant = 'hero' | 'wide' | 'inline' | 'left' | 'right'

export function Image({src, alt, variant = 'inline'}: {src: string; alt?: string; variant?: Variant}) {
  return (
    <div className={`image image--${variant}`}>
      <img src={src} alt={alt} />
    </div>
  )
}
