// App.js (완전히 수정된 버전)
import { UserProvider } from './context/UserContext';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Alert } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import MainDashboardScreen from './screens/MainDashboardScreen';
import TransactionHistory from './src/components/TransactionHistory';
import SimulationTransactionHistory from './src/components/SimulationTransactionHistory';
import SimulationHistory from './src/components/SimulationHistory';
import PremiumUpgrade from './screens/PremiumUpgrade';
import StockDetail from './screens/StockDetail';
import SimulationOrientation from './screens/SimulationOrientation';

// StockListScreen을 dynamic import로 시도
let StockListScreen = null;
let RegisterScreen = null;
let PerformanceScreen = null;
let SimulationSetupScreen = null;
let APITestScreen = null;
let SimulationGameScreen = null;
let InvestmentReportCard = null;

try {
  StockListScreen = require('./screens/StockListScreen').default;
  console.log('✅ StockListScreen 로드 성공');
} catch (error) {
  console.log('❌ StockListScreen 로드 실패:', error.message);
}

try {
  RegisterScreen = require('./screens/RegisterScreen').default;
  console.log('✅ RegisterScreen 로드 성공');
} catch (error) {
  console.log('❌ RegisterScreen 로드 실패:', error.message);
}

try {
  PerformanceScreen = require('./screens/PerformanceScreen').default;
  console.log('✅ PerformanceScreen 로드 성공');
} catch (error) {
  console.log('❌ PerformanceScreen 로드 실패:', error.message);
  console.log('❌ PerformanceScreen 상세 에러:', error);
}

try {
  SimulationSetupScreen = require('./screens/SimulationSetupScreen').default;
  console.log('✅ SimulationSetupScreen 로드 성공');
} catch (error) {
  console.log('❌ SimulationSetupScreen 로드 실패:', error.message);
}

try {
  APITestScreen = require('./screens/APITestScreen').default;
  console.log('✅ APITestScreen 로드 성공');
} catch (error) {
  console.log('❌ APITestScreen 로드 실패:', error.message);
}

try {
  SimulationGameScreen = require('./screens/SimulationGameScreen').default;
  console.log('✅ SimulationGameScreen 로드 성공');
} catch (error) {
  console.log('❌ SimulationGameScreen 로드 실패:', error.message);
}

