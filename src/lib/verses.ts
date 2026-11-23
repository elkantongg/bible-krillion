/** short King James Version verses (public domain) — one per day on the home screen */
export const VERSES: [string, string][] = [
  ['Launch out into the deep, and let down your nets for a draught.', 'Luke 5:4'],
  ['Thy word is a lamp unto my feet, and a light unto my path.', 'Psalm 119:105'],
  ['Deep calleth unto deep at the noise of thy waterspouts.', 'Psalm 42:7'],
  ['The light shineth in darkness; and the darkness comprehended it not.', 'John 1:5'],
  ['Be still, and know that I am God.', 'Psalm 46:10'],
  ['Come ye after me, and I will make you to become fishers of men.', 'Mark 1:17'],
  ['O the depth of the riches both of the wisdom and knowledge of God!', 'Romans 11:33'],
  ['Thy way is in the sea, and thy path in the great waters.', 'Psalm 77:19'],
  ['He will turn again, he will have compassion upon us… and thou wilt cast all their sins into the depths of the sea.', 'Micah 7:19'],
  ['The kingdom of heaven is like unto a merchant man, seeking goodly pearls.', 'Matthew 13:45'],
  ['If I take the wings of the morning, and dwell in the uttermost parts of the sea; even there shall thy hand lead me.', 'Psalm 139:9–10'],
  ['When thou passest through the waters, I will be with thee.', 'Isaiah 43:2'],
  ['Search the scriptures; for… they are they which testify of me.', 'John 5:39'],
  ['Thy word have I hid in mine heart, that I might not sin against thee.', 'Psalm 119:11'],
  ['The grass withereth, the flower fadeth: but the word of our God shall stand for ever.', 'Isaiah 40:8'],
  ['What manner of man is this, that even the wind and the sea obey him!', 'Mark 4:41'],
  ['Cast thy bread upon the waters: for thou shalt find it after many days.', 'Ecclesiastes 11:1'],
  ['The earth shall be full of the knowledge of the LORD, as the waters cover the sea.', 'Isaiah 11:9'],
  ['Study to shew thyself approved unto God, a workman that needeth not to be ashamed.', '2 Timothy 2:15'],
  ['Lord, to whom shall we go? thou hast the words of eternal life.', 'John 6:68'],
  ['Children, have ye any meat? … Cast the net on the right side of the ship, and ye shall find.', 'John 21:5–6'],
]
export function verseOfDay(n: number): [string, string] {
  return VERSES[((n % VERSES.length) + VERSES.length) % VERSES.length]
}

/** KJV verses about knowledge and wisdom — the cover's epigraph, one per day */
export const KNOWLEDGE_VERSES: [string, string][] = [
  ['The fear of the LORD is the beginning of knowledge.', 'Proverbs 1:7'],
  ['O the depth of the riches both of the wisdom and knowledge of God!', 'Romans 11:33'],
  ['For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.', 'Proverbs 2:6'],
  ['The heart of the prudent getteth knowledge; and the ear of the wise seeketh knowledge.', 'Proverbs 18:15'],
  ['In whom are hid all the treasures of wisdom and knowledge.', 'Colossians 2:3'],
  ['It is the glory of God to conceal a thing: but the honour of kings is to search out a matter.', 'Proverbs 25:2'],
  ['But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ.', '2 Peter 3:18'],
  ['The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.', 'Proverbs 9:10'],
  ['Study to shew thyself approved unto God, a workman that needeth not to be ashamed.', '2 Timothy 2:15'],
  ['The earth shall be full of the knowledge of the LORD, as the waters cover the sea.', 'Isaiah 11:9'],
]
export function knowledgeVerseOfDay(n: number): [string, string] {
  const L = KNOWLEDGE_VERSES.length
  return KNOWLEDGE_VERSES[(((n - 1) % L) + L) % L]
}
