import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';

export default function InvestmentReportCard({navigation, route}) {
  const {simulationResults} = route?.params || {};

  // 데이터 추출
  const returnPercentage = simulationResults?.returnPercentage || 914.1;
  const initialAmount = simulationResults?.initialAmount || 100000;
  const totalAssets = simulationResults?.totalAssets || 1014066;
  const duration = simulationResults?.duration || 24;

  // 등급 계산
  const getGrade = (return_pct) => {
    if (return_pct >= 500) return {grade: "S++", desc: "전설급 투자자", emoji: "👑"};
    if (return_pct >= 200) return {grade: "S+", desc: "투자 마스터", emoji: "🚀"};
    if (return_pct >= 100) return {grade: "A+", desc: "투자 고수", emoji: "⭐"};
    if (return_pct >= 50) return {grade: "A", desc: "우수한 투자자", emoji: "📈"};
    return {grade: "B", desc: "성장형 투자자", emoji: "🌱"};
  };

  const gradeInfo = getGrade(returnPercentage);

  // AI 코멘트 생성
  const generateAIComment = () => {
    if (returnPercentage >= 500) {
      return "놀라운 성과입니다! NVDA 집중투자로 워렌 버핏급 수익률을 달성하셨네요. AI 혁명의 시작점을 정확히 포착한 전설적 투자였습니다! 다음에는 Circle의 스테이블코인 혁명을 주목해보세요.";
    } else if (returnPercentage >= 100) {
      return "훌륭한 투자 성과입니다! 시장을 이해하고 올바른 타이밍에 투자하셨네요. 이런 실력이면 더 큰 수익도 기대할 수 있습니다.";
    } else {
      return "좋은 시작입니다! 꾸준한 학습과 경험을 통해 더 나은 투자자로 성장하실 수 있어요. 포기하지 마시고 계속 도전해보세요!";
    }
  };

  return (
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.title}>📊 투자 성적표</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MainDashboard')}>
            <Text style={styles.backButton}>🏠 홈</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* 메인 성과 */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreEmoji}>{gradeInfo.emoji}</Text>
            <Text style={styles.scorePercentage}>+{returnPercentage.toFixed(1)}%</Text>
            <Text style={styles.scoreGrade}>{gradeInfo.grade}</Text>
            <Text style={styles.scoreDesc}>{gradeInfo.desc}</Text>
          </View>

          {/* 상세 정보 */}
          <View style={styles.detailCard}>
            <Text style={styles.cardTitle}>💰 투자 성과</Text>
            <Text style={styles.detailText}>• 초기 투자: ${initialAmount.toLocaleString()}</Text>
            <Text style={styles.detailText}>• 최종 자산: ${totalAssets.toLocaleString()}</Text>
            <Text style={styles.detailText}>• 순수익: ${(totalAssets - initialAmount).toLocaleString()}</Text>
            <Text style={styles.detailText}>• 투자기간: {duration}개월</Text>
            <Text style={styles.detailText}>• 월평균: +{(returnPercentage / duration).toFixed(1)}%</Text>
          </View>

          {/* AI 코멘트 */}
          <View style={styles.commentCard}>
            <Text style={styles.cardTitle}>🤖 AI 투자 코치</Text>
            <Text style={styles.commentText}>{generateAIComment()}</Text>
          </View>

          {/* 추천 */}
          <View style={styles.recommendCard}>
            <Text style={styles.cardTitle}>💡 다음 단계</Text>
            <Text style={styles.recommendText}>
              • 성공 패턴 분석하여 재현 가능한 전략 수립{'\n'}
              • 리스크 관리 시스템 구축{'\n'}
              • 새로운 투자 기회 발굴 (AI, 바이오, 에너지)
            </Text>
          </View>
        </ScrollView>

        {/* 🆕 하단 버튼들 추가 */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: '#007AFF'}]}
              onPress={() => navigation.navigate('SimulationSetup')}
          >
            <Text style={styles.buttonText}>🎮 다시 시뮬레이션</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: '#28a745'}]}
              onPress={() => navigation.navigate('MainDashboard')}
          >
            <Text style={styles.buttonText}>🏠 메인으로</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  scorePercentage: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 5,
  },
  scoreGrade: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  scoreDesc: {
    fontSize: 16,
    color: '#666',
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recommendCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  commentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  recommendText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});