import { GoogleGenAI } from '@google/genai'
import { writeFile } from 'node:fs/promises'

const ai = new GoogleGenAI({
  apiKey: process.env.NETLIFY_AI_GATEWAY_KEY,
  httpOptions: { baseUrl: process.env.NETLIFY_AI_GATEWAY_BASE_URL?.replace(/\/$/, '') },
})

const PALETTE =
  'Strict limited palette: warm cream paper (#F6F0E6), soft oat (#ECE2D3), deep warm ink brown (#221D18), muted olive green (#5C6349), dusty terracotta (#B4604A), antique gold (#C79A4B). No neon, no purple, no blue gradients, desaturated and warm throughout.'

const STYLE =
  'Hand-painted gouache and ink illustration with visible paper grain and subtle brush texture, fine ink linework, flat layered shapes, editorial letterpress poster feeling. Not photorealistic, not 3D render, not vector-flat corporate clipart.'

const PORTRAIT = (desc, accent) =>
  `Square 1:1 illustrated portrait bust of ${desc}, centred, facing the viewer, shoulders up, calm friendly expression, wearing understated wedding-guest attire. Flat ${accent} background with a faint hand-drawn botanical wreath motif behind the head. Simple, bold, and highly legible when shrunk to a 90 pixel circle: strong silhouette, high contrast against the background, no small fiddly detail, no text, no lettering, no watermark. ${STYLE} ${PALETTE}`

const jobs = [
  {
    file: 'public/img/hero-venue.png',
    prompt: `Wide panoramic illustration of a romantic countryside wedding venue at golden hour: an old stone barn with tall arched wooden doors, strings of warm bistro lights looping between two large oak trees, long table set for a feast on a meadow of wild grasses, cosmos and yarrow wildflowers in the foreground, distant soft hills, a few swallows in a pale sky. Empty of people. Composition leaves calm open sky in the upper left for text overlay. No text, no lettering, no watermark, no logos. ${STYLE} ${PALETTE}`,
  },
  {
    file: 'public/img/friday-supper.png',
    prompt: `Cosy evening illustration of an informal Friday-night welcome supper the night before a wedding: a long trestle table under a pergola strung with warm lights, mismatched chairs, carafes of wine, big shared platters, terracotta pots of olive and rosemary, candles in glass jars, dusk sky with the first stars. Empty of people, inviting and lived-in. No text, no lettering, no watermark. ${STYLE} ${PALETTE}`,
  },
  { file: 'public/img/players/player-1.png', prompt: PORTRAIT('a person with cropped dark curly hair and warm brown skin', 'muted olive green') },
  { file: 'public/img/players/player-2.png', prompt: PORTRAIT('a person with long wavy auburn hair and freckles', 'dusty terracotta') },
  { file: 'public/img/players/player-3.png', prompt: PORTRAIT('a person with a neat silver beard, glasses and light skin', 'antique gold') },
  { file: 'public/img/players/player-4.png', prompt: PORTRAIT('a person with dark hair in a low bun and a small pearl earring', 'deep warm ink brown') },
]

async function run({ file, prompt }) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: prompt,
      })
      const parts = response.candidates?.[0]?.content?.parts ?? []
      const image = parts.find((p) => p.inlineData)
      if (!image) throw new Error('no inline image data returned')
      await writeFile(file, Buffer.from(image.inlineData.data, 'base64'))
      console.log(`ok   ${file}`)
      return
    } catch (error) {
      console.log(`retry ${file} (attempt ${attempt}): ${error.message}`)
      if (attempt === 3) console.log(`FAIL ${file}`)
      else await new Promise((r) => setTimeout(r, 2500 * attempt))
    }
  }
}

await Promise.all(jobs.map(run))
console.log('done')
