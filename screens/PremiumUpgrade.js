// screens/PremiumUpgrade.js
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { useUser } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function PremiumUpgrade({ navigation }) {
  const { purchasePremium, isPremium } = useUser();

  // 이미 프리미엄이면 메인으로 이동
  if (isPremium) {
    navigation.navigate('MainDashboard');
    return null;
  }

  const handlePurchase = async (plan) => {
    Alert.alert(
      '🎉 구매 확인',
      `${plan} 플랜을 구매하시겠습니까?\n\n※ 현재는 테스트 버전이므로 무료로 프리미엄 기능을 체험하실 수 있습니다!`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '구매 (무료체험)', 
          onPress: async () => {
            await purchasePremium();
            Alert.alert(
              '🎉 업그레이드 완료!', 
              '프리미엄 기능을 무제한으로 이용하실 수 있습니다!',
              [{ 
                text: '확인', 
                onPress: () => navigation.navigate('MainDashboard')
              }]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔓 프리미엄 업그레이드</Text>
        <View style={{width: 50}} />
      </View>

      <ScrollView style={styles.content}>
        {/* 현재 제한 안내 */}
        <View style={styles.limitNotice}>
          <Text style={styles.limitTitle}>🚫 현재 제한사항</Text>
          <Text style={styles.limitText}>• 월 5회 시뮬레이션 제한</Text>
          <Text style={styles.limitText}>• 기본 성적표만 제공</Text>
          <Text style={styles.limitText}>• 간단한 AI 코멘트만 제공</Text>
        </View>

        {/* 프리미엄 혜택 */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>✨ 프리미엄 혜택</Text>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🚀</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>무제한 시뮬레이션</Text>
              <Text style={styles.benefitDesc}>월 제한 없이 원하는 만큼 연습하세요!</Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🤖</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>고급 AI 투자 코치</Text>
              <Text style={styles.benefitDesc}>개인화된 상세 분석과 투자 조언</Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📊</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>상세 성과 분석</Text>
              <Text style={styles.benefitDesc}>투자 DNA 분석과 개념화 리포트</Text>
            </View>
          </View>
          
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📈</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>실시간 데이터</Text>
              <Text style={styles.benefitDesc}>최신 시장 데이터로 더욱 현실적인 시뮬레이션</Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>개인 맞춤 전략</Text>
              <Text style={styles.benefitDesc}>당신만의 투자 스타일 분석과 추천</Text>
            </View>
          </View>
        </View>

        {/* 요금제 */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>💰 요금제 선택</Text>
          
          {/* 월간 플랜 */}
          <TouchableOpacity 
            style={[styles.planCard, styles.monthlyPlan]}
            onPress={() => handlePurchase('월간')}
          >
            <Text style={styles.planTitle}>월간 플랜</Text>
            <Text style={styles.planPrice}>₩9,900/월</Text>
            <Text style={styles.planDesc}>언제든지 취소 가능</Text>
          </TouchableOpacity>

          {/* 연간 플랜 (할인) */}
          <TouchableOpacity 
            style={[styles.planCard, styles.yearlyPlan]}
            onPress={() => handlePurchase('연간')}
          >
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>30% 할인!</Text>
            </View>
            <Text style={styles.planTitle}>연간 플랜</Text>
            <Text style={styles.planPrice}>₩83,000/년</Text>
            <Text style={styles.planOriginalPrice}>₩118,800</Text>
            <Text style={styles.planDesc}>월 ₩6,900 (30% 절약)</Text>
          </TouchableOpacity>
        </View>

        {/* 7일 무료 체험 */}
        <TouchableOpacity 
          style={styles.freeTrialButton}
          onPress={() => handlePurchase('7일 무료 체험')}
        >
          <Text style={styles.freeTrialText}>🎁 7일 무료 체험 시작</Text>
          <Text style={styles.freeTrialSubtext}>체험 기간 중 언제든 취소 가능</Text>
        </TouchableOpacity>

        {/* 추천 리뷰 */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>⭐ 사용자 후기</Text>
          
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              "914% 수익률 달성! 프리미엄 AI 코치 덕분에 투자 실력이 늘었어요!"
            </Text>
            <Text style={styles.reviewAuthor}>- 투자왕김씨 ⭐⭐⭐⭐⭐</Text>
          </View>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              "무제한 시뮬레이션으로 다양한 전략을 테스트해볼 수 있어서 좋아요."
            </Text>
            <Text style={styles.reviewAuthor}>- 코스피마스터 ⭐⭐⭐⭐⭐</Text>
          </View>
        </View>
      </ScrollView>
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
  },
  limitNotice: {
    backgroundColor: '#fff3cd',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  limitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  limitText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  benefitsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 15,
    marginTop: 2,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  benefitDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e9ecef',
    position: 'relative',
  },
  monthlyPlan: {
    borderColor: '#007AFF',
  },
  yearlyPlan: {
    borderColor: '#28a745',
    backgroundColor: '#f8fff8',
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    backgroundColor: '#ff6b35',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  planOriginalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  planDesc: {
    fontSize: 14,
    color: '#666',
  },
  freeTrialButton: {
    backgroundColor: '#ff6b35',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  freeTrialText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  freeTrialSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  reviewSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
