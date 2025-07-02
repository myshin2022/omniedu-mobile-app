// App.js (완전히 수정된 버전)
// 🚨 긴급 로그 차단 - 폭탄 해체
// 🚀 스마트 로깅 시스템 적용

import { UserProvider } from './context/UserContext';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Alert, Platform } from 'react-native';
import logger from './utils/logger'; // 🔥 로거 import

import LoginScreen from './screens/LoginScreen';
import MainDashboardScreen from './screens/MainDashboardScreen';
import TransactionHistory from './src/components/TransactionHistory';
import SimulationTransactionHistory from './src/components/SimulationTransactionHistory';
import SimulationHistory from './src/components/SimulationHistory';
import PremiumUpgrade from './screens/PremiumUpgrade';
import StockDetail from './screens/StockDetail';
import SimulationOrientation from './screens/SimulationOrientation';
import StockListScreen from './screens/StockListScreen';

// StockListScreen을 dynamic import로 시도

let RegisterScreen = null;
let PerformanceScreen = null;
let SimulationSetupScreen = null;
let SimulationGameScreen = null;
let InvestmentReportCard = null;

// 🔍 컴포넌트 로드 상태 로깅
logger.debug('StockListScreen import 직후', {
  type: typeof StockListScreen,
  isFunction: typeof StockListScreen === 'function',
  hasReactType: StockListScreen && StockListScreen.$$typeof
});

try {
  RegisterScreen = require('./screens/RegisterScreen').default;
  logger.debug('RegisterScreen 로드 성공');
} catch (error) {
  logger.error('RegisterScreen 로드 실패', error);
}

try {
  PerformanceScreen = require('./screens/PerformanceScreen').default;
  logger.debug('PerformanceScreen 로드 성공');
} catch (error) {
  logger.error('PerformanceScreen 로드 실패', error);
}

try {
  SimulationSetupScreen = require('./screens/SimulationSetupScreen').default;
  logger.debug('SimulationSetupScreen 로드 성공');
} catch (error) {
  logger.error('SimulationSetupScreen 로드 실패', error);
}

try {
  SimulationGameScreen = require('./screens/SimulationGameScreen').default;
  logger.debug('SimulationGameScreen 로드 성공');
} catch (error) {
  logger.error('SimulationGameScreen 로드 실패', error);
}

