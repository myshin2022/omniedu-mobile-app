// SimulationGameScreen.js (13개 종목 + 확장 가능한 비동기 구조)
import React, { useState, useEffect } from 'react';
import '../apiTest'  // 🧪 이 한 줄만 임시 추가!

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Modal  // 👈 추가
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

  // 🔍 분석 모달 표시 함수
  const showQuickAnalysis = (symbol) => {
    console.log('🔍 분석 버튼 클릭됨:', symbol);  // 👈 이 로그 추가

    setSelectedStockForAnalysis(symbol);
    setAnalysisModalVisible(true);
  };

  // 🔍 모달 닫기 함수
  const closeAnalysisModal = () => {
    setAnalysisModalVisible(false);
    setSelectedStockForAnalysis(null);
  };

  // 🔄 비동기 구조를 위한 새로운 상태들
  const [simulationStocks, setSimulationStocks] = useState([]);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [selectedStockForAnalysis, setSelectedStockForAnalysis] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(parseInt(config?.totalSteps || '24')); // 24개월로 확장!
  const [currentDate, setCurrentDate] = useState(config?.startDate || '2023-01-01');

  // 🔍 기업 분석 요약 데이터 (오리엔테이션 내용 기반)
  const stockAnalysisData = {
    AAPL: {
      name: "Apple Inc.",
      summary: "혁신의 아이콘",
      keyPoints: [
        "• iPhone부터 Vision Pro까지 혁신적 제품 라인업",
        "• 안정적인 수익과 강력한 브랜드 파워",
        "• 서비스 수익(앱스토어, 아이클라우드) 지속 성장",
        "• 세계에서 가장 가치 있는 기업 중 하나"
      ],
      recommendation: "🍎 안정적인 장기 투자처로 적합. 브랜드 파워와 서비스 확장성이 강점."
    },
    MSFT: {
      name: "Microsoft Corp.",
      summary: "클라우드와 AI의 황제",
      keyPoints: [
        "• Azure + ChatGPT 파트너십으로 AI 분야 선도",
        "• 오피스, 윈도우의 안정적 수익 기반",
        "• 기업용 소프트웨어에서 절대 강자",
        "• 클라우드 시장 2위, 꾸준한 성장"
      ],
      recommendation: "☁️ 클라우드와 AI 성장의 핵심 수혜주. 안정적이면서도 성장성 높음."
    },
    NVDA: {
      name: "NVIDIA Corp.",
      summary: "AI 혁명의 심장",
      keyPoints: [
        "• GPU로 AI 시대를 이끄는 핵심 기업",
        "• 게임용 그래픽카드에서 AI 칩 제왕으로",
        "• ChatGPT 등 AI 서비스의 필수 인프라",
        "• AI 붐으로 폭발적 성장 중"
      ],
      recommendation: "🤖 AI 혁명의 최대 수혜주. 높은 성장성과 함께 변동성도 큼."
    },
    TSLA: {
      name: "Tesla Inc.",
      summary: "전기차 혁명의 선구자",
      keyPoints: [
        "• 머스크의 비전이 현실로, 전기차 시장 선도",
        "• 자동차 + 에너지 + 기술 회사의 복합체",
        "• 자율주행, 로봇, 우주사업까지 확장",
        "• 혁신적이지만 변동성이 큰 주식"
      ],
      recommendation: "🚗 전기차와 자율주행의 미래. 높은 잠재력과 함께 리스크도 높음."
    },
    GOOGL: {
      name: "Google/Alphabet",
      summary: "검색의 제왕",
      keyPoints: [
        "• 광고 수익의 절대 강자, 검색 시장 독점",
        "• YouTube, 안드로이드, 클라우드까지",
        "• AI 분야에서도 경쟁력 확보 중",
        "• 안정적인 광고 수익 기반"
      ],
      recommendation: "🔍 인터넷 광고 시장의 왕. 안정적 수익과 AI 성장 동력 보유."
    },
    AMZN: {
      name: "Amazon",
      summary: "이커머스 + 클라우드 제국",
      keyPoints: [
        "• AWS가 수익의 핵심, 클라우드 1위",
        "• 온라인 쇼핑몰에서 시작해 종합 기술기업으로",
        "• 물류, 광고, 엔터테인먼트까지 확장",
        "• 다각화된 비즈니스 모델"
      ],
      recommendation: "📦 이커머스와 클라우드 양쪽 모두 강함. 장기 성장 스토리 견고."
    },
    META: {
      name: "Meta Platforms",
      summary: "SNS 제국에서 메타버스로",
      keyPoints: [
        "• 페이스북, 인스타그램으로 30억 사용자 보유",
        "• 전 세계 소셜 플랫폼의 절대 강자",
        "• VR/AR 메타버스 기술에 대규모 투자",
        "• 광고 수익 기반의 안정적 비즈니스"
      ],
      recommendation: "👥 소셜미디어 독점과 메타버스 투자. 현재 수익과 미래 기술 병행."
    },
    QQQ: {
      name: "Invesco QQQ",
      summary: "나스닥 100 ETF",
      keyPoints: [
        "• 한 번에 100개 기술주에 분산투자",
        "• Apple, Microsoft, NVIDIA 등 톱 기업들 포함",
        "• 개별 주식 리스크를 줄이는 효과",
        "• 기술주 전반의 성장에 투자"
      ],
      recommendation: "📈 기술주 분산투자의 정석. 안정성과 성장성의 균형."
    },
    SPY: {
      name: "SPDR S&P 500",
      summary: "미국 대표 500개 기업",
      keyPoints: [
        "• 가장 안정적인 미국 주식 투자 방법",
        "• 미국 경제 전체의 성장에 투자",
        "• 장기 투자자들이 선호하는 핵심 자산",
        "• 낮은 수수료, 높은 유동성"
      ],
      recommendation: "🇺🇸 가장 안전한 미국 투자. 장기 투자의 기본이 되는 자산."
    },
    SOXL: {
      name: "Direxion Semiconductor",
      summary: "반도체 3배 레버리지",
      keyPoints: [
        "• 반도체 시장의 3배 변동성 추종",
        "• AI, 스마트폰, 자동차 등 모든 곳에 필요한 반도체",
        "• 고위험 고수익의 대표적 ETF",
        "• 시장 상승 시 큰 수익, 하락 시 큰 손실"
      ],
      recommendation: "💾 반도체 붐 수혜 극대화. 높은 리스크와 함께 높은 수익 가능성."
    },
    NFLX: {
      name: "Netflix Inc.",
      summary: "스트리밍의 왕",
      keyPoints: [
        "• 전 세계 오리지널 콘텐츠 제작 선도",
        "• 코로나로 가속화된 OTT 시장의 1위",
        "• 게임, 광고 등 새로운 수익원 개발",
        "• 글로벌 엔터테인먼트 플랫폼"
      ],
      recommendation: "🎬 스트리밍 시장의 선두주자. 콘텐츠 경쟁 심화로 성장률 둔화 우려."
    },
    'ETH-USD': {
      name: "Ethereum",
      summary: "스마트 계약의 왕",
      keyPoints: [
        "• 블록체인 플랫폼의 대표주자",
        "• DeFi, NFT 등 다양한 서비스의 기반",
        "• 비트코인 다음으로 큰 암호화폐",
        "• 높은 변동성과 기술적 발전"
      ],
      recommendation: "💎 블록체인 생태계의 중심. 높은 변동성 주의하며 소액 투자 권장."
    },
    'BTC-USD': {
      name: "Bitcoin",
      summary: "디지털 금",
      keyPoints: [
        "• 최초이자 가장 큰 암호화폐",
        "• 탈중앙화 디지털 자산의 대표",
        "• 인플레이션 헤지 자산으로 주목",
        "• 기관 투자 증가로 안정성 개선"
      ],
      recommendation: "₿ 디지털 자산의 왕. 포트폴리오의 5-10% 정도만 배분 권장."
    }
  };

  // 🚀 확장 가능한 종목 리스트 (설정으로 분리)
  const SIMULATION_SYMBOLS = [
    'AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', // 기존 6개
    'META', 'QQQ', 'SPY', 'SOXL', 'NFLX', 'ETH-USD', 'BTC-USD' // 새로운 7개
  ];

  // 📊 종목 이름 매핑
  const STOCK_NAMES = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corp.',
    'NVDA': 'NVIDIA Corp.',
    'TSLA': 'Tesla Inc.',
    'GOOGL': 'Google',
    'AMZN': 'Amazon',
    'META': 'Meta Platforms',
    'QQQ': 'Invesco QQQ',
    'SPY': 'SPDR S&P 500',
    'SOXL': 'Direxion Semiconductor',
    'NFLX': 'Netflix Inc.',
    'ETH-USD': 'Ethereum',
    'BTC-USD': 'Bitcoin'
  };

  const showStockDetail = (symbol) => {
    navigation.navigate('StockDetail', {
      symbol: symbol,
      fromSimulation: true,  // 👈 이 파라미터 추가
      simulationDate: currentDate  // 시뮬레이션 날짜도 전달
    });
  };

  // 🤖 AI 코치 조언 시스템 (24개월 시나리오별) - 확장된 종목 포함
  const getAIAdvice = (stock, step, action) => {
    const adviceDatabase = {
      // 2023년 1월 - AI 붐 시작 전
      1: {
        NVDA: {
          buy: "🤖 AI 코치: NVDA $143은 절호의 매수 기회입니다! AI 혁명이 시작되고 있으며, GPU 수요가 폭증할 예정입니다. 적극적인 매수를 추천합니다.",
          sell: "🤖 AI 코치: 너무 성급한 매도입니다. NVDA는 AI 붐의 핵심 수혜주로, 장기 보유를 강력히 추천합니다."
        },
        TSLA: {
          buy: "🤖 AI 코치: TSLA $123은 저점 매수 기회입니다. 전기차 시장 성장과 FSD 기술 발전을 고려하면 매수 타이밍입니다.",
          sell: "🤖 AI 코치: TSLA 매도는 신중하게 판단하세요. 장기적으로 자율주행과 로봇 사업의 잠재력이 큽니다."
        },
        AAPL: {
          buy: "🤖 AI 코치: AAPL $150은 안정적인 매수입니다. Vision Pro 출시 예정과 AI 기능 강화로 성장 기대됩니다.",
          sell: "🤖 AI 코치: AAPL은 배당주로도 매력적입니다. 급하게 매도할 필요 없습니다."
        },
        MSFT: {
          buy: "🤖 AI 코치: MSFT $235는 ChatGPT 파트너십으로 AI 분야 선두주자입니다. 안전한 매수입니다.",
          sell: "🤖 AI 코치: MSFT는 클라우드와 AI 모두 강한 종목입니다. 보유 추천합니다."
        },
        QQQ: {
          buy: "🤖 AI 코치: QQQ $267은 나스닥 ETF로 기술주 분산투자에 좋습니다. AI 붐의 수혜를 받을 예정입니다.",
          sell: "🤖 AI 코치: QQQ는 장기 보유 ETF입니다. 기술주 전반의 성장을 기대해보세요."
        },
        SPY: {
          buy: "🤖 AI 코치: SPY $391은 안전한 분산투자 수단입니다. 시장 전체의 성장에 참여할 수 있습니다.",
          sell: "🤖 AI 코치: SPY는 핵심 보유 자산입니다. 장기적 관점에서 보유를 추천합니다."
        },
        'BTC-USD': {
          buy: "🤖 AI 코치: BTC $16,625는 암호화폐 겨울 이후 저점입니다. 2024년 반감기를 앞두고 매수 기회일 수 있습니다.",
          sell: "🤖 AI 코치: BTC는 변동성이 큰 자산입니다. 장기 보유 또는 일부 차익실현을 고려하세요."
        }
      },
      // 2023년 2월 - AI 붐 초기 폭발
      2: {
        NVDA: {
          buy: "🤖 AI 코치: NVDA +44% 상승 중! 아직도 매수 기회입니다. AI 붐은 이제 시작일 뿐입니다. 목표가 $300+",
          sell: "🤖 AI 코치: 일부 차익실현은 괜찮지만, 전량 매도는 추천하지 않습니다. AI 붐은 계속됩니다."
        },
        TSLA: {
          buy: "🤖 AI 코치: TSLA +67% 급등! 모멘텀이 강하지만 고점 매수 주의. 분할 매수 추천.",
          sell: "🤖 AI 코치: 급등 후 일부 차익실현은 현명한 전략입니다."
        },
        MSFT: {
          buy: "🤖 AI 코치: MSFT +7% 안정적 상승. ChatGPT 효과가 본격화되고 있습니다.",
          sell: "🤖 AI 코치: MSFT는 장기 보유주로 적합합니다."
        },
        QQQ: {
          buy: "🤖 AI 코치: QQQ도 AI 붐의 수혜를 받고 있습니다. 기술주 ETF로 분산 효과를 누리세요.",
          sell: "🤖 AI 코치: QQQ는 기술주 상승장에서 핵심 보유 자산입니다."
        }
      },
      // 2023년 5월 - AI 붐 가속화
      5: {
        NVDA: {
          buy: "🤖 AI 코치: NVDA $379! AI 붐이 절정으로 치닫고 있습니다. 하지만 여전히 상승 여력이 있습니다.",
          sell: "🤖 AI 코치: 고점 대비 일부 차익실현은 현명합니다. 하지만 전량 매도는 성급할 수 있습니다."
        },
        SOXL: {
          buy: "🤖 AI 코치: SOXL은 반도체 3배 레버리지 ETF입니다. AI 붐으로 큰 수익을 기대할 수 있지만 위험도 높습니다.",
          sell: "🤖 AI 코치: SOXL은 변동성이 매우 큽니다. 적절한 수익 실현을 고려하세요."
        }
      },
      // 2024년 1월 - AI 붐 재점화
      13: {
        NVDA: {
          buy: "🤖 AI 코치: NVDA $634! 2024년에도 AI 성장세가 계속됩니다. 기업들의 AI 투자가 본격화되고 있습니다.",
          sell: "🤖 AI 코치: 고평가 구간입니다. 일부 수익 실현을 고려해보세요."
        },
        'ETH-USD': {
          buy: "🤖 AI 코치: ETH는 AI와 블록체인 융합 트렌드의 수혜를 받을 수 있습니다. 스마트 컨트랙트 활용도가 증가하고 있습니다.",
          sell: "🤖 AI 코치: ETH는 기술적 발전이 지속되고 있습니다. 장기 관점에서 보유를 고려하세요."
        }
      },
      // 2024년 11월 - 트럼프 효과
      23: {
        NVDA: {
          buy: "🤖 AI 코치: 트럼프 당선으로 기술주가 급등했습니다. NVDA $1393은 높은 가격이지만 AI 성장은 계속됩니다.",
          sell: "🤖 AI 코치: 트럼프 랠리로 고점입니다. 차익실현을 적극 고려하세요."
        },
        TSLA: {
          buy: "🤖 AI 코치: 트럼프-머스크 관계로 TSLA가 +57% 폭등! 모멘텀은 강하지만 고점 매수 주의.",
          sell: "🤖 AI 코치: TSLA 트럼프 랠리로 급등했습니다. 일부 수익 실현 좋은 타이밍입니다."
        },
        'BTC-USD': {
          buy: "🤖 AI 코치: 트럼프의 친암호화폐 정책으로 BTC가 급등하고 있습니다. 하지만 고점 매수는 주의하세요.",
          sell: "🤖 AI 코치: BTC 트럼프 랠리로 큰 폭 상승했습니다. 일부 수익 실현을 고려해보세요."
        }
      }
    };

    const monthAdvice = adviceDatabase[step];
    if (monthAdvice && monthAdvice[stock.symbol] && monthAdvice[stock.symbol][action]) {
      return monthAdvice[stock.symbol][action];
    }

    // 기본 조언 (확장된 종목 포함)
    const basicAdvice = {
      buy: `🤖 AI 코치: ${stock.symbol} 매수를 결정하셨습니다. 현재가 $${stock.price}에서 분할 매수 전략을 추천합니다.`,
      sell: `🤖 AI 코치: ${stock.symbol} 매도 결정입니다. 수익 실현 또는 손절의 타이밍을 잘 판단하셨습니다.`
    };

    return basicAdvice[action];
  };

  // 포트폴리오 분석 및 조언 (확장된 종목 포함)
  const getPortfolioAdvice = () => {
    const totalStocks = Object.keys(simPortfolio.portfolio).length;
    const techStocks = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NFLX'].filter(
      symbol => simPortfolio.portfolio[symbol]
    ).length;
    const etfStocks = ['QQQ', 'SPY', 'SOXL'].filter(
      symbol => simPortfolio.portfolio[symbol]
    ).length;
    const cryptoStocks = ['BTC-USD', 'ETH-USD'].filter(
      symbol => simPortfolio.portfolio[symbol]
    ).length;

    if (totalStocks === 0) {
      return "🎯 포트폴리오 조언: 분산 투자를 시작하세요. NVDA, MSFT 등 AI 관련주와 SPY, QQQ 등 ETF 조합을 추천합니다.";
    }

    if (techStocks / totalStocks > 0.8) {
      return "⚠️ 포트폴리오 조언: 기술주 비중이 과도합니다. SPY, QQQ 등 ETF로 분산 투자를 고려하세요.";
    }

    if (cryptoStocks > 0 && cryptoStocks / totalStocks > 0.3) {
      return "⚠️ 포트폴리오 조언: 암호화폐 비중이 높습니다. 변동성이 큰 자산이므로 적절한 비중 조절을 고려하세요.";
    }

    if (currentStep <= 6 && !simPortfolio.portfolio['NVDA']) {
      return "💡 포트폴리오 조언: 2023년 상반기에 NVDA 미보유는 아쉽습니다. AI 붐 수혜주 검토를 추천합니다.";
    }

    if (etfStocks === 0 && totalStocks > 3) {
      return "💡 포트폴리오 조언: 개별주 중심 포트폴리오입니다. SPY나 QQQ 같은 ETF 추가를 고려해보세요.";
    }

    return "✅ 포트폴리오 조언: 균형잡힌 포트폴리오입니다. 현재 전략을 유지하세요.";
  };

  // 2023-2024년 실제 주가 데이터 (24개월 완전판)
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
    ],
    // 🚀 2024년 데이터 시작! AI 붐 확산의 해
    13: [ // 2024년 1월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 185.64, change: '-4.1%', changeValue: '-7.96' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 384.30, change: '+2.6%', changeValue: '+9.72' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 634.76, change: '+28.2%', changeValue: '+139.54' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: '+0.0%', changeValue: '+0.02' },
      { symbol: 'GOOGL', name: 'Google', price: 155.24, change: '+10.2%', changeValue: '+14.31' },
      { symbol: 'AMZN', name: 'Amazon', price: 155.93, change: '+1.7%', changeValue: '+2.55' }
    ],
    14: [ // 2024년 2월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 182.31, change: '-1.8%', changeValue: '-3.33' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.26, change: '+8.1%', changeValue: '+30.96' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 788.17, change: '+24.2%', changeValue: '+153.41' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 193.57, change: '-22.1%', changeValue: '-54.93' },
      { symbol: 'GOOGL', name: 'Google', price: 147.13, change: '-5.2%', changeValue: '-8.11' },
      { symbol: 'AMZN', name: 'Amazon', price: 153.75, change: '-1.4%', changeValue: '-2.18' }
    ],
    15: [ // 2024년 3월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 171.00, change: '-6.2%', changeValue: '-11.31' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 429.17, change: '+3.3%', changeValue: '+13.91' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 903.56, change: '+14.6%', changeValue: '+115.39' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.79, change: '-9.2%', changeValue: '-17.78' },
      { symbol: 'GOOGL', name: 'Google', price: 151.75, change: '+3.1%', changeValue: '+4.62' },
      { symbol: 'AMZN', name: 'Amazon', price: 180.38, change: '+17.3%', changeValue: '+26.63' }
    ],
    16: [ // 2024년 4월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 169.89, change: '-0.6%', changeValue: '-1.11' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 406.32, change: '-5.3%', changeValue: '-22.85' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 795.18, change: '-12.0%', changeValue: '-108.38' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 142.05, change: '-19.2%', changeValue: '-33.74' },
      { symbol: 'GOOGL', name: 'Google', price: 157.54, change: '+3.8%', changeValue: '+5.79' },
      { symbol: 'AMZN', name: 'Amazon', price: 173.51, change: '-3.8%', changeValue: '-6.87' }
    ],
    17: [ // 2024년 5월 (AI 붐 재가속!)
      { symbol: 'AAPL', name: 'Apple Inc.', price: 189.98, change: '+11.8%', changeValue: '+20.09' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 416.42, change: '+2.5%', changeValue: '+10.10' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1064.69, change: '+33.9%', changeValue: '+269.51' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 174.72, change: '+23.0%', changeValue: '+32.67' },
      { symbol: 'GOOGL', name: 'Google', price: 175.84, change: '+11.6%', changeValue: '+18.30' },
      { symbol: 'AMZN', name: 'Amazon', price: 183.54, change: '+5.8%', changeValue: '+10.03' }
    ],
    18: [ // 2024년 6월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 214.10, change: '+12.7%', changeValue: '+24.12' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 451.21, change: '+8.4%', changeValue: '+34.79' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1208.88, change: '+13.5%', changeValue: '+144.19' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 182.47, change: '+4.4%', changeValue: '+7.75' },
      { symbol: 'GOOGL', name: 'Google', price: 178.03, change: '+1.2%', changeValue: '+2.19' },
      { symbol: 'AMZN', name: 'Amazon', price: 193.61, change: '+5.5%', changeValue: '+10.07' }
    ],
    19: [ // 2024년 7월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 218.54, change: '+2.1%', changeValue: '+4.44' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 432.55, change: '-4.1%', changeValue: '-18.66' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1037.99, change: '-14.1%', changeValue: '-170.89' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 219.16, change: '+20.1%', changeValue: '+36.69' },
      { symbol: 'GOOGL', name: 'Google', price: 181.55, change: '+2.0%', changeValue: '+3.52' },
      { symbol: 'AMZN', name: 'Amazon', price: 188.44, change: '-2.7%', changeValue: '-5.17' }
    ],
    20: [ // 2024년 8월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 224.72, change: '+2.8%', changeValue: '+6.18' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 405.63, change: '-6.2%', changeValue: '-26.92' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1292.28, change: '+24.5%', changeValue: '+254.29' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 238.59, change: '+8.9%', changeValue: '+19.43' },
      { symbol: 'GOOGL', name: 'Google', price: 160.84, change: '-11.4%', changeValue: '-20.71' },
      { symbol: 'AMZN', name: 'Amazon', price: 176.39, change: '-6.4%', changeValue: '-12.05' }
    ],
    21: [ // 2024년 9월
      { symbol: 'AAPL', name: 'Apple Inc.', price: 220.70, change: '-1.8%', changeValue: '-4.02' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 416.06, change: '+2.6%', changeValue: '+10.43' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1128.17, change: '-12.7%', changeValue: '-164.11' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: '+4.2%', changeValue: '+9.91' },
      { symbol: 'GOOGL', name: 'Google', price: 164.74, change: '+2.4%', changeValue: '+3.90' },
      { symbol: 'AMZN', name: 'Amazon', price: 186.40, change: '+5.7%', changeValue: '+10.01' }
    ],
    22: [ // 2024년 10월 (트럼프 당선 기대감!)
      { symbol: 'AAPL', name: 'Apple Inc.', price: 225.77, change: '+2.3%', changeValue: '+5.07' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 406.53, change: '-2.3%', changeValue: '-9.53' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1037.15, change: '-8.1%', changeValue: '-91.02' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 218.89, change: '-11.9%', changeValue: '-29.61' },
      { symbol: 'GOOGL', name: 'Google', price: 166.84, change: '+1.3%', changeValue: '+2.10' },
      { symbol: 'AMZN', name: 'Amazon', price: 178.57, change: '-4.2%', changeValue: '-7.83' }
    ],
    23: [ // 2024년 11월 (트럼프 당선 확정!)
      { symbol: 'AAPL', name: 'Apple Inc.', price: 224.23, change: '-0.7%', changeValue: '-1.54' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 422.54, change: '+3.9%', changeValue: '+16.01' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1393.34, change: '+34.4%', changeValue: '+356.19' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 345.16, change: '+57.7%', changeValue: '+126.27' },
      { symbol: 'GOOGL', name: 'Google', price: 175.65, change: '+5.3%', changeValue: '+8.81' },
      { symbol: 'AMZN', name: 'Amazon', price: 197.93, change: '+10.8%', changeValue: '+19.36' }
    ],
    24: [ // 2024년 12월 (AI 정점!)
      { symbol: 'AAPL', name: 'Apple Inc.', price: 250.42, change: '+11.7%', changeValue: '+26.19' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 445.73, change: '+5.5%', changeValue: '+23.19' },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 1454.80, change: '+4.4%', changeValue: '+61.46' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 379.29, change: '+9.9%', changeValue: '+34.13' },
      { symbol: 'GOOGL', name: 'Google', price: 186.22, change: '+6.0%', changeValue: '+10.57' },
      { symbol: 'AMZN', name: 'Amazon', price: 220.11, change: '+11.2%', changeValue: '+22.18' }
    ]
  };

  // 🔄 확장 가능한 비동기 함수로 변경 (API 준비되면 전환 가능)
  const getCurrentStocks = async () => {
    try {
      // 🎯 나중에 API 호출로 쉽게 전환 가능
      // const response = await fetch(`${API_BASE_URL}/api/simulation/stocks/${getCurrentDateString()}`);
      // const result = await response.json();
      // if (result.success) {
      //   return result.stocks;
      // }

      // 현재는 하드코딩 데이터 + 확장된 종목
      const baseStocks = monthlyStockData[currentStep] || monthlyStockData[1];
      const additionalStocks = getAdditionalStocks();

      return [...baseStocks, ...additionalStocks];

    } catch (error) {
      console.error('주식 데이터 로딩 실패:', error);
      // 폴백: 기존 데이터만
      return monthlyStockData[currentStep] || monthlyStockData[1];
    }
  };

  // 🆕 추가 종목 데이터 생성 (임시 - 나중에 API로 교체)
  const getAdditionalStocks = () => {
    const additionalSymbols = ['META', 'QQQ', 'SPY', 'SOXL', 'NFLX', 'ETH-USD', 'BTC-USD'];

    // 간단한 가격 생성 로직 (나중에 실제 데이터로 교체 가능)
    return additionalSymbols.map(symbol => ({
      symbol,
      name: STOCK_NAMES[symbol],
      price: generatePrice(symbol, currentStep),
      change: generateChange(),
      changeValue: generateChangeValue()
    }));
  };

  // 🎲 임시 가격 생성 함수들 (나중에 제거)
  const generatePrice = (symbol, step) => {
    const basePrices = {
      'META': 120.34, 'QQQ': 267.58, 'SPY': 391.99, 'SOXL': 15.67,
      'NFLX': 337.84, 'ETH-USD': 1547.32, 'BTC-USD': 16625.08
    };

    // 단계별 변동성 적용
    const volatility = {
      'META': 0.15, 'QQQ': 0.08, 'SPY': 0.05, 'SOXL': 0.25,
      'NFLX': 0.12, 'ETH-USD': 0.20, 'BTC-USD': 0.30
    };

    const basePrice = basePrices[symbol];
    const vol = volatility[symbol];
    const growth = 1 + (step * 0.02) + (Math.random() - 0.5) * vol;

    return parseFloat((basePrice * growth).toFixed(2));
  };

  const generateChange = () => {
    const change = (Math.random() - 0.5) * 10; // -5% ~ +5%
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const generateChangeValue = () => {
    const change = (Math.random() - 0.5) * 40; // -20 ~ +20
    return `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  };

  // 📅 날짜 변환 유틸리티 (API 연동 시 필요)
  const getCurrentDateString = () => {
    const startDate = new Date('2023-01-15');
    startDate.setMonth(startDate.getMonth() + (currentStep - 1));
    return startDate.toISOString().split('T')[0];
  };

  // 🔄 useEffect 수정 - 비동기 데이터 로딩
  useEffect(() => {
    console.log('🎮 시뮬레이션 게임 시작!');
    console.log('⚙️ 설정:', config);
    console.log('💰 시뮬레이션 초기 데이터:', simPortfolio);
    console.log('📅 시작 날짜:', currentDate);

    // 주식 데이터 로딩
    loadStockData();
  }, [currentStep]); // currentStep 변경 시에도 다시 로딩

  // 🆕 데이터 로딩 함수
  const loadStockData = async () => {
    setStocksLoading(true);
    try {
      const stocks = await getCurrentStocks();
      setSimulationStocks(stocks);
      console.log('📊 주식 데이터 로딩 완료:', stocks.length, '개 종목');
    } catch (error) {
      console.error('📊 주식 데이터 로딩 실패:', error);
      // 최종 폴백
      setSimulationStocks(monthlyStockData[currentStep] || monthlyStockData[1]);
    } finally {
      setStocksLoading(false);
    }
  };

  // 주식 매수 함수 (AI 코치 조언 포함) - 수정 없음
  const buyStock = (stock, quantity) => {
    const totalCost = stock.price * quantity;

    if (totalCost > simPortfolio.balance) {
      Alert.alert('❌ 매수 실패', `잔액이 부족합니다!\n필요 금액: ${totalCost.toFixed(2)}\n현재 잔액: ${simPortfolio.balance.toFixed(2)}`);
      return;
    }

    const newBalance = simPortfolio.balance - totalCost;
    const currentHolding = simPortfolio.portfolio[stock.symbol] || { quantity: 0, avg_price: 0 };

    // 평균 단가 계산
    const totalShares = currentHolding.quantity + quantity;
    const totalValue = (currentHolding.avg_price * currentHolding.quantity) + totalCost;
    const newAvgPrice = totalValue / totalShares;

    // 🤖 AI 코치 조언 생성
    const aiAdvice = getAIAdvice(stock, currentStep, 'buy');
    const portfolioAdvice = getPortfolioAdvice();

    const newTransaction = `🎮 매수: ${stock.symbol} ${quantity}주 @ ${stock.price} (${currentDate}). 총 ${totalCost.toFixed(2)}. ${aiAdvice}`;

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
      total_asset: prev.total_asset
    }));

    console.log(`🎮 시뮬레이션 매수 완료: ${stock.symbol} ${quantity}주`);

    // AI 코치 조언과 함께 알림
    Alert.alert(
      '✅ 매수 완료!',
      `${stock.symbol} ${quantity}주를 ${totalCost.toFixed(2)}에 매수했습니다!\n\n${aiAdvice}\n\n${portfolioAdvice}\n\n남은 잔액: ${newBalance.toFixed(2)}`,
      [{ text: '확인' }]
    );
  };

  // 주식 매도 함수 (AI 코치 조언 포함) - 수정 없음
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

    // 🤖 AI 코치 조언 생성
    const aiAdvice = getAIAdvice(stock, currentStep, 'sell');

    const newTransaction = `🎮 매도: ${stock.symbol} ${quantity}주 @ ${stock.price} (${currentDate}). 총 ${totalRevenue.toFixed(2)}. (손익: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)}) ${aiAdvice}`;

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

    console.log(`🎮 시뮬레이션 매도 완료: ${stock.symbol} ${quantity}주, 손익: ${profit.toFixed(2)}`);

    // AI 코치 조언과 함께 알림
    Alert.alert(
      '✅ 매도 완료!',
      `${stock.symbol} ${quantity}주를 ${totalRevenue.toFixed(2)}에 매도했습니다!\n\n손익: ${profit >= 0 ? '+' : ''}${profit.toFixed(2)}\n\n${aiAdvice}\n\n잔액: ${newBalance.toFixed(2)}`,
      [{ text: '확인' }]
    );
  };

  // 수량 입력 함수 (자유로운 수량 선택!) - 수정 없음
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

  // 🏆 투자 성과 평가 시스템 - 수정된 버전
  const calculatePerformanceMetrics = () => {
    // 현재 포트폴리오 총 가치 계산
    const portfolioValue = Object.keys(simPortfolio.portfolio).reduce((total, symbol) => {
      const holding = simPortfolio.portfolio[symbol];
      const currentStock = simulationStocks.find(s => s.symbol === symbol);
      const currentPrice = currentStock ? currentStock.price : holding.avg_price;
      return total + (holding.quantity * currentPrice);
    }, 0);

    const totalAssets = simPortfolio.balance + portfolioValue;
    const initialAmount = 100000;
    const totalReturn = totalAssets - initialAmount;
    const returnPercentage = (totalReturn / initialAmount) * 100;

    // 벤치마크 계산 (S&P 500 approximate)
    const benchmarkReturn = getBenchmarkReturn();
    const outperformance = returnPercentage - benchmarkReturn;

    return {
      totalAssets,
      totalReturn,
      returnPercentage,
      benchmarkReturn,
      outperformance,
      portfolioValue,
      cash: simPortfolio.balance
    };
  };

  // 벤치마크 수익률 계산 (2023-2024 S&P 500 근사치) - 수정 없음
  const getBenchmarkReturn = () => {
    const monthlyReturns = {
      1: 0, 2: -2.4, 3: 3.5, 4: 1.5, 5: 0.4, 6: 6.5,
      7: 3.1, 8: -1.8, 9: -4.9, 10: -2.1, 11: 8.9, 12: 4.4,
      13: 1.6, 14: 5.3, 15: 3.1, 16: -4.2, 17: 4.8, 18: 3.5,
      19: 1.1, 20: -6.0, 21: -9.3, 22: -0.8, 23: 5.4, 24: 5.7
    };

    let cumulativeReturn = 1;
    for (let i = 1; i <= currentStep; i++) {
      if (monthlyReturns[i]) {
        cumulativeReturn *= (1 + monthlyReturns[i] / 100);
      }
    }
    return (cumulativeReturn - 1) * 100;
  };

  // 투자 등급 계산 - 수정 없음
  const getInvestmentGrade = (returnPercentage) => {
    if (returnPercentage >= 200) {
      return {
        grade: "💎 투자 마스터",
        description: "전설적인 투자 실력! 워렌 버핏급 성과입니다.",
        color: "#FFD700",
        emoji: "👑"
      };
    } else if (returnPercentage >= 100) {
      return {
        grade: "🥇 투자 고수",
        description: "뛰어난 투자 감각! 전문가 수준입니다.",
        color: "#C0C0C0",
        emoji: "🚀"
      };
    } else if (returnPercentage >= 50) {
      return {
        grade: "🥈 투자 중급자",
        description: "훌륭한 성과! 꾸준히 실력을 쌓고 있습니다.",
        color: "#CD7F32",
        emoji: "📈"
      };
    } else if (returnPercentage >= 20) {
      return {
        grade: "🥉 투자 초보자",
        description: "괜찮은 시작! 경험을 쌓아가고 있습니다.",
        color: "#87CEEB",
        emoji: "📊"
      };
    } else if (returnPercentage >= 0) {
      return {
        grade: "🔰 투자 입문자",
        description: "안전한 투자! 손실 없이 경험을 쌓았습니다.",
        color: "#90EE90",
        emoji: "🛡️"
      };
    } else {
      return {
        grade: "📉 재고 필요",
        description: "투자 전략을 다시 검토해보세요. 학습이 필요합니다.",
        color: "#FF6B6B",
        emoji: "📚"
      };
    }
  };

  // 거래 분석 (수정된 버전) - 수정 없음
  const analyzeTradeHistory = () => {
    const trades = simPortfolio.transactions.filter(t => t.includes('매수') || t.includes('매도'));
    const buyTrades = trades.filter(t => t.includes('매수')).length;
    const sellTrades = trades.filter(t => t.includes('매도')).length;

    // 수익 거래 vs 손실 거래 분석
    const profitTrades = trades.filter(t => t.includes('손익: +')).length;
    const lossTrades = trades.filter(t => t.includes('손익: -')).length;
    const winRate = sellTrades > 0 ? ((profitTrades / sellTrades) * 100).toFixed(1) : 0;

    return {
      totalTrades: trades.length,
      buyTrades,
      sellTrades,
      winRate,
      profitTrades,
      lossTrades
    };
  };

  // 다음 단계로 진행 (성과 평가 포함) - 수정 없음
  const nextStep = () => {
    if (currentStep >= totalSteps) {
      const metrics = calculatePerformanceMetrics();
      const grade = getInvestmentGrade(metrics.returnPercentage);
      const tradeStats = analyzeTradeHistory();

      Alert.alert(
        '🎉 시뮬레이션 완료!',
        `${grade.emoji} 축하합니다! 24개월 시뮬레이션을 완료했습니다!

