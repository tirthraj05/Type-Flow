// Mock AI generator for short paragraphs (150-300 chars)
const SAMPLE_TOPICS = [
  'A calm morning at the seaside with gulls circling above the waves',
  'A small cafe where strangers share stories over strong coffee',
  'An early autumn walk under a canopy of colorful leaves',
  'A quiet library filled with old books and a soft hush',
  'A short reflection on learning something new each day',
  'A vivid description of a market with spices and colors'
]

export function generateText(level = 'medium'){
  // level parameter can influence length or complexity; keep simple.
  const min = 150
  const max = 260
  const len = Math.floor(Math.random() * (max - min + 1)) + min
  // Build a paragraph by repeating/combining topic sentences until length reached
  let out = ''
  while(out.length < len){
    const t = SAMPLE_TOPICS[Math.floor(Math.random() * SAMPLE_TOPICS.length)]
    const sentence = t + '. '
    out += sentence
    if(Math.random() < 0.25) out += 'It feels somehow familiar, like a small, private memory. '
  }
  // trim to exact length without cutting words awkwardly
  out = out.slice(0, len)
  // ensure it ends cleanly
  out = out.replace(/\s+$/,'')
  if(!/[.!?]$/.test(out)) out = out + '.'
  return out
}
