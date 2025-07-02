// utils/logger.js
class SmartLogger {
  constructor() {
    this.isDev = __DEV__;
    this.logLevel = this.isDev ? 'debug' : 'error';
    this.enabledCategories = {
      API: true,          // API 호출 로그
      NAVIGATION: false,  // 네비게이션 로그 (너무 많아서 끔)
      ERROR: true,        // 에러 로그
      USER_ACTION: true,  // 사용자 액션 로그
      DEBUG: this.isDev,  // 디버그 로그 (개발시에만)
      PERFORMANCE: false  // 성능 로그 (필요시에만)
    };
  }

  // 카테고리별 로깅
  api(message, data = null) {
    if (this.enabledCategories.API) {
      console.log(`🌐 [API] ${message}`, data ? data : '');
    }
  }

  error(message, error = null) {
    if (this.enabledCategories.ERROR) {
      console.error(`❌ [ERROR] ${message}`, error ? error : '');
    }
  }

  userAction(message, data = null) {
    if (this.enabledCategories.USER_ACTION) {
      console.log(`👆 [USER] ${message}`, data ? data : '');
    }
  }

  debug(message, data = null) {
    if (this.enabledCategories.DEBUG) {
      console.log(`🐛 [DEBUG] ${message}`, data ? data : '');
    }
  }

  navigation(message, data = null) {
    if (this.enabledCategories.NAVIGATION) {
      console.log(`🧭 [NAV] ${message}`, data ? data : '');
    }
  }

  performance(message, data = null) {
    if (this.enabledCategories.PERFORMANCE) {
      console.log(`⚡ [PERF] ${message}`, data ? data : '');
    }
  }

  // 개발 중에만 임시로 켜는 로그
  temp(message, data = null) {
    if (this.isDev) {
      console.log(`🔧 [TEMP] ${message}`, data ? data : '');
    }
  }

  // 로그 카테고리 동적 제어
  enableCategory(category) {
    this.enabledCategories[category] = true;
    console.log(`📝 로그 카테고리 활성화: ${category}`);
  }

  disableCategory(category) {
    this.enabledCategories[category] = false;
    console.log(`🔇 로그 카테고리 비활성화: ${category}`);
  }

  // 모든 로그 켜기/끄기
  enableAll() {
    Object.keys(this.enabledCategories).forEach(key => {
      this.enabledCategories[key] = true;
    });
    console.log('📢 모든 로그 활성화');
  }

  disableAll() {
    Object.keys(this.enabledCategories).forEach(key => {
      this.enabledCategories[key] = false;
    });
    // 에러 로그는 항상 켜두기
    this.enabledCategories.ERROR = true;
    console.log('🔇 모든 로그 비활성화 (에러 제외)');
  }

  // 현재 로그 설정 보기
  showConfig() {
    console.log('📋 현재 로그 설정:');
    Object.entries(this.enabledCategories).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? '✅' : '❌'}`);
    });
  }
}

// 전역 로거 인스턴스 생성
const logger = new SmartLogger();

export default logger;

// 사용 예시:
/*
import logger from '../utils/logger';

// API 호출시
logger.api('주식 데이터 요청', { symbol: 'AAPL' });

// 에러 발생시
logger.error('API 호출 실패', error);

// 사용자 액션
logger.userAction('매수 버튼 클릭', { symbol: 'AAPL', amount: 1000 });

// 디버깅용 (개발시에만)
logger.debug('상태 변경', { oldState, newState });

// 임시 디버깅용
logger.temp('이 부분 확인 중', someData);

// 설정 변경
logger.disableCategory('API');  // API 로그 끄기
logger.enableCategory('PERFORMANCE');  // 성능 로그 켜기
*/
