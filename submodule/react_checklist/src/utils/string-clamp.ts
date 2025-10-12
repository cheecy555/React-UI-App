export function strClamp(s: string, length: number) {
    if (!s || s.length <= length) return s
  
    return s.slice(0, length) + '\u2026'
  }