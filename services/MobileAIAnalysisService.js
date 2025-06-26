// services/MobileAIAnalysisService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GEMINI_API_KEY } from '@env'; // ⭐ .env에서 가져오기

class MobileAIAnalysisService {
  constructor() {
    this.genAI = null;
    this.initializeAPI();
  }

  initializeAPI() {
    try {
      if (GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        console.log('✅ Gemini API 초기화 완료');
      } else {
        console.warn('⚠️ .env 파일에서 GEMINI_API_KEY를 찾을 수 없습니다');
      }
    } catch (error) {
      console.error('❌ Gemini API 초기화 실패:', error);
    }
  }

  async generateAnalysis(ticker, currentPrice, companyName) {
    try {
      // 캐시 확인
      const cacheKey = `ai_analysis_${ticker}`;
      const cachedAnalysis = await AsyncStorage.getItem(cacheKey);
      
      if (cachedAnalysis) {
        const parsed = JSON.parse(cachedAnalysis);
        const isExpired = Date.now() - parsed.timestamp > 3600000; // 1시간
        
        if (!isExpired) {
          console.log(`📚 ${ticker} 캐시된 분석 사용`);
          return parsed.analysis;
        }
      }

      // AI 분석 생성
      if (!this.genAI) {
        console.log('🔄 API 키 없음 - 기본 분석 제공');
        return this.generateFallbackAnalysis(ticker, companyName, currentPrice);
      }

      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
주식 투자 분석을 한국어로 작성해주세요:

종목: ${companyName} (${ticker})
현재가: ${currentPrice}
날짜: ${new Date().toLocaleDateString('ko-KR')}

다음 형식으로 간결하고 실용적인 분석을 제공해주세요:

📊 현재 상황
- 주가 동향 및 시장 위치
- 주요 재무 지표 추정

💡 투자 포인트
- 긍정적 요소 2-3개
- 주의할 점 2-3개

🎯 투자 의견
- 단기/장기 전망
- 추천 투자 전략

⚠️ 리스크 요소
- 주요 위험 요인들

300자 내외로 간결하게 작성해주세요.
`;

      const result = await model.generateContent(prompt);
      const analysis = result.response.text();

      // 캐시 저장
      const cacheData = {
        analysis,
        timestamp: Date.now(),
        ticker,
      };
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));

      console.log(`✨ ${ticker} AI 분석 생성 완료`);
      return analysis;

    } catch (error) {
      console.error(`❌ ${ticker} AI 분석 생성 실패:`, error);
      return this.generateFallbackAnalysis(ticker, companyName, currentPrice);
    }
  }

  generateFallbackAnalysis(ticker, companyName, currentPrice) {
    const fallbacks = [
      `📊 ${companyName} (${ticker}) 분석

현재가: ${currentPrice}

💡 투자 포인트
- 안정적인 사업 모델과 시장 지위
- 꾸준한 성장 잠재력 보유
- 장기 투자 관점에서 검토 권장

🎯 투자 의견
투자 전 충분한 리서치와 개인 투자 성향을 고려하여 신중한 판단이 필요합니다.

⚠️ 리스크 요소
- 시장 변동성 및 경제 환경 변화
- 업종별 특성 및 경쟁 환경`,

      `📈 ${companyName} 투자 분석

${ticker} | 현재가: ${currentPrice}

💡 주요 특징
- 업계 내 경쟁력 있는 포지션
- 기술 혁신 및 시장 확장 가능성
- 재무 안정성 기반 성장 추진

🎯 전망
중장기적 관점에서 성장 가능성이 있으나, 시장 상황과 개별 기업 리스크를 종합 고려한 투자 판단 필요

⚠️ 주의사항
투자 결정 전 최신 재무제표 및 시장 동향 분석 권장`,

      `🔍 ${companyName} (${ticker}) 종합 분석

현재 주가: ${currentPrice}

📊 투자 관점
- 사업 영역의 성장성 및 수익성 검토
- 시장 내 차별화된 경쟁 우위 보유
- 안정적 현금 흐름 기반 배당 정책

💼 추천 전략
분할 매수를 통한 리스크 분산 및 장기 보유 관점에서 접근

⚠️ 위험 요소
거시경제 변화, 규제 환경, 업계 경쟁 심화 등을 지속 모니터링 필요`
    ];

    const randomIndex = Math.floor(Math.random() * fallbacks.length);
    return fallbacks[randomIndex];
  }

  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const analysisKeys = keys.filter(key => key.startsWith('ai_analysis_'));
      await AsyncStorage.multiRemove(analysisKeys);
      console.log('🗑️ AI 분석 캐시 삭제 완료');
    } catch (error) {
      console.error('❌ 캐시 삭제 실패:', error);
    }
  }
}

export default new MobileAIAnalysisService();
