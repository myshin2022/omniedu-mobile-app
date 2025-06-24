import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SimulationHistory = ({ navigation }) => {
  const [simulationHistory, setSimulationHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalSimulations: 0,
    averageScore: 0,
    bestScore: 0,
    improvementTrend: 0
  });

  // 시뮬레이션 이력 로드
  const loadSimulationHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('simulationHistory');
      
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        setSimulationHistory(history);
        
        // 통계 계산
        calculateStats(history);
        
        console.log('✅ 시뮬레이션 이력 로드:', history.length, '개');
      } else {
        console.log('📭 저장된 시뮬레이션 이력 없음');
        setSimulationHistory([]);
      }
    } catch (error) {
      console.error('❌ 시뮬레이션 이력 로드 오류:', error);
      Alert.alert('오류', '시뮬레이션 이력을 불러오는데 실패했습니다.');
    }
  };

  // 통계 계산
  const calculateStats = (history) => {
    if (history.length === 0) {
      setStats({
        totalSimulations: 0,
        averageScore: 0,
        bestScore: 0,
        improvementTrend: 0
      });
      return;
    }

    const totalSimulations = history.length;
    const scores = history.map(item => item.finalScore);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    
    // 향상 추세 계산 (최근 5개 vs 이전 5개)
    let improvementTrend = 0;
    if (history.length >= 10) {
      const recent5 = scores.slice(0, 5);
      const previous5 = scores.slice(5, 10);
      const recentAvg = recent5.reduce((sum, score) => sum + score, 0) / 5;
      const previousAvg = previous5.reduce((sum, score) => sum + score, 0) / 5;
      improvementTrend = recentAvg - previousAvg;
    }

    setStats({
      totalSimulations,
      averageScore,
      bestScore,
      improvementTrend
    });
  };

  useEffect(() => {
    loadSimulationHistory();
  }, []);

  // 새로고침
  const onRefresh = async () => {
    setRefreshing(true);
    await loadSimulationHistory();
    setRefreshing(false);
  };

  // 등급별 색상
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'S++': return '#ff6b35';
      case 'S+': return '#ff8c42';
      case 'S': return '#ffa726';
      case 'A+': return '#66bb6a';
      case 'A': return '#42a5f5';
      case 'B+': return '#ab47bc';
      case 'B': return '#8e24aa';
      default: return '#757575';
    }
  };

  // 등급별 이모지
  const getGradeEmoji = (grade) => {
    switch (grade) {
      case 'S++': return '🏆';
      case 'S+': return '🥇';
      case 'S': return '🎖️';
      case 'A+': return '⭐';
      case 'A': return '🌟';
      case 'B+': return '📈';
      case 'B': return '📊';
      default: return '💪';
    }
  };

  // 시뮬레이션 결과 항목 렌더링
  const renderSimulationItem = (item, index) => {
    return (
      <View key={item.id} style={styles.simulationCard}>
        <View style={styles.simulationHeader}>
          <View style={styles.gradeSection}>
            <Text style={styles.gradeEmoji}>{getGradeEmoji(item.grade)}</Text>
            <Text style={[styles.gradeText, { color: getGradeColor(item.grade) }]}>
              {item.grade}
            </Text>
          </View>
          <View style={styles.dateSection}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>수익률</Text>
          <Text style={[styles.scoreValue, { color: getGradeColor(item.grade) }]}>
            {item.finalScore.toFixed(2)}%
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>초기 금액:</Text>
            <Text style={styles.detailValue}>${item.initialAmount?.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>최종 금액:</Text>
            <Text style={styles.detailValue}>${item.finalAmount?.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>수익:</Text>
            <Text style={[styles.detailValue, { color: '#28a745' }]}>
              +${item.profit?.toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>기간:</Text>
            <Text style={styles.detailValue}>{item.duration}개월</Text>
          </View>
        </View>

        {item.aiComment && (
          <View style={styles.commentSection}>
            <Text style={styles.commentText}>
              🤖 AI 분석: {item.aiComment}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 성과 이력</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 통계 요약 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalSimulations}</Text>
          <Text style={styles.statLabel}>총 시뮬레이션</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.averageScore.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>평균 수익률</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.bestScore.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>최고 기록</Text>
        </View>
        {stats.improvementTrend !== 0 && (
          <View style={styles.statCard}>
            <Text style={[
              styles.statValue, 
              { color: stats.improvementTrend > 0 ? '#28a745' : '#dc3545' }
            ]}>
              {stats.improvementTrend > 0 ? '+' : ''}{stats.improvementTrend.toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>개선도</Text>
          </View>
        )}
      </View>

      {/* 시뮬레이션 이력 리스트 */}
      <ScrollView 
        style={styles.historyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {simulationHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>📊</Text>
            <Text style={styles.emptyStateTitle}>시뮬레이션 이력이 없습니다</Text>
            <Text style={styles.emptyStateSubtext}>
              첫 번째 시뮬레이션을 실행하고 결과를 저장해보세요!
            </Text>
          </View>
        ) : (
          simulationHistory.map((item, index) => renderSimulationItem(item, index))
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#007AFF'}]}
          onPress={() => navigation.navigate('SimulationSetup')}
        >
          <Text style={styles.buttonText}>🎮 새 시뮬레이션</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#28a745'}]}
          onPress={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.buttonText}>🏠 홈으로</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  simulationCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  simulationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gradeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradeEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  gradeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#6c757d',
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentSection: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  commentText: {
    fontSize: 14,
    color: '#1565c0',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimulationHistory;