try {
  InvestmentReportCard = require('./screens/InvestmentReportCard').default;
  logger.debug('InvestmentReportCard 로드 성공');
} catch (error) {
  logger.error('InvestmentReportCard 로드 실패', error);
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [orientationParams, setOrientationParams] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);

  // 🚀 앱 시작시 로깅 설정
  useEffect(() => {
    // 앱 시작 로그
    logger.userAction('투자코치 앱 시작됨', {
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      initialScreen: 'Login'
    });

    // 개발 환경 로깅 설정
    if (__DEV__) {
      logger.debug('개발 모드로 앱 시작');

      // ⚡ 로그 폭탄 방지 설정
      logger.disableAll();
      logger.enableCategory('ERROR');       // 에러는 항상
      logger.enableCategory('USER_ACTION'); // 사용자 액션만
      // logger.enableCategory('API');       // 필요시에만 켜기
      // logger.enableCategory('DEBUG');     // 디버깅시에만 켜기

      // 현재 설정 표시
      logger.showConfig();

      // 전역에서 접근 가능하게 만들기
      global.logger = logger;

      logger.debug('로그 폭탄 방지 설정 완료 - 깔끔한 로그 모드');
    } else {
      // 프로덕션에서는 최소한만
      logger.disableAll();
      logger.enableCategory('ERROR');
      logger.userAction('프로덕션 모드로 앱 시작');
    }

    // 컴포넌트 로드 상태 요약
    const loadedComponents = {
      RegisterScreen: !!RegisterScreen,
      PerformanceScreen: !!PerformanceScreen,
      SimulationSetupScreen: !!SimulationSetupScreen,
      SimulationGameScreen: !!SimulationGameScreen,
      InvestmentReportCard: !!InvestmentReportCard,
      StockListScreen: !!StockListScreen
    };

    logger.debug('컴포넌트 로드 상태', loadedComponents);
  }, []);

  // 🔄 화면 전환 로깅
  useEffect(() => {
    logger.userAction('화면 전환', {
      newScreen: currentScreen,
      isLoggedIn,
      timestamp: new Date().toISOString()
    });
  }, [currentScreen]);

  // 👤 로그인 상태 변경 로깅
  useEffect(() => {
    if (isLoggedIn && userInfo) {
      logger.userAction('사용자 로그인 성공', {
        userId: userInfo?.id || 'unknown',
        username: userInfo?.username || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  }, [isLoggedIn, userInfo]);

  // 📊 시뮬레이션 결과 로깅
  useEffect(() => {
    if (simulationResults) {
      logger.userAction('시뮬레이션 완료', {
        resultCount: simulationResults.length || 0,
        finalBalance: simulationResults.final_balance || 'unknown',
        timestamp: new Date().toISOString()
      });
    }
  }, [simulationResults]);

  // 📈 선택된 주식 로깅
  useEffect(() => {
    if (selectedStock) {
      logger.userAction('주식 선택됨', {
        symbol: selectedStock,
        timestamp: new Date().toISOString()
      });
    }
  }, [selectedStock]);

  // 로그아웃 함수 (로깅 추가)
  const handleLogout = () => {
    // 로그아웃 로그
    logger.userAction('사용자 로그아웃 시작', {
      userId: userInfo?.id || 'unknown',
      username: userInfo?.username || 'unknown',
      sessionDuration: userInfo?.loginTime ?
        Date.now() - userInfo.loginTime : 'unknown',
      timestamp: new Date().toISOString()
    });

    // 기존 로직
    setIsLoggedIn(false);
    setUserInfo(null);
    setCurrentScreen('Login');
    setSimulationResults(null);
    setSelectedStock(null);

    // 로그아웃 완료 로그
    logger.userAction('사용자 로그아웃 완료');
  };

  // Mock navigation object
  const mockNavigation = {
    navigate: (screenName, params) => {
      logger.userAction('네비게이션 요청', {
        from: currentScreen,
        to: screenName,
        hasParams: !!params
      });

      if (screenName === 'MainDashboard') {
        logger.userAction('메인 대시보드 이동');
        setCurrentScreen('MainDashboard');
        setIsLoggedIn(true);
        if (params?.userInfo) {
          setUserInfo({
            ...params.userInfo,
            loginTime: Date.now() // 로그인 시간 기록
          });
          logger.userAction('사용자 정보 저장', {
            username: params.userInfo.username
          });
        }
      } else if (screenName === 'StockDetail') {
        logger.userAction('주식 상세보기 이동', {
          symbol: params?.symbol
        });
        if (params?.symbol) {
          setCurrentScreen('StockDetail');
          setSelectedStock(params.symbol);
        } else {
          logger.error('주식 정보 없음 - StockDetail 이동 실패');
          Alert.alert('오류', '주식 정보가 없습니다.');
        }
      } else if (screenName === 'Login') {
        logger.userAction('로그인 화면 이동');
        setCurrentScreen('Login');
        setIsLoggedIn(false);
        setUserInfo(null);
      } else if (screenName === 'StockList') {
        logger.userAction('주식 목록 화면 이동');
        if (StockListScreen) {
          setCurrentScreen('StockList');
        } else {
          logger.error('StockListScreen 로드 실패');
          Alert.alert('오류', 'StockListScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'Register') {
        logger.userAction('회원가입 화면 이동');
        if (RegisterScreen) {
          setCurrentScreen('Register');
        } else {
          logger.error('RegisterScreen 로드 실패');
          Alert.alert('오류', 'RegisterScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'AIAnalysis') {
        logger.userAction('AI 분석 요청');
        Alert.alert('AI 분석', 'AI 분석 기능은 곧 출시됩니다!\n\n현재 각 주식의 AI 인사이트는 주식 거래 화면에서 확인하실 수 있습니다.', [
          {
            text: '확인', onPress: () => {
              logger.userAction('AI 분석 알림 확인');
              setCurrentScreen('MainDashboard');
            }
          }
        ]);
      } else if (screenName === 'Performance') {
        logger.userAction('성과 분석 화면 이동');
        if (PerformanceScreen) {
          setCurrentScreen('Performance');
        } else {
          logger.error('PerformanceScreen 로드 실패');
          Alert.alert('오류', 'PerformanceScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'SimulationSetup') {
        logger.userAction('시뮬레이션 설정 화면 이동');
        if (SimulationSetupScreen) {
          setCurrentScreen('SimulationSetup');
        } else {
          logger.error('SimulationSetupScreen 로드 실패');
          Alert.alert('오류', 'SimulationSetupScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'SimulationOrientation') {
        logger.userAction('시뮬레이션 오리엔테이션 이동');
        if (SimulationOrientation) {
          setCurrentScreen('SimulationOrientation');
          if (params) {
            logger.debug('오리엔테이션 파라미터 수신', params);
          }
        } else {
          logger.error('SimulationOrientation 로드 실패');
          Alert.alert('오류', 'SimulationOrientation을 로드할 수 없습니다.');
        }
      } else if (screenName === 'SimulationProgress') {
        logger.userAction('시뮬레이션 게임 시작');
        if (SimulationGameScreen) {
          setCurrentScreen('SimulationGame');
        } else {
          logger.error('SimulationGameScreen 로드 실패');
          Alert.alert('오류', 'SimulationGameScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'InvestmentReportCard') {
        logger.userAction('투자 성적표 이동');
        if (params?.simulationResults) {
          logger.userAction('시뮬레이션 결과 수신', {
            resultCount: params.simulationResults.length || 0
          });
          setSimulationResults(params.simulationResults);
        }
        if (InvestmentReportCard) {
          setCurrentScreen('InvestmentReportCard');
        } else {
          logger.error('InvestmentReportCard 로드 실패');
          Alert.alert('오류', 'InvestmentReportCard를 로드할 수 없습니다.');
        }
      } else if (screenName === 'TransactionHistory') {
        logger.userAction('거래 내역 화면 이동');
        setCurrentScreen('TransactionHistory');
      } else if (screenName === 'SimulationTransactionHistory') {
        logger.userAction('시뮬레이션 거래 내역 이동');
        if (params?.simulationResults) {
          setSimulationResults(params.simulationResults);
        }
        setCurrentScreen('SimulationTransactionHistory');
      } else if (screenName === 'SimulationHistory') {
        logger.userAction('시뮬레이션 히스토리 이동');
        setCurrentScreen('SimulationHistory');
      } else {
        logger.error('알 수 없는 화면 요청', {
          screenName,
          currentScreen
        });
        Alert.alert('오류', `화면을 찾을 수 없습니다: ${screenName}`);
      }
    },  // ← navigate 함수 종료

    goBack: () => {
      logger.userAction('뒤로가기 버튼 클릭', {
        currentScreen
      });
      // 필요시 이전 화면으로 이동 로직
    }
  };

  // 화면 렌더링
  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'Login':
          return <LoginScreen navigation={mockNavigation} />;

        case 'SimulationOrientation':
          return (
            <SimulationOrientation
              navigation={mockNavigation}
              route={{
                params: {
                  // 필요한 파라미터들 (config, simulationData 등)
                }
              }}
            />
          );

        case 'TransactionHistory':
          return <TransactionHistory navigation={mockNavigation} />;

        case 'MainDashboard':
          return (
            <MainDashboardScreen
              navigation={mockNavigation}
              userInfo={userInfo}
              onLogout={handleLogout}
            />
          );

        case 'StockDetail':
          if (StockDetail) {
            return <StockDetail navigation={mockNavigation} route={{ params: { symbol: selectedStock } }} />;
          } else {
            logger.error('StockDetail 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>StockDetail을 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'StockList':
          if (StockListScreen) {
            return <StockListScreen navigation={mockNavigation} />;
          } else {
            logger.error('StockListScreen 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>StockListScreen을 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'Register':
          if (RegisterScreen) {
            return <RegisterScreen navigation={mockNavigation} />;
          } else {
            logger.error('RegisterScreen 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>RegisterScreen을 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'Performance':
          if (PerformanceScreen) {
            return <PerformanceScreen navigation={mockNavigation} />;
          } else {
            logger.error('PerformanceScreen 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>PerformanceScreen을 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'SimulationSetup':
          if (SimulationSetupScreen) {
            return <SimulationSetupScreen navigation={mockNavigation} />;
          } else {
            logger.error('SimulationSetupScreen 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>SimulationSetupScreen을 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'SimulationGame':
          logger.debug('SimulationGame 화면 렌더링 시작');
          if (SimulationGameScreen) {
            return (
              <SimulationGameScreen
                navigation={mockNavigation}
                route={{
                  params: {
                    config: {
                      startDate: '2023-01-01',
                      endDate: '2024-12-31',
                      totalSteps: '24',
                      difficulty: 'normal',
                      tradingInterval: 'monthly',
                      enableAI: true
                    },
                    simulationData: {
                      balance: 100000,
                      portfolio: {},
                      transactions: [],
                      total_asset: 100000,
                      user_id: 'simulation_user',
                      username: 'simulation_mode'
                    }
                  }
                }}
              />
            );
          } else {
            logger.error('SimulationGameScreen 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>SimulationGameScreen을 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'InvestmentReportCard':
          logger.debug('InvestmentReportCard 화면 렌더링 시작');
          if (InvestmentReportCard) {
            return (
              <InvestmentReportCard
                navigation={mockNavigation}
                route={{
                  params: {
                    simulationResults,
                    username: userInfo?.username || 'Guest',
                    level: userInfo?.level || 'beginner',
                    email: userInfo?.email || null
                  }
                }}
              />
            );
          } else {
            logger.error('InvestmentReportCard 컴포넌트 없음');
            return (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>InvestmentReportCard를 로드할 수 없습니다</Text>
              </View>
            );
          }

        case 'SimulationHistory':
          return <SimulationHistory navigation={mockNavigation} />;

        case 'SimulationTransactionHistory':
          return (
            <SimulationTransactionHistory
              navigation={mockNavigation}
              route={{
                params: {
                  simulationResults: simulationResults
                }
              }}
            />
          );

        default:
          logger.error('알 수 없는 화면 상태', {
            currentScreen
          });
          return <LoginScreen navigation={mockNavigation} />;
      }
    } catch (error) {
      logger.error('화면 렌더링 중 에러', {
        currentScreen,
        error: error.message
      });
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>화면 로드 중 오류가 발생했습니다</Text>
        </View>
      );
    }
  };

  return (
    <UserProvider>
      <View style={styles.container}>
        {/* 🔧 개발용 디버깅 패널 (개발 모드에서만 표시) */}
        {__DEV__ && (
          <View style={{
            position: 'absolute',
            top: 50,
            left: 20,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 10,
            borderRadius: 5
          }}>
            <Text style={{ color: 'white', fontSize: 12 }}>
              현재 화면: {currentScreen}
            </Text>
            <Text style={{ color: 'white', fontSize: 12 }}>
              로그인 상태: {isLoggedIn ? '✅ 로그인됨' : '❌ 로그아웃'}
            </Text>
            <Text style={{ color: 'white', fontSize: 12 }}>
              StockList: {StockListScreen ? '✅ 로드됨' : '❌ 로드 실패'}
            </Text>
            {userInfo && (
              <Text style={{ color: 'white', fontSize: 12 }}>
                사용자: {userInfo.username}
              </Text>
            )}
            <Text style={{ color: 'lime', fontSize: 10 }}>
              로그 제어: global.logger 사용
            </Text>
          </View>
        )}

        {renderScreen()}
        <StatusBar style="auto" />
      </View>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
});

// 🎯 개발자 노트:
// 로그 제어 명령어 (Metro 콘솔에서 사용):
// logger.enableCategory('API')     - API 로그 켜기
// logger.enableCategory('DEBUG')   - 디버그 로그 켜기  
// logger.disableCategory('USER_ACTION') - 사용자 액션 로그 끄기
// logger.showConfig()              - 현재 설정 보기
// logger.enableAll()               - 모든 로그 켜기
// logger.disableAll()              - 모든 로그 끄기