try {
  InvestmentReportCard = require('./screens/InvestmentReportCard').default;
  console.log('✅ InvestmentReportCard 로드 성공');
} catch (error) {
  console.log('❌ InvestmentReportCard 로드 실패:', error.message);
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [simulationResults, setSimulationResults] = useState(null);
  const [orientationParams, setOrientationParams] = useState(null);

  const [selectedStock, setSelectedStock] = useState(null);

  // 로그아웃 함수
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    console.log('사용자 로그아웃');
  };

  // Mock navigation object
  const mockNavigation = {
    navigate: (screenName, params) => {
      console.log(`🚀 Navigation 호출: ${screenName}`, params);

      if (screenName === 'MainDashboard') {
        console.log('✅ 메인 대시보드로 이동 중...');
        setCurrentScreen('MainDashboard');
        setIsLoggedIn(true);
        if (params?.userInfo) {
          setUserInfo(params.userInfo);
          console.log('👤 사용자 정보 저장:', params.userInfo);
        }
      } else if (screenName === 'StockDetail') {
        console.log('📊 주식 상세보기 화면으로 이동 중...');
        if (params?.symbol) {
          console.log('📈 선택된 주식:', params.symbol);
          setCurrentScreen('StockDetail');
          // 주식 심볼을 state에 저장
          setSelectedStock(params.symbol);
        } else {
          Alert.alert('오류', '주식 정보가 없습니다.');
        }
      } else if (screenName === 'Login') {
        console.log('🔙 로그인 화면으로 이동 중...');
        setCurrentScreen('Login');
        setIsLoggedIn(false);
        setUserInfo(null);
      } else if (screenName === 'StockList') {
        console.log('📈 주식 목록 화면으로 이동 중...');
        if (StockListScreen) {
          setCurrentScreen('StockList');
        } else {
          Alert.alert('오류', 'StockListScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'Register') {
        console.log('📝 회원가입 화면으로 이동 중...');
        if (RegisterScreen) {
          setCurrentScreen('Register');
        } else {
          Alert.alert('오류', 'RegisterScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'AIAnalysis') {
        console.log('🤖 AI 분석 화면으로 이동 중...');
        Alert.alert('AI 분석', 'AI 분석 기능은 곧 출시됩니다!\n\n현재 각 주식의 AI 인사이트는 주식 거래 화면에서 확인하실 수 있습니다.', [
          { text: '확인', onPress: () => setCurrentScreen('MainDashboard') }
        ]);
      } else if (screenName === 'Performance') {
        console.log('📊 성과 분석 화면으로 이동 중...');
        if (PerformanceScreen) {
          setCurrentScreen('Performance');
        } else {
          Alert.alert('오류', 'PerformanceScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'SimulationSetup') {
        console.log('🎮 시뮬레이션 설정 화면으로 이동 중...');
        if (SimulationSetupScreen) {
          setCurrentScreen('SimulationSetup');
        } else {
          Alert.alert('오류', 'SimulationSetupScreen을 로드할 수 없습니다.');
        }

      } else if (screenName === 'SimulationOrientation') {
        console.log('🎓 시뮬레이션 오리엔테이션 화면으로 이동 중...');
        if (SimulationOrientation) {
          setCurrentScreen('SimulationOrientation');
          if (params) {
            console.log('📋 오리엔테이션 파라미터:', params);
          }
        } else {
          Alert.alert('오류', 'SimulationOrientation을 로드할 수 없습니다.');
        }
      } else if (screenName === 'SimulationProgress') {
        console.log('🎮 시뮬레이션 진행 화면으로 이동 중...');
        console.log('🔍 현재 화면:', currentScreen);
        console.log('🔍 SimulationGameScreen 존재:', !!SimulationGameScreen);
        if (SimulationGameScreen) {
          console.log('✅ setCurrentScreen("SimulationGame") 호출');
          setCurrentScreen('SimulationGame');
        } else {
          Alert.alert('오류', 'SimulationGameScreen을 로드할 수 없습니다.');
        }
      } else if (screenName === 'InvestmentReportCard') {
        console.log('📊 투자 성적표 화면으로 이동 중...');

        if (params?.simulationResults) {
          console.log('💾 실제 시뮬레이션 결과 수신:', params.simulationResults);
          setSimulationResults(params.simulationResults);
        }
        if (InvestmentReportCard) {
          setCurrentScreen('InvestmentReportCard');
        } else {
          Alert.alert('오류', 'InvestmentReportCard를 로드할 수 없습니다.');
        }

      } else if (screenName === 'TransactionHistory') {
        console.log('📊 거래 내역 화면으로 이동 중...');
        setCurrentScreen('TransactionHistory');

      } else if (screenName === 'SimulationTransactionHistory') {
        console.log('🎮 시뮬레이션 거래 내역 화면으로 이동 중...');
        if (params?.simulationResults) {
          setSimulationResults(params.simulationResults);
        }
        setCurrentScreen('SimulationTransactionHistory');

      } else if (screenName === 'SimulationHistory') {
        console.log('📊 시뮬레이션 성과 이력 화면으로 이동 중...');
        setCurrentScreen('SimulationHistory');

      } else if (screenName === 'APITest') {
        console.log('🧪 API 테스트 화면으로 이동 중...');
        if (APITestScreen) {
          setCurrentScreen('APITest');
        } else {
          Alert.alert('오류', 'APITestScreen을 로드할 수 없습니다.');
        }
      } else {
        console.log(`❓ 알 수 없는 화면: ${screenName}`);
      }
    }
  };

  // 화면 렌더링
  const renderScreen = () => {
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
        if (APITestScreen) {
          return <APITestScreen navigation={mockNavigation} />;
        } else {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>APITestScreen을 로드할 수 없습니다</Text>
            </View>
          );
        }

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

      case 'StockList':
        if (StockListScreen) {
          return <StockListScreen navigation={mockNavigation} />;
        } else {
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
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>SimulationSetupScreen을 로드할 수 없습니다</Text>
            </View>
          );
        }

      case 'SimulationGame':
        console.log('🎮 SimulationGame case 실행됨');
        console.log('🔍 SimulationGameScreen 존재:', !!SimulationGameScreen);
        if (SimulationGameScreen) {
          console.log('✅ SimulationGameScreen 렌더링 시작');
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
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>SimulationGameScreen을 로드할 수 없습니다</Text>
            </View>
          );
        }

      case 'InvestmentReportCard':
        console.log('🎯 InvestmentReportCard case 실행됨');
        console.log('🔍 InvestmentReportCard 존재:', !!InvestmentReportCard);

        if (InvestmentReportCard) {
          console.log('✅ InvestmentReportCard 렌더링 시작');

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
          console.log('❌ InvestmentReportCard 컴포넌트 없음');
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>InvestmentReportCard를 로드할 수 없습니다</Text>
            </View>
          );
        }

      case 'TransactionHistory':
        return <TransactionHistory navigation={mockNavigation} />;

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
        return <LoginScreen navigation={mockNavigation} />;
    }
  };

  return (
    <UserProvider>
      <View style={styles.container}>
        {/* 디버깅용 상태 표시 */}
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
        </View>

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

