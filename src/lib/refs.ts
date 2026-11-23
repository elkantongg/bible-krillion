const BOOKS: Record<string, string> = {
  Ge: 'Genesis', Ex: 'Exodus', Lev: 'Leviticus', Nu: 'Numbers', Dt: 'Deuteronomy', Jos: 'Joshua', Jdg: 'Judges', Ru: 'Ruth',
  '1Sa': '1 Samuel', '2Sa': '2 Samuel', '1Ki': '1 Kings', '2Ki': '2 Kings', '1Ch': '1 Chronicles', '2Ch': '2 Chronicles',
  Ezr: 'Ezra', Ne: 'Nehemiah', Est: 'Esther', Job: 'Job', Ps: 'Psalm', Pr: 'Proverbs', Ec: 'Ecclesiastes', Ecc: 'Ecclesiastes',
  Song: 'Song of Songs', SS: 'Song of Songs', Isa: 'Isaiah', Jer: 'Jeremiah', La: 'Lamentations', Eze: 'Ezekiel', Da: 'Daniel',
  Hos: 'Hosea', Joel: 'Joel', Am: 'Amos', Ob: 'Obadiah', Jon: 'Jonah', Mic: 'Micah', Na: 'Nahum', Hab: 'Habakkuk',
  Zep: 'Zephaniah', Hag: 'Haggai', Zec: 'Zechariah', Mal: 'Malachi', Mt: 'Matthew', Mk: 'Mark', Lk: 'Luke', Jn: 'John',
  Ac: 'Acts', Ro: 'Romans', Rom: 'Romans', '1Co': '1 Corinthians', '2Co': '2 Corinthians', Gal: 'Galatians', Eph: 'Ephesians',
  Php: 'Philippians', Col: 'Colossians', '1Th': '1 Thessalonians', '2Th': '2 Thessalonians', '1Ti': '1 Timothy', '2Ti': '2 Timothy',
  Tit: 'Titus', Phm: 'Philemon', Heb: 'Hebrews', Jas: 'James', '1Pe': '1 Peter', '2Pe': '2 Peter', '1Jn': '1 John', '2Jn': '2 John',
  '3Jn': '3 John', Jude: 'Jude', Rev: 'Revelation',
}

/** "1Sa17" → "1 Samuel 17" */
export function fmtRef(ref: string): string {
  const m = ref.match(/^(\d?[A-Za-z]+?)(\d+)(?::.*)?$/)
  if (!m) return ref
  const book = BOOKS[m[1]] ?? m[1]
  return `${book} ${m[2]}`
}

/** a link to read the chapter (free, no account) */
export function readUrl(ref: string): string {
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(fmtRef(ref))}&version=NIV`
}
