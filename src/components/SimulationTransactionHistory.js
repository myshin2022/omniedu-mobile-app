import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

const SimulationTransactionHistory = ({ navigation, route }) => {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [simulationResults, setSimulationResults] = useState(null);

  // 시뮬레이션 결과에서 거래 내역 파싱
  const parseTransactions = (transactionStrings) => {
    const parsedTransactions = [];
    
    if (!transactionStrings || !Array.isArray(transactionStrings)) {
      return parsedTransactions;
    }

    transactionStrings.forEach((transactionString, index) => {
      try {
        // "🎮 매수: NVDA 697주 @ 143.37 (2023-01-01). 총 99928.89. 🤖 AI 코치: ..."
        // "매도: NVDA 100주 @ 450.00 (2024-06-01). 총 45000.00. (손익: +30663.00)"
        
        const isAI = transactionString.includes('🎮');
        const isBuy = transactionString.includes('매수');
        const isSell = transactionString.includes('매도');
        
        // 정규식으로 정보 추출
        const symbolMatch = transactionString.match(/(NVDA|AAPL|MSFT|GOOG|AMZN|TSLA|AMD|META|CRM|NFLX)\s*(\d+)주/);
        const priceMatch = transactionString.match(/@\s*(\d+\.?\d*)/);
        const dateMatch = transactionString.match(/\((\d{4}-\d{2}-\d{2})\)/);
        const totalMatch = transactionString.match(/총\s*(\d+\.?\d*)/);
        const profitMatch = transactionString.match(/손익:\s*([+-]\d+\.?\d*)/);
        const aiCommentMatch = transactionString.match(/🤖 AI 코치:\s*(.+)/);
        
        if (symbolMatch && priceMatch && dateMatch && totalMatch) {
          const transaction = {
            id: index,
            symbol: symbolMatch[1],
            type: isBuy ? '매수' : '매도',
            quantity: parseInt(symbolMatch[2]),
            price: parseFloat(priceMatch[1]),
            totalAmount: parseFloat(totalMatch[1]),
            date: dateMatch[1],
            profit: profitMatch ? parseFloat(profitMatch[1]) : null,
            aiComment: aiCommentMatch ? aiCommentMatch[1] : '',
            isAIRecommendation: isAI
          };
          
          parsedTransactions.push(transaction);
        }
      } catch (error) {
        console.error('거래 파싱 오류:', error, transactionString);
      }
    });
    
    return parsedTransactions.reverse(); // 최신 순으로 정렬
  };

  // 시뮬레이션 데이터 로드
  const loadSimulationData = () => {
    try {
      const results = route?.params?.simulationResults;
      
      if (results) {
        setSimulationResults(results);
        
        // 거래 내역 파싱
        const parsedTransactions = parseTransactions(results.transactions);
        setTransactions(parsedTransactions);
        
        // 총 자산 값 설정
        setTotalValue(results.totalAssets || results.balance || 0);
        
        console.log('시뮬레이션 거래 내역:', parsedTransactions);
      }
    } catch (error) {
      console.error('시뮬레이션 데이터 로드 오류:', error);
    }
  };

  useEffect(() => {
    loadSimulationData();
  }, [route?.params]);

  // 새로고침
  const onRefresh = () => {
    setRefreshing(true);
    loadSimulationData();
    setRefreshing(false);
  };

  // 거래 유형에 따른 이모지
  const getTransactionEmoji = (transaction) => {
    if (transaction.isAIRecommendation) return '🎮';
    return transaction.type === '매수' ? '📈' : '📉';
  };

  // 거래 유형에 따른 색상
  const getTransactionColor = (type) => {
    return type === '매수' ? '#28a745' : '#dc3545';
  };

  // 거래 항목 렌더링
  const renderTransaction = (transaction, index) => {
    return (
      <View key={`transaction-${transaction.id}-${index}`} style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>
              {getTransactionEmoji(transaction)} {transaction.symbol}
            </Text>
            <Text style={[styles.transactionType, {color: getTransactionColor(transaction.type)}]}>
              {transaction.type}
            </Text>
            {transaction.isAIRecommendation && (
              <Text style={styles.aiLabel}>AI 추천</Text>
            )}
          </View>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.detailText}>
            수량: <Text style={styles.boldText}>{transaction.quantity}주</Text>
          </Text>
          <Text style={styles.detailText}>
            단가: <Text style={styles.boldText}>${transaction.price.toFixed(2)}</Text>
          </Text>
          <Text style={styles.detailText}>
            총액: <Text style={[styles.boldText, {color: getTransactionColor(transaction.type)}]}>
              ${transaction.totalAmount.toLocaleString()}
            </Text>
          </Text>
          {transaction.profit && (
            <Text style={styles.detailText}>
              손익: <Text style={[styles.boldText, {color: transaction.profit > 0 ? '#28a745' : '#dc3545'}]}>
                {transaction.profit > 0 ? '+' : ''}${transaction.profit.toLocaleString()}
              </Text>
            </Text>
          )}
        </View>
        
        {transaction.aiComment && (
          <View style={styles.aiCommentSection}>
            <Text style={styles.aiCommentText}>
              🤖 AI 코치: {transaction.aiComment}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>시뮬레이션 거래 내역</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 시뮬레이션 결과 요약 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>🎮 시뮬레이션 결과</Text>
        <Text style={styles.summaryAmount}>${totalValue.toLocaleString()}</Text>
        <Text style={styles.summarySubtext}>총 {transactions.length}건의 거래</Text>
        {simulationResults && (
          <Text style={styles.returnText}>
            수익률: {simulationResults.returnPercentage?.toFixed(2)}%
          </Text>
        )}
      </View>

      {/* 거래 내역 리스트 */}
      <ScrollView 
        style={styles.transactionList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>🎮</Text>
            <Text style={styles.emptyStateTitle}>시뮬레이션 거래 내역이 없습니다</Text>
            <Text style={styles.emptyStateSubtext}>시뮬레이션을 실행해보세요!</Text>
          </View>
        ) : (
          transactions.map((transaction, index) => renderTransaction(transaction, index))
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#007AFF'}]}
          onPress={() => navigation.navigate('InvestmentReportCard')}
        >
          <Text style={styles.buttonText}>📊 성적표</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#28a745'}]}
          onPress={() => navigation.navigate('SimulationSetup')}
        >
          <Text style={styles.buttonText}>🎮 새 시뮬레이션</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
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
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  returnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6c757d',
  },
  transactionDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  aiCommentSection: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  aiCommentText: {
    fontSize: 14,
    color: '#1565c0',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#adb5bd',
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SimulationTransactionHistory;
