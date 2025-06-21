// App.js (완전히 수정된 버전)
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Alert } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import MainDashboardScreen from './screens/MainDashboardScreen';

// StockListScreen을 dynamic import로 시도
let StockListScreen = null;
let RegisterScreen = null;
let PerformanceScreen = null;
let SimulationSetupScreen = null;
let APITestScreen = null;

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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

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
      } else if (screenName === 'SimulationProgress') {
        console.log('🎮 시뮬레이션 진행 화면으로 이동 중...');
        Alert.alert(
          '🎮 시뮬레이션 시작!',
          '시뮬레이션 게임 화면이 곧 구현됩니다!\n\n현재 설정:\n• 기간: 2023년\n• 초기 자금: $100,000\n• 난이도: 쉬움',
          [
            { text: '설정 변경', onPress: () => setCurrentScreen('SimulationSetup') },
            { text: '메인으로', onPress: () => setCurrentScreen('MainDashboard') }
          ]
        );
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

      case 'APITest':
        if (APITestScreen) {
          return <APITestScreen navigation={mockNavigation} />;
        } else {
          return (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>APITestScreen을 로드할 수 없습니다</Text>
            </View>
          );
        }

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

      default:
        return <LoginScreen navigation={mockNavigation} />;
    }
  };

  return (
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
