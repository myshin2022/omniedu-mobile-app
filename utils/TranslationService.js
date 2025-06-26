// utils/TranslationService.js
const translateAnalysis = async (englishContent) => {
  // GPT API 활용한 투자 전문 번역
  const koreanContent = await gpt.translate({
    text: englishContent,
    from: 'en',
    to: 'ko',
    domain: 'finance' // 금융 전문 용어
  })
  return koreanContent
}
