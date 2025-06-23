// screens/InvestmentReportCard.js - 완성된 투자 성적표 (개념화 분석 포함)
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

const {width} = Dimensions.get('window');

export default function InvestmentReportCard({navigation, route}) {
  const {simulationResults, userProfile} = route?.params || {};
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('total');

  return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* 헤더 */}
        <View style={{padding: 20, paddingTop: 60, borderBottomWidth: 1, borderColor: '#ddd'}}>
          <View style={{padding: 20, paddingTop: 60, borderBottomWidth: 1, borderColor: '#ddd'}}>
            <Text style={{fontSize: 16, color: 'red', backgroundColor: 'yellow'}}>테스트</Text>
            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
              📊 투자 성적표
            </Text>
          </View>
        </View>

        {/* 메인 성과 - 기존 코드 그대로 */}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <View
              style={{backgroundColor: '#f0f8ff', padding: 30, borderRadius: 15, width: '100%', alignItems: 'center'}}>
            <Text style={{fontSize: 36, fontWeight: 'bold', color: 'green', marginBottom: 10}}>
              +914%
            </Text>
            <Text style={{fontSize: 18, color: '#666', marginBottom: 20}}>
              총 수익률
            </Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: '#333'}}>
              초기 투자: $100,000
            </Text>
            <Text style={{fontSize: 16, textAlign: 'center', color: '#333'}}>
              최종 자산: $1,014,066
            </Text>
          </View>

          <View style={{marginTop: 30, padding: 20, backgroundColor: '#fff5f5', borderRadius: 10}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>🤖 AI 코멘트</Text>
            <Text style={{fontSize: 14, color: '#333'}}>
              놀라운 성과입니다! NVDA 투자로 워렌 버핏급 수익률을 달성하셨네요! 🚀
            </Text>
          </View>
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
  shareButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
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
    marginBottom: 15,
  },
  gradeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gradeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  gradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gradeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  analysisCard: {
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
  // 🧠 개념화 분석 스타일
  conceptLevelSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
  },
  conceptLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  conceptDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightsSection: {
    marginTop: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  insightCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  insightComment: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  evidenceSection: {
    marginTop: 8,
  },
  evidenceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  evidenceText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
    marginBottom: 2,
  },
  recommendationsSection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 6,
    lineHeight: 18,
  },
  // 🧬 DNA 분석 전용 스타일
  investorTypeSection: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  investorTypeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  investorTypeDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  strengthsContainer: {
    marginBottom: 12,
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  strengthsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  strengthTag: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  idealStrategyContainer: {
    marginTop: 12,
  },
  idealStrategyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  idealStrategyText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  dnaTraitsSection: {
    marginBottom: 20,
  },
  dnaTraitsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dnaPrimaryCard: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  dnaSecondaryCard: {
    flex: 1,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  dnaLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  dnaPrimary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  dnaSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  traitCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  traitType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  traitScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  traitInsight: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 6,
  },
  traitRecommendation: {
    fontSize: 11,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  roadmapSection: {
    marginBottom: 20,
  },
  roadmapStage: {
    marginBottom: 12,
  },
  roadmapStageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  roadmapItem: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginLeft: 8,
  },
  compatibleStylesSection: {
    marginBottom: 15,
  },
  styleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  styleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  styleName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  styleCompatibility: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#28a745',
  },
  styleReason: {
    fontSize: 11,
    color: '#666',
  },
  personalInsightsSection: {
    marginBottom: 10,
  },
  personalInsightCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 6,
  },
  insightContent: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 6,
  },
  insightActionable: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  tradeStats: {
    marginTop: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
