// apiTest.js - 임시 테스트용 파일
import { GEMINI_API_KEY, OPENAI_API_KEY } from '@env'

console.log('🔑 API 키 테스트:')
console.log('Gemini:', GEMINI_API_KEY ? '✅ 로딩됨' : '❌ 없음')
console.log('OpenAI:', OPENAI_API_KEY ? '✅ 로딩됨' : '❌ 없음')

if (GEMINI_API_KEY) {
  console.log('Gemini 시작부분:', GEMINI_API_KEY.substring(0, 8) + '...')
}

if (OPENAI_API_KEY) {
  console.log('OpenAI 시작부분:', OPENAI_API_KEY.substring(0, 8) + '...')
}

export default function ApiTestScreen() {
  return null // 화면 없음, 콘솔만 사용
}
