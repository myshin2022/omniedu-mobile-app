// SimulationSetupScreen.js (시뮬레이션 데이터 완전 분리)
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 상단에 추가

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch
} from 'react-native';

// 🎮 시뮬레이션 전용 깨끗한 데이터
const SIMULATION_INITIAL_DATA = {
  balance: 100000,
  portfolio: {},
  transactions: [],
  total_asset: 100000,
  user_id: 'simulation_user',
  username: 'simulation_mode'
};

export default function SimulationSetupScreen({ navigation }) {
  const [config, setConfig] = useState({
    startDate: '2023-01-01',
    endDate: '2024-12-31', // 2024년까지 확장!
    initialAmount: 100000,
    difficulty: 'normal',
    tradingInterval: 'monthly',
    enableAI: true,
    totalSteps: '24' // 24개월로 변경!
  });

  // 🎮 시뮬레이션 전용 포트폴리오 상태
  const [simulationPortfolio, setSimulationPortfolio] = useState(SIMULATION_INITIAL_DATA);

  useEffect(() => {
    console.log('🎮 시뮬레이션 설정 화면 로드됨');
    console.log('🧹 시뮬레이션 데이터 초기화:', SIMULATION_INITIAL_DATA);

    // 시뮬레이션 모드에서는 항상 깨끗한 데이터로 시작
    setSimulationPortfolio(SIMULATION_INITIAL_DATA);
  }, []);

  const handleStartSimulation = async () => {
    console.log('🎮 시뮬레이션 시작 - 설정:', config);
    console.log('💰 시뮬레이션 초기 자금:', simulationPortfolio.balance);
    console.log('📊 시뮬레이션 초기 포트폴리오:', simulationPortfolio.portfolio);

    try {
      // 시뮬레이션 횟수 확인
      const simulationCount = await AsyncStorage.getItem('simulationCount');
      const count = parseInt(simulationCount) || 0;

      console.log('📊 시뮬레이션 경험 횟수:', count);

      if (count === 0) {
        // 🎓 첫 번째 - 오리엔테이션 필수
        Alert.alert(
          '🎓 환영합니다!',
          '첫 번째 시뮬레이션이시네요!\n투자 기초와 기업 정보를 먼저 알아보시겠어요?',
          [
            { text: '취소', style: 'cancel' },
            {
              text: '네, 배워보겠습니다!',
              onPress: () => navigation.navigate('SimulationOrientation', {
                config: config,
                simulationData: simulationPortfolio
              })
            }
          ]
        );
      } else if (count === 1) {
        // 🤔 두 번째 - 오리엔테이션 선택
        Alert.alert(
          '🤔 오리엔테이션',
          '투자 기초와 기업 정보를 다시 보시겠어요?\n(복습하면 더 도움될 거예요!)',
          [
            {
              text: '바로 시작',
              onPress: () => startSimulationDirectly()
            },
            {
              text: '복습하기',
              onPress: () => navigation.navigate('SimulationOrientation', {
                config: config,
                simulationData: simulationPortfolio
              })
            }
          ]
        );
      } else {
        // 🚀 세 번째 이후 - 바로 시작 옵션
        Alert.alert(
          '🚀 시뮬레이션 시작',
          '바로 시뮬레이션을 시작하시겠어요?',
          [
            {
              text: '오리엔테이션 보기',
              onPress: () => navigation.navigate('SimulationOrientation', {
                config: config,
                simulationData: simulationPortfolio
              })
            },
            {
              text: '바로 시작!',
              onPress: () => startSimulationDirectly()
            }
          ]
        );
      }
    } catch (error) {
      console.error('시뮬레이션 횟수 확인 오류:', error);
      // 오류 시 바로 시작
      startSimulationDirectly();
    }
  };

  // 바로 시뮬레이션 시작하는 함수 (기존 로직)
  const startSimulationDirectly = () => {
    Alert.alert(
      '🎮 시뮬레이션 시작!',
      `설정 확인:
- 기간: ${config.startDate} ~ ${config.endDate}
- 초기 자금: $${simulationPortfolio.balance.toLocaleString()}
- 난이도: ${config.difficulty}
- AI 코치: ${config.enableAI ? '활성화' : '비활성화'}
- 거래 주기: ${config.tradingInterval}

⚠️ 이것은 연습용 시뮬레이션입니다.
실제 포트폴리오에는 영향을 주지 않습니다!`,
      [
        { text: '설정 변경', style: 'cancel' },
        {
          text: '시작!',
          onPress: () => {
            // 시뮬레이션 진행 화면으로 이동 (깨끗한 데이터와 함께)
            navigation.navigate('SimulationProgress', {
              config: config,
              simulationData: simulationPortfolio  // 깨끗한 시뮬레이션 데이터 전달
            });
          }
        }
      ]
    );
  };

  const handleResetSimulation = () => {

    Alert.alert(
      '🧹 시뮬레이션 초기화',
      '시뮬레이션 데이터를 완전히 초기화하시겠습니까?\n\n• 자금: $100,000로 리셋\n• 보유 주식: 모두 삭제\n• 거래 내역: 모두 삭제',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => {
            setSimulationPortfolio(SIMULATION_INITIAL_DATA);
            console.log('🧹 시뮬레이션 데이터 초기화 완료');
            Alert.alert('✅ 초기화 완료', '시뮬레이션이 $100,000 깨끗한 상태로 초기화되었습니다!');
          }
        }
      ]
    );
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎮 투자 시뮬레이션 설정</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 시뮬레이션 상태 표시 */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>🎯 시뮬레이션 상태</Text>
          <Text style={styles.statusText}>💰 초기 자금: ${simulationPortfolio.balance.toLocaleString()}</Text>
          <Text style={styles.statusText}>📊 보유 주식: {Object.keys(simulationPortfolio.portfolio).length}개</Text>
          <Text style={styles.statusText}>📈 거래 내역: {simulationPortfolio.transactions.length}건</Text>
          <Text style={styles.warningText}>⚠️ 실제 포트폴리오와 완전 분리됨</Text>
        </View>

        {/* 시뮬레이션 설정 */}
        <View style={styles.configCard}>
          <Text style={styles.configTitle}>⚙️ 시뮬레이션 설정</Text>

          {/* 시작 날짜 */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>📅 시작 날짜</Text>
            <TouchableOpacity style={styles.configValue}>
              <Text>{config.startDate}</Text>
            </TouchableOpacity>
          </View>

          {/* 종료 날짜 */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>📅 종료 날짜</Text>
            <TouchableOpacity style={styles.configValue}>
              <Text>{config.endDate}</Text>
            </TouchableOpacity>
          </View>

          {/* 초기 자금 */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>💰 초기 자금</Text>
            <TouchableOpacity style={styles.configValue}>
              <Text>${config.initialAmount.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>

          {/* 난이도 */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>🎯 난이도</Text>
            <View style={styles.difficultyButtons}>
              {['easy', 'normal', 'hard'].map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    config.difficulty === level && styles.selectedDifficulty
                  ]}
                  onPress={() => updateConfig('difficulty', level)}
                >
                  <Text style={[
                    styles.difficultyText,
                    config.difficulty === level && styles.selectedDifficultyText
                  ]}>
                    {level === 'easy' ? '쉬움' : level === 'normal' ? '보통' : '어려움'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 거래 주기 */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>⏰ 거래 주기</Text>
            <View style={styles.intervalButtons}>
              {[
                { key: 'weekly', label: '주간' },
                { key: 'monthly', label: '월간' },
                { key: 'quarterly', label: '분기' }
              ].map(interval => (
                <TouchableOpacity
                  key={interval.key}
                  style={[
                    styles.intervalButton,
                    config.tradingInterval === interval.key && styles.selectedInterval
                  ]}
                  onPress={() => updateConfig('tradingInterval', interval.key)}
                >
                  <Text style={[
                    styles.intervalText,
                    config.tradingInterval === interval.key && styles.selectedIntervalText
                  ]}>
                    {interval.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* AI 코치 활성화 */}
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>🤖 AI 코치</Text>
            <Switch
              value={config.enableAI}
              onValueChange={(value) => updateConfig('enableAI', value)}
              trackColor={{ false: '#767577', true: '#007AFF' }}
              thumbColor={config.enableAI ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetSimulation}
          >
            <Text style={styles.resetButtonText}>🧹 시뮬레이션 초기화</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartSimulation}
          >
            <Text style={styles.startButtonText}>🚀 시뮬레이션 시작!</Text>
          </TouchableOpacity>
        </View>

        {/* 설명 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>ℹ️ 시뮬레이션 안내</Text>
          <Text style={styles.infoText}>• 실제 돈을 사용하지 않는 연습용 모드입니다</Text>
          <Text style={styles.infoText}>• 실제 포트폴리오에는 전혀 영향을 주지 않습니다</Text>
          <Text style={styles.infoText}>• 과거 데이터를 기반으로 투자 실력을 연습할 수 있습니다</Text>
          <Text style={styles.infoText}>• AI 코치가 실시간으로 조언을 제공합니다</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  warningText: {
    fontSize: 14,
    marginTop: 10,
    color: '#28a745',
    fontWeight: 'bold',
  },
  configCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  configValue: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  difficultyButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  difficultyButton: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedDifficulty: {
    backgroundColor: '#007AFF',
  },
  difficultyText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDifficultyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  intervalButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  intervalButton: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedInterval: {
    backgroundColor: '#007AFF',
  },
  intervalText: {
    fontSize: 14,
    color: '#666',
  },
  selectedIntervalText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e7f3ff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
});
