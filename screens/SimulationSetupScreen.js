// SimulationSetupScreen.js (시뮬레이션 데이터 완전 분리)
import React, {useState, useEffect} from 'react';
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

export default function SimulationSetupScreen({navigation}) {
  const [config, setConfig] = useState({
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    initialAmount: 100000,
    difficulty: 'normal',
    tradingInterval: 'quarterly',  // ← 분기별을 기본값으로 변경 (초보자 친화적)
    enableAI: true,
    totalSteps: '24'
  });

  // 🎮 시뮬레이션 전용 포트폴리오 상태
  const [simulationPortfolio, setSimulationPortfolio] = useState(SIMULATION_INITIAL_DATA);

  useEffect(() => {
    console.log('🎮 시뮬레이션 설정 화면 로드됨');
    console.log('🧹 시뮬레이션 데이터 초기화:', SIMULATION_INITIAL_DATA);

    // 시뮬레이션 모드에서는 항상 깨끗한 데이터로 시작
    setSimulationPortfolio(SIMULATION_INITIAL_DATA);
  }, []);

  const handleStartSimulation = () => {
    console.log('🎮 시뮬레이션 시작 - 설정:', config);
    console.log('🔍 현재 tradingInterval:', config.tradingInterval);
    console.log('💰 시뮬레이션 초기 자금:', simulationPortfolio.balance);

    const modeInfo = config.tradingInterval === 'quarterly' ?
        {name: '⚡ 분기별 체험', steps: '8분기', time: '약 10분'} :
        {name: '🎯 월별 시뮬레이션', steps: '24개월', time: '약 30분'};

    Alert.alert(
        '🎮 시뮬레이션 시작!',
        `${modeInfo.name} 모드를 시작합니다!

📊 설정 확인:
• 투자 주기: ${modeInfo.name}
• 진행 단계: ${modeInfo.steps}
• 예상 시간: ${modeInfo.time}
• 초기 자금: $${simulationPortfolio.balance.toLocaleString()}
• 난이도: ${config.difficulty}
• AI 코치: ${config.enableAI ? '활성화' : '비활성화'}

⚠️ 연습용 시뮬레이션으로 실제 투자에 영향 없습니다!`,
        [
          {text: '설정 변경', style: 'cancel'},
          {
            text: '🚀 시작하기!',
            onPress: () => {
              console.log('🚀 SimulationGame으로 이동, config:', config);

              navigation.navigate('SimulationGame', {
                config: config,
                simulationData: simulationPortfolio
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
          {text: '취소', style: 'cancel'},
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

            {/* 투자 주기 선택 */}
            <View style={styles.configRow}>
              <Text style={styles.configLabel}>⏰ 투자 주기 선택</Text>
              <View style={styles.modeContainer}>
                {[
                  {
                    key: 'quarterly',
                    label: '⚡ 분기별 체험',
                    desc: '8분기 (약 10분)',
                    recommend: '초보자 추천',
                    detail: '빠르게 투자 감각 익히기'
                  },
                  {
                    key: 'monthly',
                    label: '🎯 월별 시뮬레이션',
                    desc: '24개월 (약 30분)',
                    recommend: '고급자 추천',
                    detail: '정교한 투자 전략 연습'
                  }
                ].map(mode => (
                    <TouchableOpacity
                        key={mode.key}
                        style={[
                          styles.modeCard,
                          config.tradingInterval === mode.key && styles.selectedModeCard
                        ]}
                        onPress={() => {
                          console.log(`🔄 ${mode.label} 선택됨`);
                          updateConfig('tradingInterval', mode.key);
                        }}
                    >
                      <Text style={[
                        styles.modeTitle,
                        config.tradingInterval === mode.key && styles.selectedModeTitle
                      ]}>
                        {mode.label}
                      </Text>
                      <Text style={styles.modeDesc}>{mode.desc}</Text>
                      <Text style={styles.modeDetail}>{mode.detail}</Text>
                      <View style={[
                        styles.recommendBadge,
                        config.tradingInterval === mode.key && styles.selectedRecommendBadge
                      ]}>
                        <Text style={[
                          styles.recommendText,
                          config.tradingInterval === mode.key && styles.selectedRecommendText
                        ]}>
                          {mode.recommend}
                        </Text>
                      </View>
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
                  trackColor={{false: '#767577', true: '#007AFF'}}
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
    flexDirection: 'column',
    marginBottom: 20,
  },
  configLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
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
    justifyContent: 'space-between',
  },
  difficultyButton: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
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
    justifyContent: 'space-between',
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
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    minHeight: 140,
  },
  selectedModeCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    transform: [{ scale: 1.02 }],
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedModeTitle: {
    color: '#2196f3',
  },
  modeDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
  modeDetail: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  recommendBadge: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 'auto',
  },
  selectedRecommendBadge: {
    backgroundColor: '#2196f3',
  },
  recommendText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedRecommendText: {
    color: '#fff',
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