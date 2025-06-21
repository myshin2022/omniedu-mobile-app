// screens/StockListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';

const StockListScreen = ({ navigation }) => {
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';

  // 주식 데이터 가져오기
  const fetchStocksData = async () => {
    try {
      console.log('📈 주식 데이터 요청 중...');
      console.log('🔗 API URL:', `${FLASK_API_BASE_URL}/api/all_stocks_data`);
      
      const response = await axios.get(`${FLASK_API_BASE_URL}/api/all_stocks_data`, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('✅ 주식 데이터 수신:', response.data);
      setStocksData(response.data.stocks || []);
    } catch (error) {
      console.error('❌ 주식 데이터 로드 실패:', error);
      console.log('🔍 에러 상세 정보:');
      console.log('  - 에러 코드:', error.code);
      console.log('  - 에러 메시지:', error.message);
      
      if (error.response) {
        console.log('  - 응답 상태:', error.response.status);
        console.log('  - 응답 데이터:', error.response.data);
        console.log('  - 응답 헤더:', error.response.headers);
      }
      
      let errorMessage = '주식 데이터를 불러올 수 없습니다.';
      if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response) {
        errorMessage = `서버 오류: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = '네트워크 연결을 확인하세요.';
      }
      
      Alert.alert('오류', errorMessage);
      
      // 테스트용 더미 데이터 (개발 중에만 사용)
      console.log('🧪 테스트용 더미 데이터 사용');
      setStocksData([
        {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          price: 150.00,
          ai_insight: 'AI 코치: 테스트 데이터입니다. BUY 추천.'
        },
        {
          ticker: 'MSFT',
          name: 'Microsoft Corp.',
          price: 300.00,
          ai_insight: 'AI 코치: 테스트 데이터입니다. HOLD 추천.'
        },
        {
          ticker: 'NVDA',
          name: 'NVIDIA Corporation',
          price: 420.00,
          ai_insight: 'AI 코치: 테스트 데이터입니다. 강력한 BUY 추천.'
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 화면 로드 시 데이터 가져오기
  useEffect(() => {
    fetchStocksData();
  }, []);

  // 새로고침
  const onRefresh = () => {
    setRefreshing(true);
    fetchStocksData();
  };

  // 주식 매수 함수
  const buyStock = (ticker, price) => {
    Alert.prompt(
      '주식 매수',
      `${ticker} (현재가: $${price.toFixed(2)})를 몇 주 매수하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '매수',
          onPress: async (quantity) => {
            if (!quantity || isNaN(quantity) || quantity <= 0) {
              Alert.alert('오류', '올바른 수량을 입력해주세요.');
              return;
            }

            try {
              console.log(`💰 ${ticker} ${quantity}주 매수 시도...`);
              console.log(`💰 예상 비용: ${(price * quantity).toFixed(2)}`);
              
              const response = await axios.post(`${FLASK_API_BASE_URL}/api/buy`, {
                ticker: ticker,
                quantity: parseInt(quantity)
              }, {
                timeout: 10000,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                }
              });

              console.log('📥 매수 응답:', response.data);

              if (response.data.success) {
                Alert.alert('매수 성공', response.data.message);
                console.log('✅ 매수 성공:', response.data);
                // 거래 성공 후 주식 데이터 새로고침
                fetchStocksData();
              } else {
                Alert.alert('매수 실패', response.data.message);
                console.log('❌ 매수 실패:', response.data);
              }
            } catch (error) {
              console.error('❌ 매수 API 오류:', error);
              console.log('🔍 에러 상세 정보:');
              console.log('  - 상태 코드:', error.response?.status);
              console.log('  - 응답 데이터:', error.response?.data);
              console.log('  - 에러 메시지:', error.message);
              
              let errorMessage = '매수 요청 중 오류가 발생했습니다.';
              if (error.response?.status === 400) {
                errorMessage = error.response?.data?.message || '잘못된 요청입니다. 수량이나 잔고를 확인해주세요.';
              } else if (error.response?.status === 401) {
                errorMessage = '로그인이 필요합니다.';
              } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              }
              Alert.alert('매수 오류', errorMessage);
            }
          }
        }
      ],
      'plain-text',
      '1'
    );
  };

  // 주식 매도 함수
  const sellStock = (ticker, price) => {
    Alert.prompt(
      '주식 매도',
      `${ticker} (현재가: $${price.toFixed(2)})를 몇 주 매도하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '매도',
          onPress: async (quantity) => {
            if (!quantity || isNaN(quantity) || quantity <= 0) {
              Alert.alert('오류', '올바른 수량을 입력해주세요.');
              return;
            }

            try {
              console.log(`💸 ${ticker} ${quantity}주 매도 시도...`);
              const response = await axios.post(`${FLASK_API_BASE_URL}/api/sell`, {
                ticker: ticker,
                quantity: parseInt(quantity)
              }, {
                timeout: 10000,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                }
              });

              if (response.data.success) {
                Alert.alert('매도 성공', response.data.message);
                console.log('✅ 매도 성공:', response.data);
                // 거래 성공 후 주식 데이터 새로고침
                fetchStocksData();
              } else {
                Alert.alert('매도 실패', response.data.message);
                console.log('❌ 매도 실패:', response.data);
              }
            } catch (error) {
              console.error('❌ 매도 API 오류:', error);
              let errorMessage = '매도 요청 중 오류가 발생했습니다.';
              if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
              }
              Alert.alert('매도 오류', errorMessage);
            }
          }
        }
      ],
      'plain-text',
      '1'
    );
  };

  // 검색 필터링
  const filteredStocks = stocksData.filter(stock =>
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 로딩 화면
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>주식 데이터 로딩 중...</Text>
      </View>
    );
  }

  // 주식 항목 렌더링
  const renderStockItem = (stock) => {
    const { ticker, name, price, ai_insight } = stock;
    
    // AI 인사이트에서 추천 등급 추출 (간단한 파싱)
    const getBuyRating = (insight) => {
      if (insight.includes('BUY')) return { rating: 'BUY', color: '#28a745' };
      if (insight.includes('SELL')) return { rating: 'SELL', color: '#dc3545' };
      if (insight.includes('HOLD')) return { rating: 'HOLD', color: '#ffc107' };
      return { rating: 'N/A', color: '#6c757d' };
    };

    const ratingInfo = getBuyRating(ai_insight);

    return (
      <View key={ticker} style={styles.stockItem}>
        <View style={styles.stockHeader}>
          <View style={styles.stockInfo}>
            <Text style={styles.tickerText}>{ticker}</Text>
            <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: ratingInfo.color }]}>
                {ratingInfo.rating}
              </Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${price.toFixed(2)}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.buyButton]}
                onPress={() => buyStock(ticker, price)}
              >
                <Text style={styles.actionButtonText}>매수</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.sellButton]}
                onPress={() => sellStock(ticker, price)}
              >
                <Text style={styles.actionButtonText}>매도</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AI 인사이트 (간략 표시) */}
        <TouchableOpacity 
          style={styles.insightContainer}
          onPress={() => {
            Alert.alert(
              `${ticker} AI 분석`,
              ai_insight,
              [{ text: '확인' }],
              { scrollEnabled: true }
            );
          }}
        >
          <Text style={styles.insightText} numberOfLines={2}>
            {ai_insight.length > 100 ? `${ai_insight.substring(0, 100)}...` : ai_insight}
          </Text>
          <Text style={styles.viewMoreText}>자세히 보기 →</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>주식 거래</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.performanceButton}
            onPress={() => navigation.navigate('Performance')}
          >
            <Text style={styles.performanceButtonText}>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
                { text: '취소', style: 'cancel' },
                { 
                  text: '로그아웃', 
                  style: 'destructive',
                  onPress: () => navigation.navigate('Login')
                }
              ]);
            }}
          >
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 검색바 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="주식 검색 (티커 또는 회사명)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
      </View>

      {/* 주식 목록 */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.stocksContainer}>
          {filteredStocks.length === 0 ? (
            <Text style={styles.noResultsText}>
              {searchQuery ? '검색 결과가 없습니다.' : '주식 데이터가 없습니다.'}
            </Text>
          ) : (
            filteredStocks.map(renderStockItem)
          )}
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
    paddingTop: 50, // 상태바 고려
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60, // backButton과 균형 맞추기
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  performanceButton: {
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  performanceButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  stocksContainer: {
    padding: 20,
  },
  stockItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stockInfo: {
    flex: 1,
    marginRight: 12,
  },
  tickerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  nameText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  ratingContainer: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#28a745',
  },
  sellButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  insightText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  viewMoreText: {
    fontSize: 12,
    color: '#007bff',
    fontWeight: '600',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 40,
    fontSize: 16,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default StockListScreen;
