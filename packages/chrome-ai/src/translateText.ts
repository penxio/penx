import type { Translator } from './translator.types'

const languageTagToHumanReadable = (
  languageTag: string,
  targetLanguage: string = 'en',
) => {
  const displayNames = new Intl.DisplayNames([targetLanguage], {
    type: 'language',
  })
  return displayNames.of(languageTag)
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
) {
  let window: any = self
  const Translator = window.Translator as Translator
  const availability = await Translator.availability({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  })

  const languageDetector = await window.LanguageDetector.create()
  const { detectedLanguage, confidence } = (
    await languageDetector.detect(text)
  )[0]

  console.log(
    '=======detectedLanguage:',
    detectedLanguage,
    languageTagToHumanReadable(detectedLanguage, targetLang),
  )

  console.log('=========availability:', availability)

  if (availability === 'downloadable') {
    const translator = await Translator.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      monitor(monitor) {
        monitor.addEventListener('downloadprogress', (e: any) => {
          const pct = Math.floor((e.loaded || 0) * 100)
          console.log('=========pct:', pct)
        })
      },
    })
  }

  const translator = await window.Translator.create({
    sourceLanguage: sourceLang,
    targetLanguage: targetLang,
  })

  const translatedText = await translator.translate(text)
  return translatedText
}
