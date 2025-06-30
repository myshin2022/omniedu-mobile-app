// screens/StockDetail.js (최소한만 수정 - MobileAIAnalysisService 제거)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
// import mobileAIAnalysisService from '../services/MobileAIAnalysisService'; // 제거
import axios from 'axios';
import { useUser } from '../context/UserContext'; // 사용자 컨텍스트 임포트
import * as SecureStore from 'expo-secure-store'; // 토큰 저장용 (사용하지 않으면 제거 가능)

const StockDetail = ({ route, navigation }) => {
  const { symbol, fromSimulation, simulationDate } = route.params || {};
  // 🧪 디버깅 로그도 추가
  console.log('📊 StockDetail 파라미터 확인:');
  console.log('- symbol:', symbol);
  console.log('- fromSimulation:', fromSimulation, typeof fromSimulation);
  console.log('- simulationDate:', simulationDate);
  console.log('- route.params 전체:', route.params);
  const { userInfo, isLoggedIn } = useUser(); // 사용자 정보 가져오기

  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState('');
  const [chartData, setChartData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentSimDate, setCurrentSimDate] = useState(null); // 시뮬레이션 날짜 상태 추가
  const [historicalPrices, setHistoricalPrices] = useState([]); // 차트용 히스토리컬 가격

  const FLASK_API_BASE_URL = 'https://learntoinvestai.com'; // Flask 백엔드 URL

  // 초기 데이터 로드 및 AI 분석 가져오기
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // 현재 시뮬레이션 날짜를 가져오거나 기본값을 설정합니다.
        // 실제 앱에서는 로그인 후 사용자 세션에서 현재 시뮬레이션 날짜를 가져오는 로직이 필요합니다.
        // 여기서는 임시로 오늘 날짜를 사용합니다.
        const initialSimDate = new Date().toISOString().split('T')[0];
        setCurrentSimDate(initialSimDate);

        // API 호출하여 주식 정보 및 AI 인사이트 가져오기
        const response = await axios.get(`${FLASK_API_BASE_URL}/api/stock_data/${symbol}/${initialSimDate}`);
        const data = response.data;

        if (data && data.price !== undefined && data.ai_insight !== undefined) {
          setCurrentPrice(data.price);
          setCurrentSimDate(data.sim_date_actual); // 실제 데이터가 있는 날짜로 업데이트
          setAiInsight(data.ai_insight);
          setStockData(data); // 모든 데이터 저장

          // TODO: 실제 히스토리컬 데이터 API 호출하여 차트 데이터 로드
          // 현재는 임시 데이터 사용
          const tempChartPrices = [
            data.price * 0.8,
            data.price * 0.9,
            data.price * 1.0,
            data.price * 1.1,
            data.price * 1.05,
            data.price
          ]; // 임의의 가격 변동
          setHistoricalPrices(tempChartPrices);
          setChartData({
            labels: ["-5D", "-4D", "-3D", "-2D", "-1D", "Today"], // 임시 라벨
            datasets: [{ data: tempChartPrices }] // 임시 데이터
          });

        } else {
          Alert.alert('데이터 오류', '주식 정보를 가져오는 데 실패했습니다.');
          setAiInsight("AI 코치: 주식 정보 로드 실패.");
        }
      } catch (error) {
        Alert.alert('연결 오류', '서버에서 주식 데이터를 가져올 수 없습니다.');
        console.error('Stock detail fetch error:', error);
        setAiInsight("AI 코치: 네트워크 연결 오류 또는 서버 문제로 분석 불가.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [symbol]); // symbol이 변경될 때마다 재실행

  // AI 분석을 업데이트하는 함수 (AI 분석 새로고침 버튼 클릭 시 호출)
  const updateAIAnalysis = async () => {
    if (!symbol || currentPrice === 0 || !currentSimDate) {
      Alert.alert('오류', '주식 정보, 가격, 또는 날짜가 유효하지 않아 분석을 요청할 수 없습니다.');
      return;
    }
    setLoading(true);

    try {
      // 🟢 강제 생성 파라미터 추가
      console.log(`AI 분석 강제 새로고침 요청: ${symbol} for ${currentSimDate}`);

      const response = await axios.get(`${FLASK_API_BASE_URL}/api/stock_data/${symbol}/${currentSimDate}?force_generate=true`);
      const data = response.data;

      if (data && data.ai_insight) {
        setAiInsight(data.ai_insight);
        // 가격도 업데이트
        if (data.price !== undefined) {
          setCurrentPrice(data.price);
        }

        // 강제 생성 여부에 따라 메시지 변경
        const message = data.force_generated
          ? '새로운 AI 분석이 생성되었습니다!'
          : 'AI 분석이 업데이트되었습니다.';
        Alert.alert('성공', message);

        console.log(`AI 분석 업데이트 완료 - 강제 생성: ${data.force_generated}`);
      } else {
        Alert.alert('분석 실패', 'AI 분석을 가져오지 못했습니다.');
        setAiInsight("AI 코치: 분석 결과 없음.");
      }
    } catch (error) {
      console.error('AI analysis update error:', error);

      // 에러 상세 정보 표시
      let errorMessage = 'AI 분석 요청 중 오류가 발생했습니다.';
      if (error.response) {
        errorMessage += `\n상태 코드: ${error.response.status}`;
        if (error.response.status === 404) {
          errorMessage += '\nAPI 엔드포인트를 찾을 수 없습니다.';
        }
      } else if (error.request) {
        errorMessage += '\n서버에 연결할 수 없습니다.';
      }

      Alert.alert('분석 오류', errorMessage);
      setAiInsight("AI 코치: AI 분석 요청 중 오류 발생.");
    } finally {
      setLoading(false);
    }
  };

  // 매수 함수
  const handleBuy = async () => {
    if (!symbol || currentPrice === 0) {
      Alert.alert('오류', '유효하지 않은 주식 정보입니다.');
      return;
    }

    Alert.prompt(
      '매수',
      `${symbol} 주식을 매수하시겠습니까?\n현재가: ${currentPrice.toFixed(2)}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '매수',
          onPress: async (quantity) => {
            if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
              Alert.alert('오류', '올바른 수량을 입력해주세요.');
              return;
            }

            try {
              const response = await axios.post(`${FLASK_API_BASE_URL}/api/buy`, {
                ticker: symbol,
                quantity: parseInt(quantity),
                price: currentPrice
              });

              if (response.data && response.data.success) {
                Alert.alert('성공', response.data.message);
              } else {
                Alert.alert('실패', response.data.message || '매수에 실패했습니다.');
              }
            } catch (error) {
              Alert.alert('오류', '매수 요청 중 오류가 발생했습니다.');
              console.error('Buy error:', error);
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  // 매도 함수
  const handleSell = async () => {
    if (!symbol || currentPrice === 0) {
      Alert.alert('오류', '유효하지 않은 주식 정보입니다.');
      return;
    }

    Alert.prompt(
      '매도',
      `${symbol} 주식을 매도하시겠습니까?\n현재가: ${currentPrice.toFixed(2)}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '매도',
          onPress: async (quantity) => {
            if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
              Alert.alert('오류', '올바른 수량을 입력해주세요.');
              return;
            }

            try {
              const response = await axios.post(`${FLASK_API_BASE_URL}/api/sell`, {
                ticker: symbol,
                quantity: parseInt(quantity)
              });

              if (response.data && response.data.success) {
                Alert.alert('성공', response.data.message);
              } else {
                Alert.alert('실패', response.data.message || '매도에 실패했습니다.');
              }
            } catch (error) {
              Alert.alert('오류', '매도 요청 중 오류가 발생했습니다.');
              console.error('Sell error:', error);
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>데이터 로드 중...</Text>
      </View>
    );
  }

  // 화면 너비 가져오기 (차트 렌더링용)
  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{stockData?.name} ({symbol})</Text>
      <Text style={styles.price}>현재가: ${currentPrice ? currentPrice.toFixed(2) : 'N/A'}</Text>
      <Text style={styles.date}>기준일: {currentSimDate}</Text>

      {/* 차트 */}
      <LineChart
        data={chartData}
        width={screenWidth - 40} // from react-native
        height={220}
        yAxisLabel="$"
        yAxisSuffix=""
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI 코치 분석</Text>
        <Text style={styles.aiInsightText}>{aiInsight || 'AI 분석 로드 중...'}</Text>
        {/* AI 분석 새로고침 버튼 */}
        <TouchableOpacity style={styles.refreshButton} onPress={updateAIAnalysis} disabled={loading}>
          <Text style={styles.refreshButtonText}>AI 분석 새로고침</Text>
        </TouchableOpacity>
      </View>

      {/* 매수/매도 버튼 */}
      <View style={styles.tradeButtons}>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuy}
          disabled={loading || currentPrice <= 0}
        >
          <Text style={styles.buttonText}>매수</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sellButton}
          onPress={handleSell}
          disabled={loading || currentPrice <= 0}
        >
          <Text style={styles.buttonText}>매도</Text>
        </TouchableOpacity>
      </View>

      {/* 네비게이션 버튼들 - 시뮬레이션용 */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            console.log('🔙 뒤로가기 버튼 클릭');

            // 시뮬레이션에서 온 경우 시뮬레이션으로 복귀
            if (fromSimulation) {
              console.log('🎮 시뮬레이션으로 복귀');
              navigation.navigate('SimulationGame');
            } else if (navigation && navigation.goBack) {
              console.log('✅ goBack() 사용');
              navigation.goBack();
            } else if (navigation && navigation.navigate) {
              console.log('🏠 메인 대시보드로 이동');
              navigation.navigate('MainDashboard');
            } else {
              console.log('❌ 네비게이션 불가');
              Alert.alert('알림', '이전 화면으로 돌아갈 수 없습니다.');
            }
          }}
          disabled={loading}
        >
          <Text style={styles.navButtonText}>⬅️ 뒤로가기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            if (navigation && navigation.navigate) {
              navigation.navigate('StockList');
            }
          }}
          disabled={loading}
        >
          <Text style={styles.navButtonText}>📊 주식 목록</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  aiInsightText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  refreshButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tradeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  navButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default StockDetail;
