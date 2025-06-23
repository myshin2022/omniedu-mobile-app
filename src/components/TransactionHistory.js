import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';

const TransactionHistory = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalInvested, setTotalInvested] = useState(0);

  // 더미 거래 내역 (테스트용)
  const loadTransactions = async () => {
    try {
      // 실제 거래 내역 (어제 로그에서 본 데이터)
      const dummyTransactions = [
        {
          symbol: 'AAPL',
          type: '매수',
          quantity: 200,
          price: 196.45,
          totalAmount: 39290.00,
          date: '2025-06-13',
          aiComment: 'AAPL 200주 매수를 결정하셨습니다.'
        },
        {
          symbol: 'MSFT',
          type: '매수', 
          quantity: 50,
          price: 474.96,
          totalAmount: 23748.00,
          date: '2025-06-13',
          aiComment: 'MSFT 50주 매수를 결정하셨습니다.'
        },
        {
          symbol: 'GOOG',
          type: '매수',
          quantity: 10, 
          price: 175.88,
          totalAmount: 1758.80,
          date: '2025-06-13',
          aiComment: 'GOOG 10주 매수를 결정하셨습니다.'
        },
        {
          symbol: 'AMZN',
          type: '매수',
          quantity: 20,
          price: 212.10, 
          totalAmount: 4242.00,
          date: '2025-06-13',
          aiComment: 'AMZN 20주 매수를 결정하셨습니다.'
        },
        {
          symbol: 'NVDA',
          type: '매수',
          quantity: 10,
          price: 141.97,
          totalAmount: 1419.70,
          date: '2025-06-13', 
          aiComment: 'NVDA 10주 매수를 결정하셨습니다.'
        }
      ];
      
      setTransactions(dummyTransactions);
      
      // 총 투자금액 계산
      const total = dummyTransactions.reduce((sum, transaction) => {
        return sum + transaction.totalAmount;
      }, 0);
      setTotalInvested(total);
      
    } catch (error) {
      console.error('거래 내역 로드 오류:', error);
      Alert.alert('오류', '거래 내역을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // 새로고침
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  // 거래 유형에 따른 이모지
  const getTransactionEmoji = (type) => {
    return type === '매수' ? '📈' : '📉';
  };

  // 거래 유형에 따른 색상
  const getTransactionColor = (type) => {
    return type === '매수' ? '#28a745' : '#dc3545';
  };

  // 거래 항목 렌더링
  const renderTransaction = (transaction, index) => {
    return (
      <View key={index} style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>
              {getTransactionEmoji(transaction.type)} {transaction.symbol}
            </Text>
            <Text style={[styles.transactionType, {color: getTransactionColor(transaction.type)}]}>
              {transaction.type}
            </Text>
          </View>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.detailText}>
            수량: <Text style={styles.boldText}>{transaction.quantity}주</Text>
          </Text>
          <Text style={styles.detailText}>
            단가: <Text style={styles.boldText}>${transaction.price}</Text>
          </Text>
          <Text style={styles.detailText}>
            총액: <Text style={[styles.boldText, {color: getTransactionColor(transaction.type)}]}>
              ${transaction.totalAmount?.toLocaleString()}
            </Text>
          </Text>
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
        <Text style={styles.headerTitle}>거래 내역</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 총 투자금액 요약 */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>💰 총 투자금액</Text>
        <Text style={styles.summaryAmount}>${totalInvested.toLocaleString()}</Text>
        <Text style={styles.summarySubtext}>총 {transactions.length}건의 거래</Text>
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
            <Text style={styles.emptyStateText}>📊</Text>
            <Text style={styles.emptyStateTitle}>거래 내역이 없습니다</Text>
            <Text style={styles.emptyStateSubtext}>첫 번째 투자를 시작해보세요!</Text>
          </View>
        ) : (
          transactions.map((transaction, index) => renderTransaction(transaction, index))
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#007AFF'}]}
          onPress={() => navigation.navigate('MainDashboard')}
        >
          <Text style={styles.buttonText}>🏠 홈으로</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#28a745'}]}
          onPress={() => navigation.navigate('SimulationSetup')}
        >
          <Text style={styles.buttonText}>🎮 시뮬레이션</Text>
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
    color: '#28a745',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#6c757d',
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
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  aiCommentText: {
    fontSize: 14,
    color: '#495057',
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

export default TransactionHistory;
