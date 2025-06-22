// SimulationGameScreen.js (자유로운 수량 입력 포함)
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  FlatList 
} from 'react-native';

export default function SimulationGameScreen({ navigation, route }) {
  // 시뮬레이션 설정과 초기 데이터 받아오기
  const { config, simulationData } = route?.params || {};
  
  // 🎮 시뮬레이션 전용 상태 (실제 포트폴리오와 완전 분리)
  const [simPortfolio, setSimPortfolio] = useState(simulationData || {
    balance: 100000,
    portfolio: {},
    transactions: [],
    total_asset: 100000,
    user_id: 'simulation_user',
    username: 'simulation_mode'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(parseInt(config?.totalSteps || '12'));
  const [currentDate, setCurrentDate] = useState(config?.startDate || '2023-01-01');

  useEffect(() => {
    console.log('🎮 시뮬레이션 게임 시작!');
    console.log('⚙️ 설정:', config);
    console.log('💰 시뮬레이션 초기 데이터:', simPortfolio);
    console.log('📅 시작 날짜:', currentDate);
  }, []);

  // 2023년 실제 주가 데이터 (월별)
  const monthlyStockData = {
    1: [ // 2023년 1월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 150.82, change: '+0.0%', changeValue: '+0.00' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 235.05, change: '+0.0%', changeValue: '+0.00' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 143.37, change: '+0.0%', changeValue: '+0.00' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 123.18, change: '+0.0%', changeValue: '+0.00' },
      { symbol: 'GOOGL', name: 'Google', price: 89.12, change: '+0.0%', changeValue: '+0.00' },
      { symbol: 'AMZN', name: 'Amazon', price: 103.13, change: '+0.0%', changeValue: '+0.00' }
    ],
    2: [ // 2023년 2월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 147.92, change: '-1.9%', changeValue: '-2.90' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 251.90, change: '+7.2%', changeValue: '+16.85' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 207.46, change: '+44.7%', changeValue: '+64.09' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 205.71, change: '+67.0%', changeValue: '+82.53' },
      { symbol: 'GOOGL', name: 'Google', price: 90.69, change: '+1.8%', changeValue: '+1.57' },
      { symbol: 'AMZN', name: 'Amazon', price: 94.27, change: '-8.6%', changeValue: '-8.86' }
    ],
    3: [ // 2023년 3월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 164.90, change: '+11.5%', changeValue: '+16.98' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 280.76, change: '+11.4%', changeValue: '+28.86' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 233.30, change: '+12.4%', changeValue: '+25.84' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 207.46, change: '+0.9%', changeValue: '+1.75' },
      { symbol: 'GOOGL', name: 'Google', price: 104.21, change: '+14.9%', changeValue: '+13.52' },
      { symbol: 'AMZN', name: 'Amazon', price: 103.41, change: '+9.7%', changeValue: '+9.14' }
    ],
    4: [ // 2023년 4월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 169.68, change: '+2.9%', changeValue: '+4.78' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 305.16, change: '+8.7%', changeValue: '+24.40' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 283.11, change: '+21.4%', changeValue: '+49.81' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 162.99, change: '-21.4%', changeValue: '-44.47' },
      { symbol: 'GOOGL', name: 'Google', price: 108.22, change: '+3.8%', changeValue: '+4.01' },
      { symbol: 'AMZN', name: 'Amazon', price: 105.45, change: '+2.0%', changeValue: '+2.04' }
    ],
    5: [ // 2023년 5월 (AI 붐!)
      { symbol: 'AAPL', name: 'Apple Inc.', price: 177.25, change: '+4.5%', changeValue: '+7.57' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 328.39, change: '+7.6%', changeValue: '+23.23' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 379.80, change: '+34.1%', changeValue: '+96.69' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 201.16, change: '+23.4%', changeValue: '+38.17' },
      { symbol: 'GOOGL', name: 'Google', price: 123.37, change: '+14.0%', changeValue: '+15.15' },
      { symbol: 'AMZN', name: 'Amazon', price: 120.58, change: '+14.3%', changeValue: '+15.13' }
    ],
    6: [ // 2023년 6월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 193.97, change: '+9.4%', changeValue: '+16.72' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 340.54, change: '+3.7%', changeValue: '+12.15' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 423.02, change: '+11.4%', changeValue: '+43.22' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 274.45, change: '+36.5%', changeValue: '+73.29' },
      { symbol: 'GOOGL', name: 'Google', price: 123.04, change: '-0.3%', changeValue: '-0.33' },
      { symbol: 'AMZN', name: 'Amazon', price: 130.36, change: '+8.1%', changeValue: '+9.78' }
    ],
    7: [ // 2023년 7월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 196.89, change: '+1.5%', changeValue: '+2.92' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 359.49, change: '+5.6%', changeValue: '+18.95' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 467.95, change: '+10.6%', changeValue: '+44.93' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 291.26, change: '+6.1%', changeValue: '+16.81' },
      { symbol: 'GOOGL', name: 'Google', price: 130.50, change: '+6.1%', changeValue: '+7.46' },
      { symbol: 'AMZN', name: 'Amazon', price: 133.68, change: '+2.5%', changeValue: '+3.32' }
    ],
    8: [ // 2023년 8월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 187.87, change: '-4.6%', changeValue: '-9.02' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 327.01, change: '-9.0%', changeValue: '-32.48' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 493.55, change: '+5.5%', changeValue: '+25.60' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.59, change: '-18.1%', changeValue: '-52.67' },
      { symbol: 'GOOGL', name: 'Google', price: 131.80, change: '+1.0%', changeValue: '+1.30' },
      { symbol: 'AMZN', name: 'Amazon', price: 144.05, change: '+7.8%', changeValue: '+10.37' }
    ],
    9: [ // 2023년 9월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 171.21, change: '-8.9%', changeValue: '-16.66' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 315.75, change: '-3.4%', changeValue: '-11.26' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 436.58, change: '-11.5%', changeValue: '-56.97' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 251.60, change: '+5.5%', changeValue: '+13.01' },
      { symbol: 'GOOGL', name: 'Google', price: 134.08, change: '+1.7%', changeValue: '+2.28' },
      { symbol: 'AMZN', name: 'Amazon', price: 127.74, change: '-11.3%', changeValue: '-16.31' }
    ],
    10: [ // 2023년 10월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 170.77, change: '-0.3%', changeValue: '-0.44' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: '+7.1%', changeValue: '+22.36' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 410.38, change: '-6.0%', changeValue: '-26.20' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.68, change: '-3.5%', changeValue: '-8.92' },
      { symbol: 'GOOGL', name: 'Google', price: 125.30, change: '-6.5%', changeValue: '-8.78' },
      { symbol: 'AMZN', name: 'Amazon', price: 133.97, change: '+4.9%', changeValue: '+6.23' }
    ],
    11: [ // 2023년 11월 (AI 붐 재점화!)
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.95, change: '+11.2%', changeValue: '+19.18' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: '+12.0%', changeValue: '+40.74' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 467.30, change: '+13.9%', changeValue: '+56.92' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 240.83, change: '-0.8%', changeValue: '-1.85' },
      { symbol: 'GOOGL', name: 'Google', price: 133.93, change: '+6.9%', changeValue: '+8.63' },
      { symbol: 'AMZN', name: 'Amazon', price: 146.09, change: '+9.0%', changeValue: '+12.12' }
    ],
    12: [ // 2023년 12월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 193.60, change: '+1.9%', changeValue: '+3.65' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 374.58, change: '-1.1%', changeValue: '-4.27' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.22, change: '+6.0%', changeValue: '+27.92' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.48, change: '+3.2%', changeValue: '+7.65' },
      { symbol: 'GOOGL', name: 'Google', price: 140.93, change: '+5.2%', changeValue: '+7.00' },
      { symbol: 'AMZN', name: 'Amazon', price: 153.38, change: '+5.0%', changeValue: '+7.29' }
    ]
  };

  // 현재 단계에 맞는 주식 데이터 가져오기
  const getCurrentStocks = () => {
    return monthlyStockData[currentStep] || monthlyStockData[1];
  };

  const simulationStocks = getCurrentStocks();

  // 주식 매수 함수
  const buyStock = (stock, quantity) => {
    const totalCost = stock.price * quantity;
    
    if (totalCost > simPortfolio.balance) {
      Alert.alert('❌ 매수 실패', `잔액이 부족합니다!\n필요 금액: $${totalCost.toFixed(2)}\n현재 잔액: $${simPortfolio.balance.toFixed(2)}`);
      return;
    }

    const newBalance = simPortfolio.balance - totalCost;
    const currentHolding = simPortfolio.portfolio[stock.symbol] || { quantity: 0, avg_price: 0 };
    
    // 평균 단가 계산
    const totalShares = currentHolding.quantity + quantity;
    const totalValue = (currentHolding.avg_price * currentHolding.quantity) + totalCost;
    const newAvgPrice = totalValue / totalShares;

    const newTransaction = `🎮 시뮬레이션 매수: ${stock.symbol} ${quantity}주 @ $${stock.price} (날짜: ${currentDate}). 총 $${totalCost.toFixed(2)}. (평균단가: $${newAvgPrice.toFixed(2)}) AI 코치: ${stock.symbol} ${quantity}주 매수를 결정하셨습니다. 좋은 선택입니다!`;

    setSimPortfolio(prev => ({
      ...prev,
      balance: newBalance,
      portfolio: {
        ...prev.portfolio,
        [stock.symbol]: {
          quantity: totalShares,
          avg_price: newAvgPrice
        }
      },
      transactions: [newTransaction, ...prev.transactions],
      total_asset: prev.total_asset // 시뮬레이션에서는 고정
    }));

    console.log(`🎮 시뮬레이션 매수 완료: ${stock.symbol} ${quantity}주`);
    Alert.alert('✅ 매수 완료!', `${stock.symbol} ${quantity}주를 $${totalCost.toFixed(2)}에 매수했습니다!\n\n남은 잔액: $${newBalance.toFixed(2)}`);
  };

  // 주식 매도 함수
  const sellStock = (stock, quantity) => {
    const holding = simPortfolio.portfolio[stock.symbol];
    
    if (!holding || holding.quantity < quantity) {
      Alert.alert('❌ 매도 실패', `보유 수량이 부족합니다!\n보유 수량: ${holding?.quantity || 0}주\n매도 요청: ${quantity}주`);
      return;
    }

    const totalRevenue = stock.price * quantity;
    const profit = (stock.price - holding.avg_price) * quantity;
    const newBalance = simPortfolio.balance + totalRevenue;
    const remainingShares = holding.quantity - quantity;

    const newTransaction = `🎮 시뮬레이션 매도: ${stock.symbol} ${quantity}주 @ $${stock.price} (날짜: ${currentDate}). 총 $${totalRevenue.toFixed(2)}. (손익: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}) AI 코치: ${stock.symbol} 매도 후 **$${profit.toFixed(2)}의 ${profit >= 0 ? '수익' : '손실'}**을 기록하셨습니다. ${profit >= 0 ? '성공적인 거래입니다!' : '다음엔 더 좋은 결과가 있을 거예요!'}`;

    const newPortfolio = { ...simPortfolio.portfolio };
    if (remainingShares === 0) {
      delete newPortfolio[stock.symbol];
    } else {
      newPortfolio[stock.symbol] = {
        ...holding,
        quantity: remainingShares
      };
    }

    setSimPortfolio(prev => ({
      ...prev,
      balance: newBalance,
      portfolio: newPortfolio,
      transactions: [newTransaction, ...prev.transactions]
    }));

    console.log(`🎮 시뮬레이션 매도 완료: ${stock.symbol} ${quantity}주, 손익: $${profit.toFixed(2)}`);
    Alert.alert('✅ 매도 완료!', `${stock.symbol} ${quantity}주를 $${totalRevenue.toFixed(2)}에 매도했습니다!\n\n손익: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}\n잔액: $${newBalance.toFixed(2)}`);
  };

  // 수량 입력 함수 (자유로운 수량 선택!)
  const showQuantityInput = (stock, action) => {
    const maxAffordable = Math.floor(simPortfolio.balance / stock.price);
    const holding = simPortfolio.portfolio[stock.symbol]?.quantity || 0;
    
    Alert.prompt(
      `${action === 'buy' ? '📈 매수' : '📉 매도'} 수량 입력`,
      `${stock.symbol} (${stock.name})\n현재가: $${stock.price}\n${action === 'buy' ? `최대 매수 가능: ${maxAffordable}주` : `보유 수량: ${holding}주`}\n\n${action === 'buy' ? '매수할' : '매도할'} 수량을 입력하세요:`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: action === 'buy' ? '💰 매수' : '💸 매도',
          onPress: (quantity) => {
            const num = parseInt(quantity);
            if (isNaN(num) || num <= 0) {
              Alert.alert('❌ 잘못된 입력', '1 이상의 숫자를 입력해주세요!');
              return;
            }
            if (action === 'buy' && num > maxAffordable) {
              Alert.alert('❌ 잔액 부족', `최대 ${maxAffordable}주까지만 매수 가능합니다!`);
              return;
            }
            if (action === 'sell' && num > holding) {
              Alert.alert('❌ 수량 부족', `최대 ${holding}주까지만 매도 가능합니다!`);
              return;
            }
            
            if (action === 'buy') {
              buyStock(stock, num);
            } else {
              sellStock(stock, num);
            }
          }
        }
      ],
      'plain-text',
      '1'
    );
  };

  // 다음 단계로 진행
  const nextStep = () => {
    if (currentStep >= totalSteps) {
      // 최종 결과 계산
      const totalValue = simPortfolio.balance + Object.keys(simPortfolio.portfolio).reduce((sum, symbol) => {
        const holding = simPortfolio.portfolio[symbol];
        const currentStock = simulationStocks.find(s => s.symbol === symbol);
        return sum + (holding.quantity * (currentStock?.price || holding.avg_price));
      }, 0);
      
      const totalReturn = totalValue - 100000;
      const returnPercent = (totalReturn / 100000) * 100;
      
      Alert.alert(
        '🎉 시뮬레이션 완료!', 
        `축하합니다! ${config?.startDate}부터 ${config?.endDate}까지의 시뮬레이션을 완료했습니다!\n\n📊 최종 결과:\n• 현금: $${simPortfolio.balance.toFixed(2)}\n• 주식 가치: $${(totalValue - simPortfolio.balance).toFixed(2)}\n• 총 자산: $${totalValue.toFixed(2)}\n• 총 수익: ${totalReturn >= 0 ? '+' : ''}$${totalReturn.toFixed(2)} (${returnPercent.toFixed(2)}%)\n• 거래 횟수: ${simPortfolio.transactions.length}건`,
        [
          { text: '🔄 다시 하기', onPress: () => navigation.navigate('SimulationSetup') },
          { text: '🏠 메인으로', onPress: () => navigation.navigate('MainDashboard') }
        ]
      );
      return;
    }

    setCurrentStep(prev => prev + 1);
    // 날짜도 진행 (월간이라면 한 달씩)
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date.toISOString().split('T')[0]);
    
    Alert.alert('📅 다음 단계', `${config?.tradingInterval || '월간'} 단계가 진행되었습니다!\n현재: ${currentStep + 1}/${totalSteps} 단계`);
  };

  // 주식 거래 알림 (자유로운 수량 입력!)
  const showTradeDialog = (stock) => {
    const holding = simPortfolio.portfolio[stock.symbol]?.quantity || 0;
    const maxAffordable = Math.floor(simPortfolio.balance / stock.price);
    
    Alert.alert(
      `📈 ${stock.symbol} 거래`,
      `${stock.name}\n현재가: $${stock.price}\n변동: ${stock.change} (${stock.changeValue})\n\n💼 보유 수량: ${holding}주\n💰 현재 잔액: $${simPortfolio.balance.toFixed(2)}\n📊 최대 매수 가능: ${maxAffordable}주`,
      [
        { text: '❌ 취소', style: 'cancel' },
        { text: '📈 매수하기', onPress: () => showQuantityInput(stock, 'buy') },
        ...(holding > 0 ? [
          { text: '📉 매도하기', onPress: () => showQuantityInput(stock, 'sell') },
          { text: '🔄 전량 매도', onPress: () => sellStock(stock, holding) }
        ] : [])
      ]
    );
  };

  // 주식 아이템 렌더링
  const renderStockItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.stockItem}
      onPress={() => showTradeDialog(item)}
    >
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{item.symbol}</Text>
        <Text style={styles.stockName}>{item.name}</Text>
        <Text style={styles.stockHolding}>
          보유: {simPortfolio.portfolio[item.symbol]?.quantity || 0}주
        </Text>
      </View>
      <View style={styles.stockPrice}>
        <Text style={styles.priceText}>${item.price}</Text>
        <Text style={[
          styles.changeText, 
          { color: item.change.startsWith('+') ? '#28a745' : '#dc3545' }
        ]}>
          {item.change}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('SimulationSetup')}
        >
          <Text style={styles.backButtonText}>← 설정</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎮 투자 시뮬레이션</Text>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.homeButtonText}>🏠 메인</Text>
        </TouchableOpacity>
      </View>

      {/* 시뮬레이션 상태 */}
      <View style={styles.statusBar}>
        <Text style={styles.stepText}>📅 {currentDate} ({currentStep}/{totalSteps})</Text>
        <Text style={styles.balanceText}>💰 ${simPortfolio.balance.toFixed(2)}</Text>
      </View>

      {/* 포트폴리오 요약 */}
      <View style={styles.portfolioSummary}>
        <Text style={styles.summaryTitle}>📊 시뮬레이션 포트폴리오</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>현금: ${simPortfolio.balance.toFixed(2)}</Text>
          <Text style={styles.summaryText}>보유 종목: {Object.keys(simPortfolio.portfolio).length}개</Text>
        </View>
        <Text style={styles.warningText}>⚠️ 연습용 시뮬레이션 (실제 투자 아님)</Text>
      </View>

      {/* 주식 목록 */}
      <View style={styles.stockSection}>
        <Text style={styles.sectionTitle}>📈 거래 가능 주식 (탭해서 자유롭게 매매)</Text>
        <FlatList
          data={simulationStocks}
          renderItem={renderStockItem}
          keyExtractor={(item) => item.symbol}
          style={styles.stockList}
        />
      </View>

      {/* 액션 버튼 */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep >= totalSteps ? '🎉 완료!' : `📅 다음 ${config?.tradingInterval || '단계'}`}
          </Text>
        </TouchableOpacity>
      </View>
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
  homeButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  homeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
  },
  stepText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  balanceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  portfolioSummary: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  warningText: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 10,
  },
  stockSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  stockList: {
    flex: 1,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stockName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  stockHolding: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
    fontWeight: 'bold',
  },
  stockPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  changeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  nextButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
