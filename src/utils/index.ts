export function roundToNearest1hr() {
  const minutes = 60
  const ms = 1000 * 60 * minutes

  return new Date(Math.ceil(new Date().getTime() / ms) * ms)
}

export function add1Hour(date: Date) {
  return new Date(date.getTime() + 60 * 60 * 1000)
}

export function formatDate(date: Date) {
  const mm = date.getMonth() + 1
  const dd = date.getDate()

  return [
    date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd,
  ].join('-')
}

export function formatTimeFromDate(date: Date) {
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours}:${(minutes > 9 ? '' : '0') + minutes}`
}

export function arrayRange(start: number, stop: number, step: number = 1) {
  const result = []
  for (let i = start; i <= stop; i += step) {
    result.push(i)
  }
  return result
}
