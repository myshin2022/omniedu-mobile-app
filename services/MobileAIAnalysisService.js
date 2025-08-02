// services/MobileAIAnalysisService.js (Flask 백엔드 API 연동 버전)
import axios from 'axios'; // axios 임포트
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage는 로컬 캐시에 사용 (선택 사항)
// ❌ AI API 키 임포트 제거: @google/generative-ai, @env 모듈 임포트도 제거됩니다.
// import { GoogleGenerativeAI } from '@google/generative-ai'; // 제거!
// import { GEMINI_API_KEY, OPENAI_API_KEY } from '@env'; // 제거!

class MobileAIAnalysisService {
  constructor() {
    this.BASE_URL = 'https://omnieduglobal.com'; // 님의 Flask 서버 URL (Nginx/Cloudflare를 통해 접근)
    // ❌ Gemini/OpenAI 초기화 로직 제거: 모바일 앱에서 직접 AI 호출 안 함
    // this.genAI = null;
    // this.initializeGemini();
    console.log(`✅ MobileAIAnalysisService 초기화 완료. BASE_URL: ${this.BASE_URL}`);
  }

  // ❌ saveAnalysisToFlaskDB 함수 제거: Flask 백엔드의 generate_ai_insight()가 DB 저장을 담당합니다.
  // async saveAnalysisToFlaskDB(symbol, analysisResult, userId = null) { ... }

  // ❌ generateAIAnalysis 함수 제거: AI 분석 생성은 Flask 백엔드에서만 담당합니다.
  // async generateAnalysis(symbol, currentPrice, companyName, userId = null) { ... }


  // AI 분석을 Flask 백엔드로부터 가져오는 핵심 함수 (생성 및 DB 저장/캐싱은 Flask가 담당)
  async getAIAnalysisFromFlask(symbol, currentSimDate, currentPrice) { // currentPrice 추가 (폴백용)
    try {
      console.log(`🤖 ${symbol} AI 분석을 Flask 백엔드에서 요청 중 (날짜: ${currentSimDate})...`);
      
      // (선택 사항) 모바일 앱 로컬 캐시 확인 (백엔드 호출 줄임)
      const cachedData = await AsyncStorage.getItem(`ai_analysis_${symbol}_${currentSimDate}`);
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        // 캐시 만료 시간 (예: 1일) 설정
        const cacheExpiryTime = 24 * 60 * 60 * 1000; // 24시간
        if (Date.now() - parsedCache.timestamp < cacheExpiryTime) {
          console.log(`✨ ${symbol} AI 분석 로컬 캐시에서 로드 완료.`);
          return parsedCache.analysis;
        }
      }

      // Flask 백엔드의 기존 API 엔드포인트 호출
      // 이 엔드포인트가 Flask의 generate_ai_insight()를 호출하고 DB 캐싱을 처리합니다.
      const response = await axios.get(`${this.BASE_URL}/api/stock_data/${symbol}/${currentSimDate}`);

      if (response.data && response.data.ai_insight) {
        const analysisResult = response.data.ai_insight;
        console.log(`✅ ${symbol} AI 분석 Flask에서 수신 완료.`);

        // 모바일 앱 로컬에 캐시 저장 (백엔드 호출 후)
        const cacheData = {
          analysis: analysisResult,
          timestamp: Date.now(),
          source: 'flask_api'
        };
        await AsyncStorage.setItem(`ai_analysis_${symbol}_${currentSimDate}`, JSON.stringify(cacheData));
        
        return analysisResult;
      } else {
        console.warn(`⚠️ ${symbol} Flask로부터 유효한 AI 분석 데이터를 받지 못했습니다.`, response.data);
        return this.getFallbackAnalysis(symbol, currentPrice, 'Flask 응답 오류'); // 예시: currentPrice는 인자로 받아야 함
      }
    } catch (error) {
      console.error(`❌ ${symbol} Flask API 호출 실패:`, error);
      let errorMessage = 'AI 분석을 가져올 수 없습니다: 네트워크 오류 또는 서버 문제.';
      if (error.response) {
        errorMessage = `서버 오류 (${error.response.status}): ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = '서버로부터 응답이 없습니다. Flask 백엔드가 실행 중인지 확인하세요.';
      }
      return this.getFallbackAnalysis(symbol, currentPrice, errorMessage);
    }
  }

  // 대체 분석 (폴백) 제공 함수 (오류 발생 시)
  getFallbackAnalysis(symbol, currentPrice, errorMessage = '알 수 없는 오류') {
    return `AI 코치 (오류): 현재 분석을 가져올 수 없습니다. (${errorMessage})
${symbol}: $${currentPrice || '가격 없음'}
**문제:** 서버 연결 또는 데이터 처리 중 오류 발생.`;
  }
}

// 싱글톤 인스턴스 생성 및 export
const mobileAIAnalysisService = new MobileAIAnalysisService();
export default mobileAIAnalysisService;