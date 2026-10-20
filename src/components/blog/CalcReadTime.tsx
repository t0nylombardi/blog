export const CalcReadingTime = ({content}: {content: string}) => {
  const cleanedContent = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  const words = cleanedContent.trim().split(/\s+/).filter(Boolean).length

  return <span>{Math.max(1, Math.ceil(words / 225))} min read</span>
}
