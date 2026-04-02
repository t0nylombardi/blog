type Variant = 'hero' | 'wide' | 'inline' | 'left' | 'right'

type Props = {
  src: string
  alt?: string
  variant?: Variant
  width?: number
  height?: number
  className?: string
}

export function Image({src, alt, variant = 'inline', width, height, className}: Props) {
  const mediaClassName = ['blog-image__media', className].filter(Boolean).join(' ')

  return (
    <figure className={`blog-image blog-image--${variant}`}>
      <img src={src} alt={alt} width={width} height={height} className={mediaClassName} />
    </figure>
  )
}
