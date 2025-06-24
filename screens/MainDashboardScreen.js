// screens/MainDashboardScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const MainDashboardScreen = ({navigation}) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';

  // 포트폴리오 데이터 가져오기
  const fetchPortfolioData = async () => {
    try {
      console.log('📊 포트폴리오 데이터 요청 중...');
      const response = await axios.get(`${FLASK_API_BASE_URL}/api/user_portfolio`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('✅ 포트폴리오 데이터 수신:', response.data);
      setPortfolioData(response.data);
    } catch (error) {
      console.error('❌ 포트폴리오 데이터 로드 실패:', error);

      let errorMessage = '포트폴리오 데이터를 불러올 수 없습니다.';
      if (error.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error.response) {
        errorMessage = `서버 오류: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = '네트워크 연결을 확인하세요.';
      }

      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 화면 로드 시 데이터 가져오기
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  // 새로고침
  const onRefresh = () => {
    setRefreshing(true);
    fetchPortfolioData();
  };

  // 로딩 화면
  if (loading) {
    return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff"/>
          <Text style={styles.loadingText}>포트폴리오 로딩 중...</Text>
        </View>
    );
  }

  // 데이터가 없는 경우
  if (!portfolioData) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>데이터를 불러올 수 없습니다</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPortfolioData}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
    );
  }

  // 포트폴리오 항목 렌더링
  const renderPortfolioItem = (ticker, data) => {
    const quantity = data.quantity || 0;
    const avgPrice = data.avg_price || 0;
    const totalValue = quantity * avgPrice; // 실제로는 현재가 * 수량이어야 함

    return (
        <View key={ticker} style={styles.portfolioItem}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.tickerText}>{ticker}</Text>
            <Text style={styles.quantityText}>{quantity}주</Text>
          </View>
          <View style={styles.portfolioDetails}>
            <Text style={styles.avgPriceText}>평균단가: ${avgPrice.toFixed(2)}</Text>
            <Text style={styles.totalValueText}>총 가치: ${totalValue.toFixed(2)}</Text>
          </View>
        </View>
    );
  };

  // 거래 내역 항목 렌더링 (최근 3개만)
  const renderRecentTransactions = () => {
    if (!portfolioData.transactions || portfolioData.transactions.length === 0) {
      return (
          <Text style={styles.noTransactionsText}>거래 내역이 없습니다</Text>
      );
    }

    return portfolioData.transactions
        .slice(-3) // 최근 3개만
        .reverse() // 최신순으로
        .map((transaction, index) => (
            <View key={index} style={styles.transactionItem}>
              <Text style={styles.transactionText} numberOfLines={2}>
                {transaction}
              </Text>
            </View>
        ));
  };

  const totalAsset = portfolioData.total_asset || 0;
  const balance = portfolioData.balance || 0;
  const initialAmount = 100000; // 시작 금액
  const totalGainLoss = totalAsset - initialAmount;
  const gainLossPercentage = ((totalGainLoss / initialAmount) * 100).toFixed(2);

  return (
      <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>안녕하세요, {portfolioData.username}님!</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString('ko-KR')}</Text>
          </View>
          <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
                  {text: '취소', style: 'cancel'},
                  {
                    text: '로그아웃',
                    style: 'destructive',
                    onPress: () => {
                      console.log('로그아웃 실행');
                      navigation.navigate('Login');
                    }
                  }
                ]);
              }}
          >
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 총 자산 카드 */}
        <View style={styles.assetCard}>
          <Text style={styles.assetLabel}>총 자산</Text>
          <Text style={styles.assetValue}>${totalAsset.toLocaleString()}</Text>
          <View style={styles.gainLossContainer}>
            <Text style={[
              styles.gainLossText,
              {color: totalGainLoss >= 0 ? '#28a745' : '#dc3545'}
            ]}>
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)}
              ({totalGainLoss >= 0 ? '+' : ''}{gainLossPercentage}%)
            </Text>
          </View>
        </View>

        {/* 잔고 카드 */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>현금 잔고</Text>
          <Text style={styles.balanceValue}>${balance.toLocaleString()}</Text>
        </View>

        {/* 포트폴리오 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보유 주식</Text>
          {Object.keys(portfolioData.portfolio || {}).length === 0 ? (
              <Text style={styles.noPortfolioText}>보유 중인 주식이 없습니다</Text>
          ) : (
              Object.entries(portfolioData.portfolio).map(([ticker, data]) =>
                  renderPortfolioItem(ticker, data)
              )
          )}
        </View>

        {/* 최근 거래 내역 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>최근 거래 내역</Text>
            <TouchableOpacity onPress={() => {
              console.log('전체 거래 내역 보기');
              Alert.alert('거래 내역', '전체 거래 내역을 확인합니다', [
                {text: '취소', style: 'cancel'},
                {
                  text: '확인',
                  onPress: () => {
                    // TODO: 전체 거래 내역 화면으로 이동
                    navigation.navigate('TransactionHistory');
                  }
                }
              ]);
            }}>
              <Text style={styles.viewAllText}>전체 보기</Text>
            </TouchableOpacity>
          </View>
          {renderRecentTransactions()}
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
              style={[styles.actionButton, styles.buyButton]}
              onPress={() => {
                console.log('주식 거래 화면으로 이동');
                navigation.navigate('StockList');
              }}
          >
            <Text style={styles.actionButtonText}>주식 거래</Text>
          </TouchableOpacity>

          {/* 👇 여기에 테스트 버튼 추가! */}
          <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: '#ff9500'}]}
              onPress={() => {
                console.log('🧪 성적표 테스트로 이동');
                navigation.navigate('InvestmentReportCard', {
                  simulationResults: {
                    returnPercentage: 750,
                    initialAmount: 100000,
                    totalAssets: 850000,
                    duration: 24,
                    balance: 850000,
                    portfolio: {},
                    transactions: ['테스트 거래']
                  },
                  username: 'testuser',
                  level: 'advanced'
                });
              }}
          >
            <Text style={styles.actionButtonText}>🧪 성적표 테스트</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.actionButton, styles.analysisButton]}
              onPress={() => {
                console.log('AI 분석 화면으로 이동');
                Alert.alert('AI 분석', 'AI 투자 분석을 시작합니다', [
                  {text: '취소', style: 'cancel'},
                  {
                    text: '확인',
                    onPress: () => {
                      // TODO: 실제 AI 분석 화면으로 이동
                      navigation.navigate('AIAnalysis');
                    }
                  }
                ]);
              }}
          >
            <Text style={styles.actionButtonText}>AI 분석</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.simulationSection}>
          <TouchableOpacity
              style={styles.simulationButton}
              onPress={() => {
                console.log('🎮 투자 시뮬레이션 화면으로 이동');
                navigation.navigate('SimulationSetup');
              }}
              activeOpacity={0.8}
          >
            <Text style={styles.simulationButtonText}>🎮 투자 시뮬레이션 시작</Text>
            <Text style={styles.simulationButtonSubtext}>과거 데이터로 시간여행 투자 체험</Text>
          </TouchableOpacity>
        </View>
        {/* 하단 여백 */}
        <View style={styles.bottomSpacing}/>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 20,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flex: 1,
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  assetCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  assetLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  assetValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  gainLossContainer: {
    marginTop: 8,
  },
  gainLossText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  portfolioItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
  },
  portfolioDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avgPriceText: {
    fontSize: 14,
    color: '#666',
  },
  totalValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  noPortfolioText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#28a745',
  },
  performanceButton: {
    backgroundColor: '#007bff',
  },
  analysisButton: {
    backgroundColor: '#17a2b8',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  simulationSection: {
    marginHorizontal: 20,
    gap: 8,
  },
  simulationButton: {
    backgroundColor: '#6f42c1',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  simulationButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  simulationButtonSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default MainDashboardScreen;
