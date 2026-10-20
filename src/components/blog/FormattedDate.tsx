export function FormattedDate({date, month = 'short'}: {date: Date; month?: 'short' | 'long'}) {
  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleDateString('en-us', {
        year: 'numeric',
        month,
        day: 'numeric',
      })}
    </time>
  )
}
