export function computePastDate (timedelta, unit) {
  if (unit === 'years') {
    const date = new Date();
    date.setFullYear(date.getFullYear() - timedelta)
    return date;
  }

  const currentDateTime = Date.now() / 1000
  const pastDate = new Date((currentDateTime - timedelta) * 1000)

  return `${pastDate.getDate()}-${pastDate.getMonth() + 1}-${pastDate.getFullYear()}`
}