🏆 최종 성과:
• 총 자산: ${metrics.totalAssets.toLocaleString()}
• 순수익: ${metrics.totalReturn >= 0 ? '+' : ''}${metrics.totalReturn.toLocaleString()}
• 수익률: ${metrics.returnPercentage.toFixed(1)}%

📊 벤치마크 비교:
• S&P 500: ${metrics.benchmarkReturn.toFixed(1)}%
• 초과수익: ${metrics.outperformance >= 0 ? '+' : ''}${metrics.outperformance.toFixed(1)}%

${grade.grade}
${grade.description}

📈 거래 통계:
• 총 거래: ${tradeStats.totalTrades}건
• 승률: ${tradeStats.winRate}%
• 수익 거래: ${tradeStats.profitTrades}건`,
        [
          { text: '🔄 다시 하기', onPress: () => navigation.navigate('SimulationSetup') },

          // 🆕 여기에 추가!
          {
            text: '📊 성적표 보기',
            onPress: () => navigation.navigate('InvestmentReportCard', {
              simulationResults: {
                totalAssets: metrics.totalAssets,
                returnPercentage: metrics.returnPercentage,
                transactions: simPortfolio.transactions,
                initialAmount: 100000,
                duration: totalSteps
              }
            })
          },
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

    // 중간 단계에서도 성과 표시
    if (currentStep % 6 === 0) { // 6개월마다
      const metrics = calculatePerformanceMetrics();
      const grade = getInvestmentGrade(metrics.returnPercentage);

      Alert.alert(
        '📊 중간 성과 평가',
        `${grade.emoji} ${currentStep}개월 차 성과:

