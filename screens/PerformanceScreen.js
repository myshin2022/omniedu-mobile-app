// screens/PerformanceScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const PerformanceScreen = ({ navigation }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1M'); // 1D, 1W, 1M, 3M, 1Y
  const [loading, setLoading] = useState(true);

  // 샘플 데이터 생성 (실제로는 Flask API에서 가져와야 함)
  useEffect(() => {
    generateSampleData();
  }, [selectedPeriod]);

  const generateSampleData = () => {
    setLoading(true);
    
    // 시뮬레이션된 성과 데이터
    const baseAmount = 100000;
    const currentAmount = 100000; // 실제로는 API에서 가져와야 함
    
    // 시간별 포트폴리오 가치 변화 (샘플)
    const timeSeriesData = [];
    const periods = selectedPeriod === '1D' ? 24 : 
                   selectedPeriod === '1W' ? 7 : 
                   selectedPeriod === '1M' ? 30 : 
                   selectedPeriod === '3M' ? 90 : 365;
    
    for (let i = 0; i <= periods; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (periods - i));
      
      // 랜덤한 포트폴리오 변화 시뮬레이션
      const randomChange = (Math.random() - 0.48) * 0.02; // 약간 상승 편향
      const value = i === 0 ? baseAmount : 
                   timeSeriesData[i-1].value * (1 + randomChange);
      
      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        change: i === 0 ? 0 : value - timeSeriesData[i-1].value
      });
    }

    // 포트폴리오 구성 (파이 차트용)
    const portfolioComposition = [
      { name: 'AAPL', value: 19645, color: '#1f77b4', percentage: 19.6 },
      { name: 'ETH-USD', value: 2520, color: '#ff7f0e', percentage: 2.5 },
      { name: 'AMZN', value: 2121, color: '#2ca02c', percentage: 2.1 },
      { name: 'NVDA', value: 142, color: '#d62728', percentage: 0.1 },
      { name: 'Others', value: 3072, color: '#9467bd', percentage: 3.1 },
      { name: 'Cash', value: 75208, color: '#8c564b', percentage: 72.6 }
    ];

    // 거래 통계
    const tradingStats = {
      totalTrades: 11,
      winningTrades: 6,
      losingTrades: 2,
      breakEvenTrades: 3,
      winRate: 54.5,
      avgGain: 8.7,
      avgLoss: -3.2,
      bestTrade: { ticker: 'NVDA', gain: 12.5 },
      worstTrade: { ticker: 'TSLA', loss: -2.1 }
    };

    // 성과 지표
    const performanceMetrics = {
      totalReturn: ((currentAmount - baseAmount) / baseAmount * 100).toFixed(2),
      totalReturnAmount: currentAmount - baseAmount,
      dayChange: 2.34,
      weekChange: -1.23,
      monthChange: 5.67,
      maxDrawdown: -8.45,
      sharpeRatio: 1.23,
      volatility: 15.4
    };

    setPerformanceData({
      timeSeriesData,
      portfolioComposition,
      tradingStats,
      performanceMetrics,
      currentAmount
    });
    
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>성과 데이터 분석 중...</Text>
      </View>
    );
  }

  const renderPerformanceCard = () => (
    <View style={styles.performanceCard}>
      <Text style={styles.cardTitle}>📈 총 투자 성과</Text>
      <View style={styles.performanceRow}>
        <View style={styles.performanceMain}>
          <Text style={styles.currentValue}>
            ${performanceData.currentAmount.toLocaleString()}
          </Text>
          <View style={styles.returnContainer}>
            <Text style={[
              styles.returnText,
              { color: performanceData.performanceMetrics.totalReturn >= 0 ? '#28a745' : '#dc3545' }
            ]}>
              {performanceData.performanceMetrics.totalReturn >= 0 ? '+' : ''}
              ${performanceData.performanceMetrics.totalReturnAmount.toLocaleString()}
              ({performanceData.performanceMetrics.totalReturn >= 0 ? '+' : ''}{performanceData.performanceMetrics.totalReturn}%)
            </Text>
          </View>
        </View>
      </View>
      
      {/* 기간별 수익률 */}
      <View style={styles.periodReturns}>
        <View style={styles.periodItem}>
          <Text style={styles.periodLabel}>1일</Text>
          <Text style={[styles.periodValue, { color: '#28a745' }]}>+{performanceData.performanceMetrics.dayChange}%</Text>
        </View>
        <View style={styles.periodItem}>
          <Text style={styles.periodLabel}>1주</Text>
          <Text style={[styles.periodValue, { color: '#dc3545' }]}>{performanceData.performanceMetrics.weekChange}%</Text>
        </View>
        <View style={styles.periodItem}>
          <Text style={styles.periodLabel}>1개월</Text>
          <Text style={[styles.periodValue, { color: '#28a745' }]}>+{performanceData.performanceMetrics.monthChange}%</Text>
        </View>
      </View>
    </View>
  );

  const renderTimeSeriesChart = () => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.cardTitle}>📊 포트폴리오 가치 추이</Text>
        <View style={styles.periodSelector}>
          {['1D', '1W', '1M', '3M', '1Y'].map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* 간단한 시각적 차트 표현 */}
      <View style={styles.chartContainer}>
        <View style={styles.chartYAxis}>
          <Text style={styles.axisLabel}>$110K</Text>
          <Text style={styles.axisLabel}>$105K</Text>
          <Text style={styles.axisLabel}>$100K</Text>
          <Text style={styles.axisLabel}>$95K</Text>
          <Text style={styles.axisLabel}>$90K</Text>
        </View>
        
        <View style={styles.chartArea}>
          {/* 간단한 선형 차트 시뮬레이션 */}
          <View style={styles.chartLine}>
            {[...Array(20)].map((_, index) => {
              const height = 30 + Math.sin(index * 0.5) * 20 + index * 2;
              return (
                <View 
                  key={index}
                  style={[
                    styles.chartPoint,
                    { 
                      height: height,
                      backgroundColor: height > 50 ? '#28a745' : '#dc3545'
                    }
                  ]}
                />
              );
            })}
          </View>
          
          <View style={styles.chartXAxis}>
            <Text style={styles.axisLabel}>시작</Text>
            <Text style={styles.axisLabel}>25%</Text>
            <Text style={styles.axisLabel}>50%</Text>
            <Text style={styles.axisLabel}>75%</Text>
            <Text style={styles.axisLabel}>현재</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.chartSummary}>
        <Text style={styles.chartDataText}>
          📈 {selectedPeriod} 기간 | 시작: $100,000 → 현재: ${performanceData.currentAmount.toLocaleString()}
        </Text>
        <Text style={styles.chartDataText}>
          최고점: $108,500 | 최저점: $92,300 | 변동률: 16.5%
        </Text>
      </View>
    </View>
  );

  const renderPortfolioComposition = () => (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>🥧 포트폴리오 구성</Text>
      
      {/* 시각적 파이 차트 시뮬레이션 */}
      <View style={styles.pieChartVisual}>
        <View style={styles.pieChartCenter}>
          <Text style={styles.pieChartCenterText}>총 자산</Text>
          <Text style={styles.pieChartCenterValue}>$100K</Text>
        </View>
        
        {/* 파이 차트 조각들을 원형으로 배치 */}
        {performanceData.portfolioComposition.map((item, index) => {
          const angle = (item.percentage / 100) * 360;
          return (
            <View 
              key={index}
              style={[
                styles.pieSlice,
                { 
                  backgroundColor: item.color,
                  transform: [{ rotate: `${index * 45}deg` }]
                }
              ]}
            />
          );
        })}
      </View>
      
      <View style={styles.pieChartLegend}>
        {performanceData.portfolioComposition.map((item, index) => (
          <View key={index} style={styles.compositionItem}>
            <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
            <Text style={styles.compositionName}>{item.name}</Text>
            <Text style={styles.compositionValue}>{item.percentage}%</Text>
            <Text style={styles.compositionAmount}>${item.value.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTradingStats = () => (
    <View style={styles.statsCard}>
      <Text style={styles.cardTitle}>📋 거래 통계</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{performanceData.tradingStats.totalTrades}</Text>
          <Text style={styles.statLabel}>총 거래</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#28a745' }]}>
            {performanceData.tradingStats.winRate}%
          </Text>
          <Text style={styles.statLabel}>승률</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#28a745' }]}>
            +{performanceData.tradingStats.avgGain}%
          </Text>
          <Text style={styles.statLabel}>평균 수익</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#dc3545' }]}>
            {performanceData.tradingStats.avgLoss}%
          </Text>
          <Text style={styles.statLabel}>평균 손실</Text>
        </View>
      </View>
      
      <View style={styles.bestWorstTrades}>
        <View style={styles.tradeItem}>
          <Text style={styles.tradeLabel}>🏆 최고 거래</Text>
          <Text style={[styles.tradeValue, { color: '#28a745' }]}>
            {performanceData.tradingStats.bestTrade.ticker} +{performanceData.tradingStats.bestTrade.gain}%
          </Text>
        </View>
        <View style={styles.tradeItem}>
          <Text style={styles.tradeLabel}>📉 최악 거래</Text>
          <Text style={[styles.tradeValue, { color: '#dc3545' }]}>
            {performanceData.tradingStats.worstTrade.ticker} {performanceData.tradingStats.worstTrade.loss}%
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAdvancedMetrics = () => (
    <View style={styles.metricsCard}>
      <Text style={styles.cardTitle}>📈 고급 지표</Text>
      <View style={styles.metricsGrid}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>최대 낙폭</Text>
          <Text style={[styles.metricValue, { color: '#dc3545' }]}>
            {performanceData.performanceMetrics.maxDrawdown}%
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>샤프 비율</Text>
          <Text style={styles.metricValue}>
            {performanceData.performanceMetrics.sharpeRatio}
          </Text>
        </View>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>변동성</Text>
          <Text style={styles.metricValue}>
            {performanceData.performanceMetrics.volatility}%
          </Text>
        </View>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>성과 분석</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPerformanceCard()}
        {renderTimeSeriesChart()}
        {renderPortfolioComposition()}
        {renderTradingStats()}
        {renderAdvancedMetrics()}
        
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // 늘림: 50 → 60
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    zIndex: 1000, // 추가: 다른 요소 위에 표시
  },
  backButton: {
    padding: 12, // 늘림: 8 → 12
    backgroundColor: '#007bff', // 배경색 추가
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 16,
    color: 'white', // 변경: #007bff → white
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
  stockButton: {
    padding: 12, // 늘림: 8 → 12
    backgroundColor: '#28a745',
    borderRadius: 6,
    minWidth: 60, // 최소 너비 추가
    alignItems: 'center',
  },
  stockButtonText: {
    color: 'white',
    fontSize: 14, // 늘림: 12 → 14
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  performanceCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceMain: {
    flex: 1,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  returnContainer: {
    marginTop: 5,
  },
  returnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  periodReturns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  periodItem: {
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  chartCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
  },
  periodButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  periodButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#666',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    paddingRight: 10,
    width: 40,
  },
  chartArea: {
    flex: 1,
  },
  chartLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  chartPoint: {
    width: 3,
    backgroundColor: '#28a745',
    borderRadius: 1,
    minHeight: 2,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
  },
  chartSummary: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  chartPlaceholderText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartDataText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  pieChartContainer: {
    paddingHorizontal: 10,
  },
  pieChartVisual: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  pieChartCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    zIndex: 10,
  },
  pieChartCenterText: {
    fontSize: 10,
    color: '#666',
  },
  pieChartCenterValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  pieSlice: {
    position: 'absolute',
    width: 15,
    height: 60,
    borderRadius: 2,
    opacity: 0.7,
  },
  pieChartLegend: {
    paddingHorizontal: 10,
  },
  compositionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  compositionName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  compositionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
    width: 40,
    textAlign: 'right',
    marginRight: 10,
  },
  compositionAmount: {
    fontSize: 12,
    color: '#666',
    width: 70,
    textAlign: 'right',
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  bestWorstTrades: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  tradeItem: {
    flex: 1,
    alignItems: 'center',
  },
  tradeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tradeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default PerformanceScreen;
