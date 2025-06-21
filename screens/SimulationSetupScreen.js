// screens/SimulationSetupScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';

const SimulationSetupScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [tradingInterval, setTradingInterval] = useState('monthly'); // daily, weekly, monthly, quarterly
  const [initialAmount, setInitialAmount] = useState(100000);
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  const [enableAI, setEnableAI] = useState(true);

  const startDateOptions = [
    { label: '2023년 1월', value: '2023-01-01', period: '1년' },
    { label: '2022년 1월', value: '2022-01-01', period: '2년' },
    { label: '2021년 1월', value: '2021-01-01', period: '3년' },
    { label: '2020년 3월 (코로나)', value: '2020-03-01', period: '특별' },
  ];

  const intervalOptions = [
    {
      id: 'daily',
      label: '매일 거래',
      description: '365회 거래 기회',
      difficulty: '어려움',
      color: '#dc3545'
    },
    {
      id: 'weekly',
      label: '매주 거래',
      description: '52회 거래 기회',
      difficulty: '보통',
      color: '#ffc107'
    },
    {
      id: 'monthly',
      label: '매월 거래',
      description: '12회 거래 기회',
      difficulty: '쉬움',
      color: '#28a745'
    },
    {
      id: 'quarterly',
      label: '분기별 거래',
      description: '4회 거래 기회',
      difficulty: '매우 쉬움',
      color: '#007bff'
    },
  ];

  const difficultyOptions = [
    {
      id: 'easy',
      label: '🟢 쉬움',
      description: 'AI 조언 항상 표시, 힌트 제공',
      features: ['전체 AI 분석', '시장 힌트', '위험 경고']
    },
    {
      id: 'normal',
      label: '🟡 보통',
      description: 'AI 조언 선택적 표시',
      features: ['기본 AI 분석', '시장 데이터', '일반 경고']
    },
    {
      id: 'hard',
      label: '🔴 어려움',
      description: 'AI 조언 최소화, 실전과 동일',
      features: ['최소 정보', '실시간 데이터만', '자력 판단']
    }
  ];

  const handleStartSimulation = () => {
    const selectedInterval = intervalOptions.find(opt => opt.id === tradingInterval);
    const selectedStart = startDateOptions.find(opt => opt.value === startDate);

    Alert.alert(
      '시뮬레이션 시작',
      `설정 확인:
      
📅 기간: ${selectedStart.label} ~ ${endDate}
⏰ 거래 주기: ${selectedInterval.label}
💰 초기 자금: $${initialAmount.toLocaleString()}
🎯 난이도: ${difficultyOptions.find(d => d.id === difficulty).label}
🤖 AI 코치: ${enableAI ? '활성화' : '비활성화'}

시뮬레이션을 시작하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '시작!',
          onPress: () => {
            // 시뮬레이션 데이터를 전달하며 화면 이동
            navigation.navigate('SimulationProgress', {
              config: {
                startDate,
                endDate,
                tradingInterval,
                initialAmount,
                difficulty,
                enableAI,
                totalSteps: selectedInterval.description.match(/\d+/)[0]
              }
            });
          }
        }
      ]
    );
  };

  const renderStartDateOption = (option) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.optionCard,
        startDate === option.value && styles.optionCardSelected
      ]}
      onPress={() => setStartDate(option.value)}
    >
      <View style={styles.optionHeader}>
        <Text style={styles.optionLabel}>{option.label}</Text>
        <Text style={styles.optionBadge}>{option.period}</Text>
      </View>
      <Text style={styles.optionDescription}>
        {option.value === '2020-03-01' ? '코로나 시기 극한 상황 체험' : `${option.period} 투자 시뮬레이션`}
      </Text>
    </TouchableOpacity>
  );

  const renderIntervalOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionCard,
        tradingInterval === option.id && styles.optionCardSelected
      ]}
      onPress={() => setTradingInterval(option.id)}
    >
      <View style={styles.optionHeader}>
        <Text style={styles.optionLabel}>{option.label}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: option.color }]}>
          <Text style={styles.difficultyText}>{option.difficulty}</Text>
        </View>
      </View>
      <Text style={styles.optionDescription}>{option.description}</Text>
    </TouchableOpacity>
  );

  const renderDifficultyOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.difficultyCard,
        difficulty === option.id && styles.optionCardSelected
      ]}
      onPress={() => setDifficulty(option.id)}
    >
      <Text style={styles.difficultyLabel}>{option.label}</Text>
      <Text style={styles.difficultyDescription}>{option.description}</Text>
      <View style={styles.featuresList}>
        {option.features.map((feature, index) => (
          <Text key={index} style={styles.featureItem}>• {feature}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.backButtonText}>← 홈</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>시뮬레이션 설정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 소개 */}
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>🎮 투자 시뮬레이션</Text>
          <Text style={styles.introText}>
            과거 실제 주가 데이터로 시간여행을 떠나보세요!{'\n'}
            선택한 시점부터 단계별로 투자 결정을 내리며{'\n'}
            실전 같은 투자 경험을 쌓을 수 있습니다.
          </Text>
        </View>

        {/* 시작 시점 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 시작 시점 선택</Text>
          <Text style={styles.sectionSubtitle}>어느 시점부터 투자를 시작할까요?</Text>
          {startDateOptions.map(renderStartDateOption)}
        </View>

        {/* 거래 주기 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ 거래 주기 선택</Text>
          <Text style={styles.sectionSubtitle}>얼마나 자주 투자 결정을 내릴까요?</Text>
          {intervalOptions.map(renderIntervalOption)}
        </View>

        {/* 난이도 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 난이도 선택</Text>
          <Text style={styles.sectionSubtitle}>어느 정도의 도움을 받으시겠어요?</Text>
          {difficultyOptions.map(renderDifficultyOption)}
        </View>

        {/* 추가 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ 추가 설정</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>초기 투자 자금</Text>
              <Text style={styles.settingValue}>${initialAmount.toLocaleString()}</Text>
            </View>
            <Text style={styles.settingNote}>(현재 고정값)</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>AI 투자 코치</Text>
              <Text style={styles.settingDescription}>
                각 단계에서 AI의 투자 조언을 받습니다
              </Text>
            </View>
            <Switch
              value={enableAI}
              onValueChange={setEnableAI}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={enableAI ? '#007bff' : '#f4f3f4'}
            />
          </View>
        </View>
        {/* 🔄 초기화 버튼 추가 */}
        <View style={styles.resetButtonContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                '🔄 시뮬레이션 초기화',
                '현재 설정을 기본값으로 초기화하시겠습니까?',
                [
                  { text: '취소', style: 'cancel' },
                  {
                    text: '초기화',
                    style: 'destructive',
                    onPress: () => {
                      setStartDate('2023-01-01');
                      setTradingInterval('monthly');
                      setDifficulty('normal');
                      setEnableAI(true);
                      Alert.alert('완료', '설정이 초기화되었습니다.');
                    }
                  }
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.resetButtonIcon}>🔄</Text>
            <Text style={styles.resetButtonText}>설정 초기화</Text>
          </TouchableOpacity>
        </View>
        {/* 시작 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={handleStartSimulation}>
            <Text style={styles.startButtonText}>🚀 시뮬레이션 시작하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.practiceButton}
            onPress={() => navigation.navigate('StockList')}
          >
            <Text style={styles.practiceButtonText}>📚 자유 연습 모드</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 여백 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  introCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  introText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionBadge: {
    fontSize: 12,
    color: '#007bff',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  difficultyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  difficultyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  difficultyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  featuresList: {
    marginLeft: 10,
  },
  featureItem: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  settingNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#28a745',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  practiceButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  practiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 30,
  },
  resetButtonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#6c757d',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#5a6268',
  },
  resetButtonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SimulationSetupScreen;