💰 현재 자산: ${metrics.totalAssets.toLocaleString()}
📈 수익률: ${metrics.returnPercentage.toFixed(1)}%
📊 벤치마크 대비: ${metrics.outperformance >= 0 ? '+' : ''}${metrics.outperformance.toFixed(1)}%

${grade.grade}

계속 화이팅하세요! 🚀`,
        [{ text: '계속하기' }]
      );
    } else {
      Alert.alert('📅 다음 단계', `${config?.tradingInterval || '월간'} 단계가 진행되었습니다!\n현재: ${currentStep + 1}/${totalSteps} 단계`);
    }
  };

  // 주식 거래 알림 - 수정 없음
  const showTradeDialog = (stock) => {
    const holding = simPortfolio.portfolio[stock.symbol]?.quantity || 0;
    const maxAffordable = Math.floor(simPortfolio.balance / stock.price);

    Alert.alert(
      `📈 ${stock.symbol} 거래`,
      `${stock.name}\n현재가: ${stock.price}\n변동: ${stock.change} (${stock.changeValue})\n\n💼 보유 수량: ${holding}주\n💰 현재 잔액: ${simPortfolio.balance.toFixed(2)}\n📊 최대 매수 가능: ${maxAffordable}주`,
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

  // 주식 아이템 렌더링 - 수정 없음
  const renderStockItem = ({ item }) => (
    <View style={styles.stockItemContainer}>
      {/* 기존 터치 영역 - 매매 다이얼로그 */}
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

      {/* 새로 추가된 상세보기 버튼 */}
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => showQuickAnalysis(item.symbol)}
      >
        <Text style={styles.detailButtonText}>📊</Text>
      </TouchableOpacity>
    </View>
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
        <Text style={styles.sectionTitle}>
          📈 거래 가능 주식 ({simulationStocks.length}개 종목)
        </Text>

        {stocksLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>📊 주식 데이터 로딩 중...</Text>
          </View>
        ) : (
          <FlatList
            data={simulationStocks}
            renderItem={renderStockItem}
            keyExtractor={(item) => item.symbol}
            style={styles.stockList}
          />
        )}
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
    {/* 🔍 분석 모달 */}
    <Modal
      visible={analysisModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeAnalysisModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalScrollView}>
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                📊 {selectedStockForAnalysis && stockAnalysisData[selectedStockForAnalysis]?.name}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeAnalysisModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* 기업 요약 */}
            {selectedStockForAnalysis && stockAnalysisData[selectedStockForAnalysis] && (
              <View style={styles.analysisContent}>
                <Text style={styles.summaryText}>
                  {stockAnalysisData[selectedStockForAnalysis].summary}
                </Text>
                
                {/* 핵심 포인트 */}
                <View style={styles.keyPointsContainer}>
                  <Text style={styles.sectionTitle}>🔍 핵심 포인트</Text>
                  {stockAnalysisData[selectedStockForAnalysis].keyPoints.map((point, index) => (
                    <Text key={index} style={styles.keyPointText}>{point}</Text>
                  ))}
                </View>

                {/* 투자 추천 */}
                <View style={styles.recommendationContainer}>
                  <Text style={styles.sectionTitle}>💡 투자 관점</Text>
                  <Text style={styles.recommendationText}>
                    {stockAnalysisData[selectedStockForAnalysis].recommendation}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>  // 👈 새로운 최종 컨테이너 닫기
);  // 👈 return 끝
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
  // 🆕 로딩 관련 스타일 추가
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  // 🔄 수정된 stockItemContainer (새로 추가)
  stockItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  // 🔄 수정된 stockItem
  stockItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  // 📊 새로 추가된 detailButton
  detailButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  // 📊 새로 추가된 detailButtonText
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  modalScrollView: {
    maxHeight: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  analysisContent: {
    padding: 10,
  },
  modalSummaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  keyPointsContainer: {
    marginBottom: 10,
  },
  recommendationContainer: {
    marginTop: 10,
  },
  keyPointText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 5,
    lineHeight: 20,
  },
  recommendationText: {
    fontSize: 14,
    color: '#2e7d32',
    fontStyle: 'italic',
    padding: 10,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
  },
});
