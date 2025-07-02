// screens/StockListScreen.js - 로컬 처리 업데이트
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const StockListScreen = ({ navigation }) => {
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔧 로컬 거래용 state 추가
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(100000); // 초기 잔고

  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';

  // 🔧 포트폴리오 데이터 로드
  const loadPortfolioData = async () => {
    try {
      const savedPortfolio = await AsyncStorage.getItem('portfolio');
      const savedBalance = await AsyncStorage.getItem('balance');

      if (savedPortfolio) {
        setPortfolio(JSON.parse(savedPortfolio));
        console.log('📂 포트폴리오 로드됨:', JSON.parse(savedPortfolio));
      }
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
        console.log('💰 잔고 로드됨:', parseFloat(savedBalance));
      }
    } catch (error) {
      console.log('❌ 포트폴리오 로드 오류:', error);
    }
  };

  // 🔧 포트폴리오 데이터 저장
  const savePortfolioData = async (newPortfolio, newBalance) => {
    try {
      await AsyncStorage.setItem('portfolio', JSON.stringify(newPortfolio));
      await AsyncStorage.setItem('balance', newBalance.toString());
      console.log('💾 포트폴리오 저장됨:', { newPortfolio, newBalance });
    } catch (error) {
      console.log('❌ 포트폴리오 저장 오류:', error);
    }
  };

  // 화면 로드 시 데이터 가져오기
  useEffect(() => {
    loadPortfolioData(); // 포트폴리오 먼저 로드
    fetchStocksData();
  }, []);

  // 주식 데이터 가져오기 (AI 분석용)
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
          current_price: 196.45,
          ai_insight: 'AI 코치: 강력한 매수 추천. 애플의 혁신적인 제품 라인업과 안정적인 수익성이 기대됩니다.'
        },
        {
          ticker: 'MSFT',
          name: 'Microsoft Corp.',
          current_price: 474.96,
          ai_insight: 'AI 코치: 장기 보유 추천. 클라우드 사업의 지속적인 성장과 AI 투자로 밝은 전망입니다.'
        },
        {
          ticker: 'NVDA',
          name: 'NVIDIA Corporation',
          current_price: 520.78,
          ai_insight: 'AI 코치: AI 혁명의 핵심 기업. 데이터센터와 AI 칩 수요 급증으로 강력한 성장 전망.'
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 새로고침
  const onRefresh = () => {
    setRefreshing(true);
    fetchStocksData();
  };

  // 🔧 로컬 매수 함수 (시뮬레이션 방식)
  const buyStock = async (ticker, price) => {
    Alert.prompt(
      '주식 매수',
      `${ticker} (현재가: $${price.toFixed(2)})\n현재 잔고: $${balance.toFixed(2)}\n\n몇 주 매수하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '매수',
          onPress: async (quantity) => {
            if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
              Alert.alert('오류', '올바른 수량을 입력해주세요.');
              return;
            }

            const quantityNum = parseInt(quantity);
            const totalCost = price * quantityNum;

            console.log(`💰 ${ticker} ${quantityNum}주 매수 시도...`);
            console.log(`💰 예상 비용: $${totalCost.toFixed(2)}`);
            console.log(`💰 현재 잔고: $${balance.toFixed(2)}`);

            // 잔고 확인
            if (totalCost > balance) {
              Alert.alert(
                '❌ 매수 실패',
                `잔액이 부족합니다!\n\n필요 금액: $${totalCost.toFixed(2)}\n현재 잔액: $${balance.toFixed(2)}\n부족 금액: $${(totalCost - balance).toFixed(2)}`
              );
              return;
            }

            // 새 잔고 계산
            const newBalance = balance - totalCost;

            // 기존 보유량 확인
            const currentHolding = portfolio[ticker] || { quantity: 0, avg_price: 0 };

            // 평균 단가 계산
            const totalShares = currentHolding.quantity + quantityNum;
            const totalValue = (currentHolding.avg_price * currentHolding.quantity) + totalCost;
            const newAvgPrice = totalValue / totalShares;

            // 새 포트폴리오 생성
            const newPortfolio = {
              ...portfolio,
              [ticker]: {
                quantity: totalShares,
                avg_price: newAvgPrice,
                symbol: ticker,
                name: stocksData.find(stock => stock.ticker === ticker)?.name || ticker
              }
            };

            // State 업데이트
            setBalance(newBalance);
            setPortfolio(newPortfolio);

            // AsyncStorage에 저장
            await savePortfolioData(newPortfolio, newBalance);

            console.log('✅ 매수 성공:', {
              ticker,
              quantity: quantityNum,
              price: price.toFixed(2),
              totalCost: totalCost.toFixed(2),
              newBalance: newBalance.toFixed(2),
              newAvgPrice: newAvgPrice.toFixed(2),
              totalShares
            });

            // 성공 알림
            Alert.alert(
              '✅ 매수 완료!',
              `${ticker} ${quantityNum}주를 $${totalCost.toFixed(2)}에 매수했습니다!\n\n총 보유량: ${totalShares}주\n평균단가: $${newAvgPrice.toFixed(2)}\n남은 잔액: $${newBalance.toFixed(2)}`,
              [{ text: '확인' }]
            );
          }
        }
      ],
      'plain-text',
      '1'
    );
  };

  // 🔧 로컬 매도 함수 (시뮬레이션 방식)
  const sellStock = async (ticker, price) => {
    const holding = portfolio[ticker];
    const maxQuantity = holding?.quantity || 0;

    Alert.prompt(
      '주식 매도',
      `${ticker} (현재가: $${price.toFixed(2)})\n보유량: ${maxQuantity}주\n${maxQuantity > 0 ? `평균단가: $${holding.avg_price.toFixed(2)}` : ''}\n\n몇 주 매도하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '매도',
          onPress: async (quantity) => {
            if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
              Alert.alert('오류', '올바른 수량을 입력해주세요.');
              return;
            }

            const quantityNum = parseInt(quantity);

            console.log(`💸 ${ticker} ${quantityNum}주 매도 시도...`);

            // 보유량 확인
            if (!holding || holding.quantity < quantityNum) {
              Alert.alert(
                '❌ 매도 실패',
                `보유 수량이 부족합니다!\n\n보유 수량: ${maxQuantity}주\n매도 요청: ${quantityNum}주`
              );
              return;
            }

            const totalRevenue = price * quantityNum;
            const profit = (price - holding.avg_price) * quantityNum;
            const newBalance = balance + totalRevenue;
            const remainingShares = holding.quantity - quantityNum;

            // 새 포트폴리오 생성
            const newPortfolio = { ...portfolio };

            if (remainingShares === 0) {
              // 모든 주식 매도
              delete newPortfolio[ticker];
            } else {
              // 일부 매도
              newPortfolio[ticker] = {
                ...holding,
                quantity: remainingShares
              };
            }

            // State 업데이트
            setBalance(newBalance);
            setPortfolio(newPortfolio);

            // AsyncStorage에 저장
            await savePortfolioData(newPortfolio, newBalance);

            console.log('✅ 매도 성공:', {
              ticker,
              quantity: quantityNum,
              price: price.toFixed(2),
              totalRevenue: totalRevenue.toFixed(2),
              profit: profit.toFixed(2),
              newBalance: newBalance.toFixed(2),
              remainingShares
            });

            // 성공 알림
            const profitText = profit >= 0 ? `+$${profit.toFixed(2)}` : `-$${Math.abs(profit).toFixed(2)}`;
            const profitColor = profit >= 0 ? '🟢' : '🔴';

            Alert.alert(
              '✅ 매도 완료!',
              `${ticker} ${quantityNum}주를 $${totalRevenue.toFixed(2)}에 매도했습니다!\n\n${profitColor} 손익: ${profitText}\n${remainingShares > 0 ? `남은 보유량: ${remainingShares}주\n` : ''}현재 잔액: $${newBalance.toFixed(2)}`,
              [{ text: '확인' }]
            );
          }
        }
      ],
      'plain-text',
      maxQuantity > 0 ? Math.min(maxQuantity, 1).toString() : '0'
    );
  };

  // 검색 필터링 (안전한 버전)
  const filteredStocks = stocksData.filter(stock => {
    const query = (searchQuery || '').toLowerCase();
    const ticker = (stock.ticker || '').toLowerCase();
    const name = (stock.name || '').toLowerCase();

    return ticker.includes(query) || name.includes(query);
  });

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
    const { ticker, name, current_price, ai_insight } = stock;
    const price = current_price || 0;

    // 🔧 보유량 표시 추가
    const holding = portfolio[ticker];
    const holdingQuantity = holding?.quantity || 0;
    const holdingValue = holdingQuantity * price;

    // AI 인사이트에서 추천 등급 추출 (간단한 파싱)
    const getBuyRating = (insight) => {
      if ((insight || '').includes('BUY') || (insight || '').includes('매수')) return { rating: 'BUY', color: '#28a745' };
      if ((insight || '').includes('SELL') || (insight || '').includes('매도')) return { rating: 'SELL', color: '#dc3545' };
      if ((insight || '').includes('HOLD') || (insight || '').includes('보유')) return { rating: 'HOLD', color: '#ffc107' };
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
            {/* 🔧 보유량 정보 추가 */}
            {holdingQuantity > 0 && (
              <View style={styles.holdingContainer}>
                <Text style={styles.holdingText}>
                  보유: {holdingQuantity}주 (${holdingValue.toFixed(2)})
                </Text>
              </View>
            )}
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
                style={[
                  styles.actionButton,
                  styles.sellButton,
                  holdingQuantity === 0 && styles.disabledButton
                ]}
                onPress={() => sellStock(ticker, price)}
                disabled={holdingQuantity === 0}
              >
                <Text style={[
                  styles.actionButtonText,
                  holdingQuantity === 0 && styles.disabledButtonText
                ]}>매도</Text>
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
            {(ai_insight || '').length > 100 ? `${(ai_insight || '').substring(0, 100)}...` : (ai_insight || 'AI 분석 정보가 없습니다.')}
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
        {/* 🔧 잔고 표시 추가 */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>💰 ${balance.toFixed(2)}</Text>
        </View>
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
  // 🔧 잔고 표시용 스타일 추가
  balanceContainer: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  balanceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
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
  // 🔧 보유량 표시용 스타일 추가
  holdingContainer: {
    marginTop: 6,
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  holdingText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
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
  // 🔧 비활성화 버튼 스타일 추가
  disabledButton: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // 🔧 비활성화 버튼 텍스트 스타일 추가
  disabledButtonText: {
    color: '#ccc',
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