// SimulationOrientation.js - 투자 시뮬레이션 오리엔테이션
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SimulationOrientation({ navigation, route }) {
  const { config } = route?.params || {};
  const [currentPage, setCurrentPage] = useState(0);
  const [simulationCount, setSimulationCount] = useState(0);

  // 시뮬레이션 횟수 확인
  useEffect(() => {
    checkSimulationCount();
  }, []);

  const checkSimulationCount = async () => {
    try {
      const count = await AsyncStorage.getItem('simulationCount');
      setSimulationCount(parseInt(count) || 0);
    } catch (error) {
      console.error('시뮬레이션 횟수 확인 오류:', error);
    }
  };

  // 오리엔테이션 페이지들
  const orientationPages = [
    {
      title: "🎓 투자 시뮬레이션에 오신 것을 환영합니다!",
      content: [
        "🎯 이 시뮬레이션에서는 2023-2024년 실제 주식 시장을 체험해보실 수 있습니다.",
        "",
        "📚 투자 기초 원칙:",
        "• 투자는 '회사의 작은 조각'을 사는 것입니다",
        "• 좋은 회사를 적정 가격에 사서, 성장을 기다리는 게임",
        "• '달걀을 한 바구니에 담지 마라' - 분산투자의 중요성",
        "• 시간은 투자자의 친구 - 장기 관점이 중요합니다",
        "",
        "💡 무작정 사고팔지 말고, 각 기업이 무엇을 하는지 알고 투자하세요!"
      ]
    },
    {
      title: "📈 2023-2024 증시 주요 트렌드",
      content: [
        "🤖 AI 혁명 (2023년 ChatGPT 열풍)",
        "• 인공지능이 모든 산업을 바꾸고 있습니다",
        "• NVIDIA, Microsoft 등 AI 관련 기업들이 급성장",
        "• GPU, 클라우드, AI 소프트웨어 수요 폭증",
        "",
        "🚗 전기차 및 자율주행",
        "• Tesla가 선도하는 전기차 혁명",
        "• 기존 자동차 회사들도 전기차로 전환",
        "• 배터리, 반도체 기술이 핵심",
        "",
        "💰 중앙은행 정책 변화",
        "• 금리 인상이 성장주에 영향",
        "• 인플레이션과 경제 성장률 주시 필요",
        "",
        "₿ 암호화폐 변동성",
        "• 비트코인, 이더리움 등 높은 변동성",
        "• 규제 이슈와 기관 투자 증가"
      ]
    },
    {
      title: "🏢 투자 가능 기업들 - 기술주 편",
      content: [
        "🍎 AAPL (Apple)",
        "• '혁신의 아이콘' - iPhone부터 Vision Pro까지",
        "• 안정적인 수익과 강력한 브랜드 파워",
        "• 서비스 수익(앱스토어, 아이클라우드) 지속 성장",
        "",
        "🤖 NVDA (NVIDIA)",
        "• 'AI 혁명의 심장' - GPU로 AI 시대를 이끈다",
        "• 게임용 그래픽카드에서 AI 칩 제왕으로",
        "• ChatGPT 등 AI 서비스의 핵심 인프라",
        "",
        "🚗 TSLA (Tesla)",
        "• '전기차 혁명의 선구자' - 머스크의 비전이 현실로",
        "• 자동차 회사 + 에너지 회사 + 기술 회사",
        "• 자율주행, 로봇, 우주사업까지 확장",
        "",
        "☁️ MSFT (Microsoft)",
        "• '클라우드와 AI의 황제' - Azure + ChatGPT 파트너십",
        "• 오피스, 윈도우의 안정적 수익 기반",
        "• 기업용 소프트웨어에서 절대 강자"
      ]
    },
    {
      title: "🏢 투자 가능 기업들 - 다양한 분야",
      content: [
        "🔍 GOOGL (Google/Alphabet)",
        "• '검색의 제왕' - 광고 수익의 절대 강자",
        "• YouTube, 안드로이드, 클라우드까지",
        "• AI 분야에서도 경쟁력 확보 중",
        "",
        "📦 AMZN (Amazon)",
        "• '이커머스 + 클라우드 제국' - AWS가 수익 핵심",
        "• 온라인 쇼핑몰에서 시작해 클라우드 1위로",
        "• 물류, 광고, 엔터테인먼트까지 확장",
        "",
        "👥 META (Meta/Facebook)",
        "• 'SNS 제국에서 메타버스로' - 페이스북, 인스타그램",
        "• 전 세계 30억 사용자의 소셜 플랫폼",
        "• VR/AR 메타버스 기술에 대규모 투자",
        "",
        "🎬 NFLX (Netflix)",
        "• '스트리밍의 왕' - 전 세계 오리지널 콘텐츠",
        "• 코로나로 가속화된 OTT 시장 선도",
        "• 게임, 광고 등 새로운 수익원 개발 중"
      ]
    },
    {
      title: "📊 ETF와 암호화폐",
      content: [
        "📈 QQQ (Invesco QQQ Trust)",
        "• '나스닥 100 ETF' - 한 번에 100개 기술주 투자",
        "• 개별 주식 리스크를 줄이는 분산투자",
        "• Apple, Microsoft, NVIDIA 등 톱 기업들 포함",
        "",
        "🇺🇸 SPY (SPDR S&P 500)",
        "• 'S&P 500 ETF' - 미국 대표 500개 기업",
        "• 가장 안정적인 미국 주식 투자 방법",
        "• 장기 투자자들이 선호하는 핵심 자산",
        "",
        "💾 SOXL (Direxion Daily Semiconductor)",
        "• '반도체 3배 레버리지 ETF' - 고위험 고수익",
        "• 반도체 시장의 3배 변동성 추종",
        "• AI, 스마트폰, 자동차 등 모든 곳에 필요한 반도체",
        "",
        "₿ BTC-USD (Bitcoin)",
        "• '디지털 금' - 탈중앙화 암호화폐",
        "• 높은 변동성, 높은 수익 가능성",
        "• 인플레이션 헤지 자산으로 주목받는 중",
        "",
        "💎 ETH-USD (Ethereum)",
        "• '스마트 계약의 왕' - 블록체인 플랫폼",
        "• DeFi, NFT 등 다양한 서비스의 기반",
        "• 비트코인 다음으로 큰 암호화폐"
      ]
    },
    {
      title: "🎯 투자 전략과 주의사항",
      content: [
        "💡 성공하는 투자 전략:",
        "• 분산투자: 여러 종목에 나누어 투자하기",
        "• 장기투자: 좋은 기업을 오래 보유하기",
        "• 꾸준한 학습: 투자한 기업과 시장 상황 파악하기",
        "• 감정 조절: 공포와 탐욕에 휘둘리지 않기",
        "",
        "⚠️ 주의사항:",
        "• 한 종목에 모든 돈을 투자하지 마세요",
        "• 단기 등락에 일희일비하지 마세요",
        "• 빌린 돈으로 투자하지 마세요",
        "• 모르는 기업에 투자하지 마세요",
        "",
        "🎮 시뮬레이션 활용법:",
        "• 각 기업의 특징을 이해하고 투자하세요",
        "• 시장 상황 변화에 따른 주가 움직임 관찰하세요",
        "• 다양한 전략을 실험해보세요",
        "• 실수를 두려워하지 마세요 - 배움의 기회입니다!",
        "",
        "🚀 이제 시뮬레이션을 시작해볼 준비가 되셨나요?"
      ]
    }
  ];

  // 다음 페이지로
  const nextPage = () => {
    if (currentPage < orientationPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      completeOrientation();
    }
  };

  // 이전 페이지로
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 오리엔테이션 완료
  const completeOrientation = async () => {
    try {
      // 시뮬레이션 횟수 증가
      const newCount = simulationCount + 1;
      await AsyncStorage.setItem('simulationCount', newCount.toString());

      Alert.alert(
        '🎓 오리엔테이션 완료!',
        '이제 실제 투자 시뮬레이션을 시작해보세요!\n\n💡 Tip: 게임 중에도 "분석 참고" 버튼으로 기업 정보를 다시 볼 수 있습니다.',
        [
          {
            text: '🎮 시뮬레이션 시작!',
            onPress: () => navigation.navigate('SimulationProgress', route?.params)
          }
        ]
      );
    } catch (error) {
      console.error('오리엔테이션 완료 오류:', error);
      navigation.navigate('SimulationProgress', route?.params);
    }
  };

  // 건너뛰기 (3회 이상 경험자만)
  const skipOrientation = () => {
    Alert.alert(
      '오리엔테이션 건너뛰기',
      '정말 건너뛰고 바로 시뮬레이션을 시작하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '네, 바로 시작',
          onPress: () => navigation.navigate('SimulationProgress', route?.params)
        }
      ]
    );
  };

  const currentPageData = orientationPages[currentPage];

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
        <Text style={styles.headerTitle}>투자 오리엔테이션</Text>
        {simulationCount >= 2 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipOrientation}
          >
            <Text style={styles.skipButtonText}>건너뛰기</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 진행률 표시 */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentPage + 1} / {orientationPages.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentPage + 1) / orientationPages.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      {/* 콘텐츠 */}
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>{currentPageData.title}</Text>
        <View style={styles.contentBox}>
          {currentPageData.content.map((line, index) => (
            <Text
              key={index}
              style={[
                styles.contentText,
                line.startsWith('•') && styles.bulletPoint,
                line.startsWith('🎯') && styles.highlight,
                line.startsWith('⚠️') && styles.warning,
                line === '' && styles.spacer
              ]}
            >
              {line}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* 네비게이션 버튼 */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
          onPress={prevPage}
          disabled={currentPage === 0}
        >
          <Text style={[styles.navButtonText, currentPage === 0 && styles.navButtonTextDisabled]}>
            ← 이전
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={nextPage}
        >
          <Text style={styles.nextButtonText}>
            {currentPage === orientationPages.length - 1 ? '🎮 시뮬레이션 시작!' : '다음 →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 사용자 도움말 */}
      {simulationCount === 0 && (
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            💡 첫 번째 시뮬레이션이시네요! 오리엔테이션을 통해 투자 기초를 익혀보세요.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 2,
    textAlign: 'center',
  },
  skipButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 28,
  },
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 8,
  },
  bulletPoint: {
    marginLeft: 10,
    color: '#555',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  warning: {
    fontWeight: 'bold',
    color: '#dc3545',
  },
  spacer: {
    height: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  navButtonTextDisabled: {
    color: '#adb5bd',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  helpContainer: {
    backgroundColor: '#e3f2fd',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  helpText: {
    fontSize: 14,
    color: '#1565c0',
    textAlign: 'center',
  },
});