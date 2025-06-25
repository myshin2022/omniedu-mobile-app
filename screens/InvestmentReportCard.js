import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../context/UserContext';

export default function InvestmentReportCard({navigation, route}) {
  const {simulationResults, username, level, email} = route?.params || {};
  const {isPremium} = useUser();
  // 🛡️ 안전한 변수 처리
  const safeUsername = username || 'Guest';
  const safeReturnPercentage = simulationResults?.returnPercentage || 0;
  const safeInitialAmount = simulationResults?.initialAmount || 100000;
  const safeTotalAssets = simulationResults?.totalAssets || safeInitialAmount;
  const safeDuration = simulationResults?.duration || 24;

  // 🔍 디버깅 로그
  console.log('🔍 Original data:', simulationResults?.returnPercentage, username);
  console.log('🔍 Safe processed:', safeReturnPercentage, safeUsername);

  const [aiComment, setAiComment] = useState('🤖 AI가 분석 중...');

  // 기존 변수들을 안전 변수로 교체
  const returnPercentage = safeReturnPercentage;
  const initialAmount = safeInitialAmount;
  const totalAssets = safeTotalAssets;
  const duration = safeDuration;
  // 등급 계산
  const getGrade = (return_pct) => {
    if (return_pct >= 500) return {grade: "S++", desc: "전설급 투자자", emoji: "👑"};
    if (return_pct >= 200) return {grade: "S+", desc: "투자 마스터", emoji: "🚀"};
    if (return_pct >= 100) return {grade: "A+", desc: "투자 고수", emoji: "⭐"};
    if (return_pct >= 50) return {grade: "A", desc: "우수한 투자자", emoji: "📈"};
    return {grade: "B", desc: "성장형 투자자", emoji: "🌱"};
  };

  const gradeInfo = getGrade(returnPercentage);
  useEffect(() => {
    // async 함수 없이 바로 호출
    const comment = generateAIComment();
    setAiComment(comment);
  }, [returnPercentage, username, duration]);
  const generateAIComment = () => {
    // async 제거, 즉시 개인화 코멘트 반환
    console.log(`개인화 코멘트 생성: ${username || 'Guest'}, 수익률: ${returnPercentage}%`);

    const name = username || 'Guest';

    if (returnPercentage >= 1000) {
      return `${name}님, 경이로운 성과입니다! 1000% 이상의 수익률은 전설급 투자 실력을 보여줍니다. 실제 투자에서도 이런 혜안을 발휘하시길!`;
    } else if (returnPercentage >= 500) {
      return `${name}님, 놀라운 통찰력입니다! 500% 이상의 수익률로 워렌 버핏급 성과를 거두셨네요. 이런 판단력이면 어떤 시장에서도 성공하실 거예요.`;
    } else if (returnPercentage >= 200) {
      return `${name}님, 정말 뛰어난 투자 감각이군요! 200% 이상의 수익률은 시장을 정확히 읽은 결과입니다. 계속 이런 신중함을 유지하세요.`;
    } else if (returnPercentage >= 100) {
      return `${name}님의 균형 잡힌 접근이 빛을 발했네요! 100% 이상 수익은 안정적이면서도 공격적인 훌륭한 투자 전략의 결과입니다.`;
    } else if (returnPercentage >= 50) {
      return `${name}님, 좋은 판단력을 보여주셨습니다! 50% 이상의 수익률은 신중한 분석의 결과죠. 이런 착실함이 장기적 성공의 열쇠입니다.`;
    } else if (returnPercentage >= 20) {
      return `${name}님, 안정적인 수익을 거두셨네요! 20% 이상은 많은 전문 투자자들도 달성하기 어려운 성과입니다. 꾸준히 성장해나가세요.`;
    } else if (returnPercentage >= 0) {
      return `${name}님, 플러스 수익을 달성하셨습니다! 손실 없는 투자도 훌륭한 성과예요. 이런 안전한 접근이 진정한 투자의 기본입니다.`;
    } else if (returnPercentage >= -20) {
      return `${name}님, 작은 손실이지만 귀중한 학습 기회였습니다. 모든 위대한 투자자들도 이런 과정을 거쳤어요. 다음엔 더 나은 결과가 있을 거예요.`;
    } else {
      return `${name}님, 투자에는 위험이 따르지만 이런 경험이 진짜 실력을 만듭니다. 포기하지 마시고 배움을 통해 성장해나가세요.`;
    }
  };

// 👇 여기에 saveSimulationResult 함수 추가!
  const saveSimulationResult = async () => {
    try {
      const simulationResult = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ko-KR'),
        time: new Date().toLocaleTimeString('ko-KR', {hour: '2-digit', minute: '2-digit'}),
        finalScore: returnPercentage,
        grade: gradeInfo.grade,
        gradeEmoji: gradeInfo.emoji,
        initialAmount: initialAmount,
        finalAmount: totalAssets,
        profit: totalAssets - initialAmount,
        duration: duration,
        aiComment: aiComment,
        strategy: 'AI 추천 중심',
        difficulty: 'normal'
      };

      const existingResults = await AsyncStorage.getItem('simulationHistory');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.unshift(simulationResult);

      if (results.length > 50) {
        results.splice(50);
      }

      await AsyncStorage.setItem('simulationHistory', JSON.stringify(results));

      Alert.alert(
          '💾 시뮬레이션 결과 저장!',
          `${gradeInfo.grade} 등급 결과가 이력에 저장되었습니다.`,
          [{text: '확인', style: 'default'}]
      );

      console.log('✅ 시뮬레이션 결과 저장 완료:', simulationResult);

    } catch (error) {
      console.error('❌ 시뮬레이션 결과 저장 오류:', error);
      Alert.alert('오류', '결과 저장 중 문제가 발생했습니다.');
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
            <Text style={styles.cardTitle}>💰 {safeUsername}님의 투자 성과</Text>
            <Text style={styles.detailText}>• 초기 투자: ${initialAmount.toLocaleString()}</Text>
            <Text style={styles.detailText}>• 최종 자산: ${totalAssets.toLocaleString()}</Text>
            <Text style={styles.detailText}>• 순수익: ${(totalAssets - initialAmount).toLocaleString()}</Text>
            <Text style={styles.detailText}>• 투자기간: {duration}개월</Text>
            <Text style={styles.detailText}>• 월평균: +{(returnPercentage / duration).toFixed(1)}%</Text>
          </View>

          {/* AI 코멘트 */}
          <View style={styles.commentCard}>
            <Text style={styles.cardTitle}>🤖 {safeUsername}님을 위한 AI 투자 코치</Text>
            <Text style={styles.commentText}>{aiComment}</Text>
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
          {/* 🆕 프리미엄 프롬프트 (여기에 추가) */}
          {!isPremium && (
              <View style={styles.premiumPrompt}>
                <Text style={styles.premiumTitle}>🔓 더 많은 기능을 원하시나요?</Text>
                <Text style={styles.premiumDesc}>
                  ✨ 무제한 시뮬레이션{'\n'}
                  🤖 고급 AI 분석{'\n'}
                  📊 상세 투자 DNA 보고서{'\n'}
                  📈 실시간 시장 데이터
                </Text>
                <TouchableOpacity
                    style={styles.premiumButton}
                    onPress={() => navigation.navigate('PremiumUpgrade')}
                >
                  <Text style={styles.premiumButtonText}>✨ 프리미엄 업그레이드</Text>
                </TouchableOpacity>
              </View>
          )}

          {/* 🆕 프리미엄 사용자 감사 메시지 */}
          {isPremium && (
              <View style={styles.premiumThankYou}>
                <Text style={styles.premiumThankYouTitle}>👑 프리미엄 사용자</Text>
                <Text style={styles.premiumThankYouText}>
                  무제한 기능을 이용해주셔서 감사합니다!
                </Text>
              </View>
          )}

        </ScrollView>

        {/* 시뮬레이션 성과 이력 버튼 */}
        <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#FF6B35', marginBottom: 12}]}
            onPress={() => navigation.navigate('SimulationHistory')}
        >
          <Text style={styles.buttonText}>📊 나의 성과 이력</Text>
        </TouchableOpacity>

        {/* 👇 바로 여기에 저장 버튼 추가! */}
        <TouchableOpacity
            style={[styles.actionButton, {backgroundColor: '#28a745', marginBottom: 12}]}
            onPress={saveSimulationResult}
        >
          <Text style={styles.buttonText}>💾 결과 저장</Text>
        </TouchableOpacity>
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
  // 🆕 프리미엄 관련 스타일들 (여기에 추가)
  premiumPrompt: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  premiumDesc: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  premiumButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  premiumButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumThankYou: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  premiumThankYouTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 6,
  },
  premiumThankYouText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
