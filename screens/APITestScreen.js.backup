// screens/APITestScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

// 🌐 API 설정
const API_BASE_URL = 'https://learntoinvestai.com';

export default function APITestScreen({ navigation }) {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  // 🧪 API 테스트 함수
  const testAPI = async (testName, url, options = {}) => {
    try {
      setCurrentTest(testName);
      console.log(`🧪 ${testName} 테스트 시작...`);
      
      const response = await fetch(url, {
        timeout: 10000,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const result = {
        name: testName,
        success: true,
        status: response.status,
        data: JSON.stringify(data, null, 2),
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      console.log(`✅ ${testName} 성공:`, data);
      
      return data;
      
    } catch (error) {
      const result = {
        name: testName,
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestResults(prev => [...prev, result]);
      console.error(`❌ ${testName} 실패:`, error);
      
      return null;
    }
  };

  // 🔥 핵심 API 테스트 실행
  const runCoreTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // 1. 서버 연결 테스트
      await testAPI(
        '🌐 서버 연결 테스트', 
        `${API_BASE_URL}/api/competitions`
      );
      
      // 2. 🔥 연습 포트폴리오 초기화 (핵심!)
      const resetResult = await testAPI(
        '🔥 연습 포트폴리오 초기화', 
        `${API_BASE_URL}/api/practice/reset/1`, 
        { method: 'POST' }
      );
      
      if (resetResult && resetResult.success) {
        Alert.alert(
          '🎉 초기화 성공!', 
          '연습 포트폴리오가 안전하게 초기화되었습니다!\n실제 포트폴리오는 영향받지 않습니다.',
          [{ text: '확인', style: 'default' }]
        );
      }
      
      // 3. 연습 포트폴리오 조회
      await testAPI(
        '📊 연습 포트폴리오 조회', 
        `${API_BASE_URL}/api/portfolio/practice/1`
      );
      
      // 4. 실제 포트폴리오 조회
      await testAPI(
        '💰 실제 포트폴리오 조회', 
        `${API_BASE_URL}/api/portfolio/real?user_id=1`
      );
      
      // 5. 경시대회 목록
      await testAPI(
        '🏆 경시대회 목록', 
        `${API_BASE_URL}/api/competitions`
      );
      
      // 6. 시스템 상태
      await testAPI(
        '🔍 시스템 상태', 
        `${API_BASE_URL}/api/portfolio/status`
      );
      
    } catch (error) {
      console.error('테스트 실행 중 오류:', error);
      Alert.alert('오류', `테스트 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
      setCurrentTest('');
    }
  };

  // 🧪 개별 테스트들
  const testConnectionOnly = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    await testAPI('🌐 연결 테스트', `${API_BASE_URL}/api/competitions`);
    
    setIsLoading(false);
  };

  const testResetOnly = async () => {
    setIsLoading(true);
    
    Alert.alert(
      '⚠️ 확인', 
      '연습 포트폴리오를 초기화하시겠습니까?\n(실제 포트폴리오는 영향받지 않습니다)',
      [
        { text: '취소', style: 'cancel', onPress: () => setIsLoading(false) },
        { 
          text: '초기화', 
          style: 'destructive',
          onPress: async () => {
            await testAPI(
              '🔥 연습 초기화', 
              `${API_BASE_URL}/api/practice/reset/1`, 
              { method: 'POST' }
            );
            setIsLoading(false);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🚀 API 테스트</Text>
      </View>

      {/* 버튼들 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={runCoreTests}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            🧪 전체 API 테스트
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={testConnectionOnly}
          disabled={isLoading}
        >
          <Text style={styles.buttonTextSecondary}>
            🌐 연결 테스트만
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]} 
          onPress={testResetOnly}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            🔥 초기화 테스트만
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={() => setTestResults([])}
          disabled={isLoading}
        >
          <Text style={styles.buttonTextSecondary}>
            🗑️ 결과 지우기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 로딩 상태 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {currentTest || '테스트 진행 중...'}
          </Text>
        </View>
      )}

      {/* 테스트 결과 */}
      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>📊 테스트 결과</Text>
        
        {testResults.length === 0 && !isLoading && (
          <Text style={styles.noResults}>
            아직 테스트 결과가 없습니다.{'\n'}
            위 버튼을 눌러서 API 테스트를 시작하세요!
          </Text>
        )}
        
        {testResults.map((result, index) => (
          <View 
            key={index} 
            style={[
              styles.resultCard, 
              { 
                backgroundColor: result.success ? '#e8f5e8' : '#ffe8e8',
                borderColor: result.success ? '#4CAF50' : '#f44336'
              }
            ]}
          >
            <Text style={[
              styles.resultTitle, 
              { color: result.success ? '#2E7D32' : '#c62828' }
            ]}>
              {result.success ? '✅' : '❌'} {result.name}
            </Text>
            
            <Text style={styles.resultTime}>
              {result.timestamp}
              {result.status && ` • HTTP ${result.status}`}
            </Text>
            
            <Text style={styles.resultData}>
              {result.success ? result.data : `오류: ${result.error}`}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    color: '#1976D2',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
    lineHeight: 24,
  },
  resultCard: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  resultData: {
    fontSize: 12,
    fontFamily: 'Courier',
    color: '#444',
    lineHeight: 16,
  },
});
