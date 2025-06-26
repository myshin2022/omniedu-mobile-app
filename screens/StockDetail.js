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

export default function StockDetail({ navigation, route }) {
  const { symbol } = route.params || {};
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockDetail();
  }, []);

  const fetchStockDetail = async () => {
    try {
      console.log(`📊 ${symbol} 상세 정보 요청 중...`);

      const response = await fetch('https://learntoinvestai.com/api/all_stocks_data');
      const data = await response.json();

      const stockInfo = data.stocks?.find(stock => stock.ticker === symbol);

      if (stockInfo) {
        console.log(`✅ ${symbol} 데이터 발견:`, stockInfo);
        setStockData({
          name: stockInfo.name,
          price: stockInfo.price,
          ai_insight: stockInfo.ai_insight,
          ticker: stockInfo.ticker
        });
      } else {
        console.log(`❌ ${symbol} 데이터를 찾을 수 없음`);
        setStockData({
          name: symbol,
          price: 'N/A',
          ai_insight: `${symbol}에 대한 분석 정보를 불러올 수 없습니다.`,
          ticker: symbol
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('❌ 주식 상세 정보 로딩 실패:', error);

      setStockData({
        name: symbol,
        price: 'N/A',
        ai_insight: '분석 정보를 불러오는 중 오류가 발생했습니다.',
        ticker: symbol
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>📊 분석 정보 로딩 중...</Text>
      </View>
    );
  }

  if (!stockData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ 데이터를 불러올 수 없습니다</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchStockDetail}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            console.log('🔙 뒤로가기 버튼 클릭됨');
            navigation.navigate('SimulationProgress');
          }}
        >
          <Text style={styles.backButtonText}>← 주식거래</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{stockData?.name || symbol}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.priceSection}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.price}>${stockData?.price || 'N/A'}</Text>
          <Text style={styles.company}>{stockData?.name || symbol}</Text>
        </View>
        <View style={styles.analysisSection}>
          <Text style={styles.analysisTitle}>🤖 AI 투자 분석</Text>
          <Text style={styles.analysisText}>
            {stockData?.ai_insight ?
              String(stockData.ai_insight).substring(0, 3000) :
              '분석 정보를 불러오는 중입니다...'
            }
          </Text>

          {/* 🆕 뒤로가기 버튼 추가 */}
          <TouchableOpacity
            style={styles.backToTradingButton}
            onPress={() => {
              console.log('🔙 주식거래로 돌아가기 버튼 클릭됨');
              navigation.navigate('SimulationProgress');
            }}
          >
            <Text style={styles.backToTradingText}>📈 주식거래로 돌아가기</Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 2,
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  priceSection: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  symbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  company: {
    fontSize: 16,
    color: '#666',
  },
  analysisSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    flex: 1,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  // 🆕 추가된 버튼 스타일들
  backToTradingButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backToTradingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});