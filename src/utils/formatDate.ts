export const formatDate = (date: string | Date): string => {
  const parsedDate = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(parsedDate)
}
