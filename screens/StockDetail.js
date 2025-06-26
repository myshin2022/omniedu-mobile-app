import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MobileAIAnalysisService from '../services/MobileAIAnalysisService';

export default function StockDetail({ navigation, route }) { // ⭐ 원래대로 props 사용
  const { symbol } = route.params || {};
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ⭐ error state 추가

  const fetchStockDetail = async () => {
    try {
      setLoading(true);
      setError(null); // ⭐ 에러 초기화
      console.log(`📊 ${symbol} 상세 정보 요청 중...`);

      // 1단계: Flask API에서 기본 데이터 시도
      const response = await fetch('https://learntoinvestai.com/api/all_stocks_data');
      const data = await response.json();
      const stockInfo = data.stocks?.find(stock => stock.ticker === symbol);

      if (stockInfo && stockInfo.ai_insight) {
        // Flask DB에 완전한 정보가 있는 경우
        console.log(`✅ ${symbol} Flask DB 데이터 사용:`, stockInfo);
        setStockData({
          name: stockInfo.name,
          price: stockInfo.price,
          ai_insight: stockInfo.ai_insight,
          ticker: stockInfo.ticker,
          source: 'flask_db'
        });
      } else {
        // 2단계: Flask에 정보가 없거나 불완전한 경우 → AI 생성
        console.log(`🤖 ${symbol} AI 분석 생성 중...`);

        const currentPrice = stockInfo?.price || 'N/A';
        const companyName = stockInfo?.name || symbol;

        // AI 분석 생성
        const aiAnalysis = await MobileAIAnalysisService.generateAnalysis(
          symbol,
          currentPrice,
          companyName
        );

        setStockData({
          name: companyName,
          price: currentPrice,
          ai_insight: aiAnalysis,
          ticker: symbol,
          source: 'ai_generated'
        });

        console.log(`✨ ${symbol} AI 분석 완료!`);
      }

    } catch (error) {
      console.error(`❌ ${symbol} 데이터 로드 실패:`, error);
      setError(`${symbol} 정보를 불러오는데 실패했습니다.`);

      // 최후 방법: 기본 정보라도 표시
      setStockData({
        name: symbol,
        price: 'N/A',
        ai_insight: `${symbol}에 대한 분석을 준비 중입니다. 잠시 후 다시 시도해주세요.`,
        ticker: symbol,
        source: 'fallback'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) { // ⭐ symbol 체크 추가
      fetchStockDetail();
    }
  }, [symbol]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>
          {symbol} 분석 중... 🤖
        </Text>
      </SafeAreaView>
    );
  }

  if (error && !stockData) { // ⭐ stockData 체크 추가
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchStockDetail}
        >
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!stockData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>데이터를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{stockData.name}</Text>
          <Text style={styles.ticker}>({stockData.ticker})</Text>
          <Text style={styles.price}>
            {stockData.price !== 'N/A' ? `$${stockData.price}` : '가격 정보 없음'}
          </Text>

          {/* 데이터 소스 표시 */}
          <Text style={styles.sourceInfo}>
            {stockData.source === 'flask_db' && '📊 DB 데이터'}
            {stockData.source === 'ai_generated' && '🤖 AI 생성'}
            {stockData.source === 'fallback' && '⚡ 기본 정보'}
          </Text>
        </View>

        <View style={styles.analysisSection}>
          <Text style={styles.analysisTitle}>AI 투자 분석</Text>
          <Text style={styles.analysisContent}>
            {stockData.ai_insight}
          </Text>
        </View>

        {/* ⭐ 돌아가기 버튼 (이전 커밋 방식) */}
        <TouchableOpacity 
          style={styles.backButtonFull}
          onPress={() => {
            console.log('🔙 주식거래로 돌아가기 버튼 클릭됨');
            navigation.navigate('SimulationProgress');
          }}
        >
          <Text style={styles.backTextFull}>📈 주식거래로 돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    padding: 20,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ticker: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  sourceInfo: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  analysisSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  analysisContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  backButtonFull: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  backTextFull: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

// ⭐ 이 줄 제거: export default StockDetail;

