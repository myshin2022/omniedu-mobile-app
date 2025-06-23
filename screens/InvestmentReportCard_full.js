// screens/InvestmentReportCard.js - 완성된 투자 성적표 (개념화 분석 포함)
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

const { width } = Dimensions.get('window');

export default function InvestmentReportCard({ navigation, route }) {
  const { simulationResults, userProfile } = route?.params || {};
  
  // 성적표 데이터 상태
  const [reportData, setReportData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('total');

  useEffect(() => {
    if (simulationResults) {
      generateReportCard();
    }
  }, [simulationResults, selectedPeriod]);

  // 📊 성적표 데이터 생성
  const generateReportCard = () => {
    const results = simulationResults;
    
    // 기본 성과 계산
    const initialAmount = results.initialAmount || 100000;
    const finalAmount = results.totalAssets || results.balance;
    const totalReturn = finalAmount - initialAmount;
    const returnPercentage = (totalReturn / initialAmount) * 100;
    
    // 벤치마크 비교
    const benchmarkReturn = calculateBenchmarkReturn(results.duration || 24);
    const outperformance = returnPercentage - benchmarkReturn;
    
    // 거래 분석
    const tradeAnalysis = analyzeTradeHistory(results.transactions || []);
    
    // 리스크 분석
    const riskMetrics = calculateRiskMetrics(results);
    
    // 투자 등급
    const grade = calculateInvestmentGrade(returnPercentage, riskMetrics.sharpeRatio);
    
    // 🧠 개념화 수준 분석 (새로 추가!)
    const conceptualizationAnalysis = analyzeConceptualizationLevel(results, tradeAnalysis);
    
    // 🧬 개인 투자 DNA 분석 (새로 추가!)
    const investmentDNAAnalysis = analyzeInvestmentDNA(results, tradeAnalysis, conceptualizationAnalysis);
    
    // 강점/약점 분석
    const strengthsWeaknesses = analyzeStrengthsWeaknesses(results, tradeAnalysis);
    
    setReportData({
      overview: {
        period: `${results.duration || 24}개월`,
        initialAmount,
        finalAmount,
        totalReturn,
        returnPercentage,
        benchmarkReturn,
        outperformance,
        grade
      },
      tradeAnalysis,
      riskMetrics,
      conceptualizationAnalysis, // 🆕 개념화 분석 추가
      investmentDNAAnalysis, // 🆕 DNA 분석 추가
      strengthsWeaknesses,
      achievements: generateAchievements(results, tradeAnalysis)
    });
  };

  // 🧠 개념화 수준 분석 함수
  const analyzeConceptualizationLevel = (results, tradeAnalysis) => {
    const insights = [];
    let totalScore = 0;

    // 1. 🌊 메가트렌드 이해도 분석
    const trendScore = analyzeTrendUnderstanding(results, tradeAnalysis);
    totalScore += trendScore.score;
    if (trendScore.score >= 15) {
      insights.push({
        category: "🌊 메가트렌드 포착",
        level: "고급",
        comment: trendScore.insight,
        evidence: trendScore.evidence
      });
    }

    // 2. ⚖️ 리스크 관리 체계화
    const riskScore = analyzeRiskSystematization(results, tradeAnalysis);
    totalScore += riskScore.score;
    if (riskScore.score >= 15) {
      insights.push({
        category: "⚖️ 리스크 관리 체계화",
        level: "고급", 
        comment: riskScore.insight,
        evidence: riskScore.evidence
      });
    }

    // 3. 🔄 매매 철학 체계화
    const tradingScore = analyzeTradingPhilosophy(results, tradeAnalysis);
    totalScore += tradingScore.score;
    if (tradingScore.score >= 15) {
      insights.push({
        category: "🔄 매매 철학 체계화",
        level: "고급",
        comment: tradingScore.insight,
        evidence: tradingScore.evidence
      });
    }

    // 4. 📊 확률적 사고
    const probScore = analyzeProbabilisticThinking(results, tradeAnalysis);
    totalScore += probScore.score;
    if (probScore.score >= 10) {
      insights.push({
        category: "📊 확률적 사고",
        level: "고급",
        comment: probScore.insight,
        evidence: probScore.evidence
      });
    }

    const conceptLevel = determineConceptualizationLevel(totalScore);
    const description = getConceptualizationDescription(conceptLevel);
    const recommendations = generateConceptualRecommendations(conceptLevel);

    return {
      score: totalScore,
      level: conceptLevel,
      description,
      insights,
      recommendations
    };
  };

  // 🌊 메가트렌드 이해도 분석
  const analyzeTrendUnderstanding = (results, tradeAnalysis) => {
    let score = 0;
    let insight = "";
    let evidence = [];

    // NVIDIA 집중 투자 분석
    if (tradeAnalysis.mostTradedStock === 'NVDA') {
      score += 15;
      evidence.push("AI 핵심 수혜주 NVIDIA 집중");
      
      if (results.returnPercentage > 100) {
        score += 10;
        evidence.push(`${results.returnPercentage.toFixed(1)}% 수익률 달성`);
        insight = "**AI 메가트렌드의 본질**을 정확히 파악했습니다. 단순히 '기술주가 오른다'가 아니라 'AI 인프라의 핵심은 GPU'라는 **구조적 이해**를 보여줍니다. 이는 패턴 인식을 넘어선 **개념적 사고**의 증거입니다.";
      }
    }

    return { score, insight, evidence };
  };

  // ⚖️ 리스크 관리 체계화 분석
  const analyzeRiskSystematization = (results, tradeAnalysis) => {
    let score = 0;
    let insight = "";
    let evidence = [];

    if (tradeAnalysis.winRate >= 70) {
      score += 15;
      evidence.push(`매매 승률 ${tradeAnalysis.winRate}%`);
      insight = "높은 승률은 **감정적 매매를 극복**하고 **원칙 기반 투자**를 하고 있음을 보여줍니다. ";
    }

    if (tradeAnalysis.tradingFrequency >= 1 && tradeAnalysis.tradingFrequency <= 3) {
      score += 10;
      evidence.push("적절한 매매 빈도 유지");
      insight += "과도하지 않은 매매 빈도는 **확신 있는 거래**만 실행하는 체계를 갖췄음을 의미합니다.";
    }

    return { score, insight, evidence };
  };

  // 🔄 매매 철학 체계화 분석
  const analyzeTradingPhilosophy = (results, tradeAnalysis) => {
    let score = 0;
    let insight = "";
    let evidence = [];

    const profitRealizations = results.transactions?.filter(t => 
      typeof t === 'string' && t.includes('매도') && t.includes('손익: +')
    ).length || 0;

    if (profitRealizations >= 5) {
      score += 15;
      evidence.push(`${profitRealizations}회 차익실현`);
      insight = "**체계적 차익실현 패턴**을 보입니다. 이는 욕심과 두려움을 넘어선 **기계적 실행력**의 증거입니다. '절반씩 매도' 같은 원칙을 체화했을 가능성이 높습니다.";
    }

    return { score, insight, evidence };
  };

  // 📊 확률적 사고 분석
  const analyzeProbabilisticThinking = (results, tradeAnalysis) => {
    let score = 0;
    let insight = "";
    let evidence = [];

    if (tradeAnalysis.winRate > 60 && tradeAnalysis.totalTrades >= 10) {
      score += 10;
      evidence.push("일관된 전략 실행");
      insight = "반복 가능한 수익 패턴은 **확률적 우위**를 찾아 체계화했음을 의미합니다.";
    }

    return { score, insight, evidence };
  };

  // 📊 개념화 레벨 결정
  const determineConceptualizationLevel = (score) => {
    if (score >= 60) return "🧠 추세 마스터";
    if (score >= 40) return "🎯 개념화 고급";  
    if (score >= 25) return "📈 개념화 중급";
    if (score >= 15) return "📊 개념화 초급";
    return "🔰 패턴 학습";
  };

  // 📝 개념화 레벨별 설명
  const getConceptualizationDescription = (level) => {
    const descriptions = {
      "🧠 추세 마스터": "시장의 본질을 꿰뚫고 메가트렌드를 체계적으로 활용하는 최고 수준입니다. 워렌 버핏이 말한 '시장의 비합리성을 이용하는' 단계에 도달했습니다.",
      "🎯 개념화 고급": "단순한 패턴 추종을 넘어 시장의 구조적 변화를 이해하고 체계적으로 접근합니다. 전문 투자자 수준의 사고력을 보여줍니다.",
      "📈 개념화 중급": "기본적인 투자 원리를 이해하고 나름의 체계를 갖추기 시작했습니다. 감정적 매매에서 벗어나 논리적 접근을 시도합니다.",
      "📊 개념화 초급": "투자의 기본 개념들을 학습하고 적용해보는 단계입니다. 아직 일관된 전략은 부족하지만 발전 가능성이 보입니다.",
      "🔰 패턴 학습": "차트 패턴이나 단순한 규칙을 따르는 단계입니다. 더 깊은 이해와 체계적 접근이 필요합니다."
    };
    
    return descriptions[level] || descriptions["🔰 패턴 학습"];
  };

  // 💡 개념화 수준별 추천사항
  const generateConceptualRecommendations = (level) => {
    const recommendations = {
      "🧠 추세 마스터": [
        "🌍 글로벌 메가트렌드 발굴에 도전하세요",
        "📚 투자 철학을 체계화하여 다른 이들과 공유해보세요",
        "🎯 포트폴리오 매니저나 투자 자문 전문가 진로를 고려해보세요"
      ],
      "🎯 개념화 고급": [
        "🔮 다음 메가트렌드(바이오테크, 우주경제) 연구를 시작하세요",
        "📊 정량적 모델링(백테스팅, 리스크 지표)을 학습하세요",
        "🎓 CFA나 투자 관련 자격증 취득을 고려해보세요"
      ],
      "📈 개념화 중급": [
        "📖 투자 고전(워렌 버핏, 벤저민 그레이엄) 연구하세요",
        "🔍 섹터별 심층 분석 능력을 기르세요",
        "📊 재무제표 읽기와 기업 분석 실력을 향상시키세요"
      ],
      "📊 개념화 초급": [
        "📚 투자 기본서적으로 이론을 체계화하세요",
        "💡 소액으로 다양한 전략을 실험해보세요", 
        "📝 매매 일지를 작성하여 패턴을 찾아보세요"
      ],
      "🔰 패턴 학습": [
        "🎯 한 가지 전략에 집중하여 숙련도를 높이세요",
        "📖 투자 입문서부터 차근차근 학습하세요",
        "🛡️ 리스크 관리(손절, 분산투자)부터 체화하세요"
      ]
    };

    return recommendations[level] || recommendations["🔰 패턴 학습"];
  };

  // 🧬 개인 투자 DNA 분석 함수 (완전판)
  const analyzeInvestmentDNA = (results, tradeAnalysis, conceptualizationAnalysis) => {
    const dnaTraits = [];
    let primaryDNA = '';
    let secondaryDNA = '';
    
    // 1. 🎯 집중도 분석 (집중형 vs 분산형)
    const concentrationAnalysis = analyzeConcentrationStyle(results, tradeAnalysis);
    dnaTraits.push(concentrationAnalysis);
    
    // 2. ⚡ 액션 스타일 분석 (액션형 vs 관찰형)
    const actionAnalysis = analyzeActionStyle(results, tradeAnalysis);
    dnaTraits.push(actionAnalysis);
    
    // 3. 🔍 의사결정 스타일 분석 (분석형 vs 직감형)
    const decisionAnalysis = analyzeDecisionStyle(results, tradeAnalysis);
    dnaTraits.push(decisionAnalysis);
    
    // 4. 🌊 시장 접근법 분석 (파도타기형 vs 묵직형)
    const marketApproachAnalysis = analyzeMarketApproach(results, tradeAnalysis);
    dnaTraits.push(marketApproachAnalysis);
    
    // 5. 🎲 리스크 성향 분석 (모험형 vs 안전형)
    const riskToleranceAnalysis = analyzeRiskTolerance(results, tradeAnalysis);
    dnaTraits.push(riskToleranceAnalysis);
    
    // 주요 DNA 특성 결정
    const sortedTraits = dnaTraits.sort((a, b) => b.score - a.score);
    primaryDNA = sortedTraits[0]?.type || '';
    secondaryDNA = sortedTraits[1]?.type || '';
    
    // DNA 조합별 투자자 타입 결정
    const investorType = determineInvestorType(primaryDNA, secondaryDNA, conceptualizationAnalysis.level);
    
    // 맞춤형 성장 로드맵 생성
    const growthRoadmap = generateGrowthRoadmap(investorType, dnaTraits, conceptualizationAnalysis);
    
    // 호환 가능한 투자 스타일 추천
    const compatibleStyles = getCompatibleInvestmentStyles(primaryDNA, secondaryDNA);
    
    return {
      primaryDNA,
      secondaryDNA,
      investorType,
      dnaTraits,
      growthRoadmap,
      compatibleStyles,
      personalizedInsights: generatePersonalizedInsights(investorType, results)
    };
  };

  // 🎯 집중도 분석 (집중형 vs 분산형)
  const analyzeConcentrationStyle = (results, tradeAnalysis) => {
    const portfolio = results.portfolio || {};
    const totalPositions = Object.keys(portfolio).length;
    
    // 주력 종목 비중 계산
    const positions = Object.values(portfolio);
    const totalShares = positions.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const maxPosition = positions.length > 0 ? Math.max(...positions.map(p => p.quantity || 0)) : 0;
    const concentration = totalShares > 0 ? (maxPosition / totalShares) : 0;
    
    let score = 0;
    let type = '';
    let insight = '';
    let recommendation = '';
    
    if (concentration > 0.6 || totalPositions <= 2) {
      score = 85;
      type = '🎯 집중형';
      insight = `확신 있는 테마나 종목에 **집중 투자**하는 스타일입니다. ${tradeAnalysis.mostTradedStock} 중심의 포트폴리오는 **깊은 이해**를 바탕으로 한 확신의 증거입니다.`;
      recommendation = '이 강점을 살려 새로운 메가트렌드 발굴에 도전하세요. 예: 양자컴퓨팅, 바이오테크 등';
    } else if (concentration > 0.3 || totalPositions <= 4) {
      score = 60;
      type = '🎯 집중-균형형';
      insight = '핵심 종목에 집중하면서도 **적절한 분산**을 고려하는 균형 잡힌 스타일입니다.';
      recommendation = '현재 스타일을 유지하되, 섹터 분산을 고려해보세요.';
    } else {
      score = 40;
      type = '🌈 분산형';
      insight = '리스크를 분산하여 **안정성을 추구**하는 스타일입니다. 여러 종목에 골고루 투자합니다.';
      recommendation = '분산의 장점을 살리되, 핵심 확신 종목의 비중을 늘려보세요.';
    }
    
    return { type, score, insight, recommendation, evidence: [`집중도: ${(concentration * 100).toFixed(1)}%`, `보유 종목: ${totalPositions}개`] };
  };

  // ⚡ 액션 스타일 분석 (액션형 vs 관찰형)
  const analyzeActionStyle = (results, tradeAnalysis) => {
    const tradingFreq = tradeAnalysis.tradingFrequency || 0;
    const totalTrades = tradeAnalysis.totalTrades || 0;
    
    let score = 0;
    let type = '';
    let insight = '';
    let recommendation = '';
    
    if (tradingFreq > 3 || totalTrades > 30) {
      score = 85;
      type = '⚡ 액션형';
      insight = '**시장 변화에 민감**하게 반응하며 기회를 적극적으로 포착하는 스타일입니다. 변동성을 두려워하지 않고 **능동적으로 활용**합니다.';
      recommendation = '이 민첩성을 살려 단기 테마 전환 전략을 개발해보세요. 다만 과매매 주의!';
    } else if (tradingFreq > 1.5 || totalTrades > 15) {
      score = 70;
      type = '⚡ 액션-균형형';
      insight = '필요할 때는 **적극적으로 움직이지만** 신중함도 겸비한 스타일입니다.';
      recommendation = '현재의 균형감을 유지하면서 매매 타이밍을 더 정교화해보세요.';
    } else {
      score = 55;
      type = '🧘 관찰형';
      insight = '**신중하고 깊이 있게** 관찰한 후 움직이는 스타일입니다. 급하지 않게 확신이 설 때 행동합니다.';
      recommendation = '이 신중함은 장점입니다. 다만 기회를 놓치지 않도록 알림 시스템을 활용해보세요.';
    }
    
    return { type, score, insight, recommendation, evidence: [`거래 빈도: 월 ${tradingFreq.toFixed(1)}회`, `총 거래: ${totalTrades}건`] };
  };

  // 🔍 의사결정 스타일 분석 (분석형 vs 직감형)
  const analyzeDecisionStyle = (results, tradeAnalysis) => {
    const winRate = tradeAnalysis.winRate || 0;
    const returnPercentage = results.returnPercentage || 0;
    
    let score = 0;
    let type = '';
    let insight = '';
    let recommendation = '';
    
    if (winRate >= 75) {
      score = 85;
      type = '🔍 분석형';
      insight = `높은 승률 ${winRate}%는 **체계적 분석**을 통한 의사결정을 보여줍니다. 감정보다는 **논리적 근거**를 중시하는 스타일입니다.`;
      recommendation = '이 분석력을 살려 정량적 모델링을 시도해보세요. 백테스팅, 리스크 지표 활용 등';
    } else if (winRate >= 60) {
      score = 70;
      type = '🔍 분석-직감형';
      insight = '기본적인 **분석을 바탕으로** 하되 **직감적 판단**도 활용하는 균형 잡힌 스타일입니다.';
      recommendation = '분석과 직감의 조화를 더욱 발전시켜보세요. 패턴 인식 능력 향상에 집중';
    } else if (returnPercentage > 100) {
      score = 80;
      type = '💡 직감형';
      insight = `높은 수익률 ${returnPercentage.toFixed(1)}%는 **뛰어난 시장 감각**을 보여줍니다. 데이터로 설명하기 어려운 **직관적 판단력**이 강점입니다.`;
      recommendation = '이 직감을 더욱 체계화해보세요. 패턴 노트 작성, 감정 일지 등으로 직감의 근거 찾기';
    } else {
      score = 50;
      type = '🔰 학습형';
      insight = '아직 **자신만의 의사결정 스타일**을 찾아가는 단계입니다. 다양한 접근법을 시도해보세요.';
      recommendation = '분석적 접근과 직감적 접근을 모두 실험해보며 자신에게 맞는 스타일을 찾아보세요.';
    }
    
    return { type, score, insight, recommendation, evidence: [`승률: ${winRate}%`, `수익률: ${returnPercentage.toFixed(1)}%`] };
  };

  // 🌊 시장 접근법 분석 (파도타기형 vs 묵직형)
  const analyzeMarketApproach = (results, tradeAnalysis) => {
    const profitTrades = tradeAnalysis.profitTrades || 0;
    const sellTrades = tradeAnalysis.sellTrades || 0;
    const swingRatio = sellTrades > 0 ? profitTrades / sellTrades : 0;
    
    let score = 0;
    let type = '';
    let insight = '';
    let recommendation = '';
    
    if (swingRatio > 0.7 && sellTrades >= 5) {
      score = 85;
      type = '🌊 파도타기형';
      insight = '시장의 **리듬감**을 체득하고 변동성을 수익으로 전환하는 능력이 뛰어납니다. 마치 서핑하듯 **추세를 타는** 스타일입니다.';
      recommendation = '이 감각을 살려 멀티 타임프레임 전략을 개발해보세요. 일봉, 주봉 조합 등';
    } else if (swingRatio > 0.5 && sellTrades >= 3) {
      score = 70;
      type = '🌊 파도-묵직형';
      insight = '변동성을 활용하면서도 **안정성을 추구**하는 균형 잡힌 접근법입니다.';
      recommendation = '현재 스타일을 기반으로 리스크 관리 시스템을 더욱 정교화해보세요.';
    } else {
      score = 60;
      type = '🏔️ 묵직형';
      insight = '**장기적 관점**에서 묵직하게 버티는 스타일입니다. 단기 변동에 흔들리지 않는 **강인한 멘탈**이 특징입니다.';
      recommendation = '이 안정성은 큰 장점입니다. 배당주나 성장주 장기 투자 전략을 고려해보세요.';
    }
    
    return { type, score, insight, recommendation, evidence: [`스윙 성공률: ${(swingRatio * 100).toFixed(1)}%`, `매도 횟수: ${sellTrades}회`] };
  };

  // 🎲 리스크 성향 분석 (모험형 vs 안전형)
  const analyzeRiskTolerance = (results, tradeAnalysis) => {
    const returnPercentage = results.returnPercentage || 0;
    const winRate = tradeAnalysis.winRate || 0;
    
    let score = 0;
    let type = '';
    let insight = '';
    let recommendation = '';
    
    if (returnPercentage > 100 && winRate < 70) {
      score = 85;
      type = '🎲 모험형';
      insight = `${returnPercentage.toFixed(1)}% 수익률은 **과감한 리스크 테이킹**의 결과입니다. 큰 기회를 놓치지 않는 **모험 정신**이 강점입니다.`;
      recommendation = '이 도전 정신을 살려 새로운 테마나 신흥 시장 진출을 고려해보세요. 단, 리스크 관리 강화 필요';
    } else if (returnPercentage > 50 && winRate > 65) {
      score = 70;
      type = '🎲 모험-안전형';
      insight = '**계산된 리스크**를 감수하는 스타일입니다. 안전성과 수익성의 균형을 추구합니다.';
      recommendation = '현재의 균형감을 유지하되, 점진적으로 리스크 한계를 확장해보세요.';
    } else if (winRate > 70) {
      score = 60;
      type = '🛡️ 안전형';
      insight = `높은 승률 ${winRate}%는 **안정성을 우선**하는 신중한 접근을 보여줍니다. 손실을 최소화하는 **방어적 전략**이 특징입니다.`;
      recommendation = '이 안정성을 기반으로 점진적으로 수익률 향상 방안을 모색해보세요.';
    } else {
      score = 50;
      type = '🔰 탐색형';
      insight = '아직 **자신만의 리스크 수준**을 찾아가는 단계입니다.';
      recommendation = '다양한 리스크 수준을 실험해보며 최적의 밸런스를 찾아보세요.';
    }
    
    return { type, score, insight, recommendation, evidence: [`수익률: ${returnPercentage.toFixed(1)}%`, `승률: ${winRate}%`] };
  };

  // 🧬 투자자 타입 결정 (DNA 조합 기반)
  const determineInvestorType = (primaryDNA, secondaryDNA, conceptLevel) => {
    const dnaKey = `${primaryDNA}_${secondaryDNA}`;
    
    const investorTypes = {
      '🎯 집중형_⚡ 액션형': {
        type: '🚀 메가트렌드 헌터',
        description: '새로운 메가트렌드를 발굴하고 집중 투자하는 전문가',
        strengths: ['트렌드 포착 능력', '집중력', '실행력'],
        idealStrategy: 'AI, 바이오테크 등 테마 집중 투자'
      },
      '🎯 집중형_🔍 분석형': {
        type: '🎯 정밀 스나이퍼',
        description: '철저한 분석을 바탕으로 확신 있는 종목에 집중하는 투자자',
        strengths: ['분석력', '집중력', '인내심'],
        idealStrategy: '가치투자 + 성장투자 조합'
      },
      '⚡ 액션형_🌊 파도타기형': {
        type: '🌊 마켓 서퍼',
        description: '시장 변동성을 타고 수익을 만들어내는 스윙 전문가',
        strengths: ['타이밍 감각', '민첩성', '적응력'],
        idealStrategy: '스윙 트레이딩 + 모멘텀 투자'
      },
      '🔍 분석형_🛡️ 안전형': {
        type: '🛡️ 방어형 전략가',
        description: '안정성을 바탕으로 꾸준한 수익을 추구하는 투자자',
        strengths: ['리스크 관리', '분석력', '안정성'],
        idealStrategy: '배당주 + 우량주 장기 투자'
      },
      '💡 직감형_🎲 모험형': {
        type: '🎲 비전 투자자',
        description: '직감과 모험 정신으로 큰 기회를 포착하는 투자자',
        strengths: ['직관력', '도전 정신', '기회 포착'],
        idealStrategy: '신흥 테마 + 성장주 공격 투자'
      }
    };
    
    // 매칭되는 타입 찾기
    let matchedType = investorTypes[dnaKey];
    
    if (!matchedType) {
      // 주요 DNA만으로 매칭 시도
      const primaryMatches = Object.keys(investorTypes).filter(key => key.startsWith(primaryDNA));
      if (primaryMatches.length > 0) {
        matchedType = investorTypes[primaryMatches[0]];
      }
    }
    
    // 기본 타입 설정
    if (!matchedType) {
      matchedType = {
        type: '🌱 성장형 투자자',
        description: '다양한 스타일을 경험하며 성장하는 투자자',
        strengths: ['학습 능력', '적응력', '성장 잠재력'],
        idealStrategy: '분산 투자 + 스타일 실험'
      };
    }
    
    return matchedType;
  };

  // 🛣️ 맞춤형 성장 로드맵 생성
  const generateGrowthRoadmap = (investorType, dnaTraits, conceptualizationAnalysis) => {
    const roadmap = {
      shortTerm: [], // 1-3개월
      mediumTerm: [], // 3-12개월
      longTerm: [] // 1년 이상
    };
    
    // 투자자 타입별 로드맵
    switch(investorType.type) {
      case '🚀 메가트렌드 헌터':
        roadmap.shortTerm = [
          '🔍 다음 메가트렌드 후보 리서치 (양자컴퓨팅, 우주경제)',
          '📊 현재 AI 포지션 최적화',
          '📈 섹터 로테이션 타이밍 모니터링'
        ];
        roadmap.mediumTerm = [
          '🧬 바이오테크 섹터 심층 분석',
          '🌌 우주경제 관련 기업 발굴',
          '🎯 포트폴리오 다각화 (3-4개 메가트렌드)'
        ];
        roadmap.longTerm = [
          '🌍 글로벌 메가트렌드 전문가 되기',
          '📚 투자 철학 체계화 및 공유',
          '🎓 전문 자격증 취득 (CFA, FRM 등)'
        ];
        break;
        
      case '🌊 마켓 서퍼':
        roadmap.shortTerm = [
          '📊 기술적 분석 스킬 향상',
          '⏰ 멀티 타임프레임 전략 개발',
          '🔔 알림 시스템 구축'
        ];
        roadmap.mediumTerm = [
          '🤖 알고리즘 트레이딩 학습',
          '📈 변동성 예측 모델 구축',
          '💰 자금 관리 시스템 고도화'
        ];
        roadmap.longTerm = [
          '🏆 프로 트레이더 수준 달성',
          '📊 독자적 트레이딩 시스템 개발',
          '💼 헤지펀드 진출 고려'
        ];
        break;
        
      default:
        roadmap.shortTerm = [
          '📚 투자 기본서 학습',
          '💡 다양한 전략 실험',
          '📝 투자 일지 작성'
        ];
        roadmap.mediumTerm = [
          '🎯 자신만의 투자 스타일 확립',
          '📊 포트폴리오 최적화',
          '🔍 전문 분야 선택'
        ];
        roadmap.longTerm = [
          '🏆 투자 전문가 되기',
          '💰 안정적 수익 창출',
          '🎓 지속적 학습과 발전'
        ];
    }
    
    return roadmap;
  };

  // 🤝 호환 가능한 투자 스타일 추천
  const getCompatibleInvestmentStyles = (primaryDNA, secondaryDNA) => {
    const styleRecommendations = {
      '🎯 집중형': [
        { name: '테마 투자', compatibility: 95, reason: '집중력을 활용한 테마 발굴' },
        { name: '가치 투자', compatibility: 85, reason: '깊은 분석과 확신 필요' },
        { name: '성장 투자', compatibility: 80, reason: '장기 집중 투자에 적합' }
      ],
      '⚡ 액션형': [
        { name: '스윙 트레이딩', compatibility: 95, reason: '민첩한 매매 타이밍 활용' },
        { name: '모멘텀 투자', compatibility: 90, reason: '빠른 기회 포착 능력' },
        { name: '섹터 로테이션', compatibility: 85, reason: '시장 변화에 민감한 대응' }
      ],
      '🔍 분석형': [
        { name: '가치 투자', compatibility: 95, reason: '체계적 분석 능력 활용' },
        { name: '퀀트 투자', compatibility: 90, reason: '정량적 분석 선호' },
        { name: '펀더멘털 분석', compatibility: 85, reason: '기업 분석 역량' }
      ]
    };
    
    const primaryStyles = styleRecommendations[primaryDNA] || [];
    const secondaryStyles = styleRecommendations[secondaryDNA] || [];
    
    // 중복 제거 및 호환성 점수 통합
    const allStyles = [...primaryStyles];
    secondaryStyles.forEach(style => {
      const existing = allStyles.find(s => s.name === style.name);
      if (existing) {
        existing.compatibility = Math.max(existing.compatibility, style.compatibility);
      } else {
        allStyles.push({...style, compatibility: style.compatibility * 0.8});
      }
    });
    
    return allStyles.sort((a, b) => b.compatibility - a.compatibility).slice(0, 5);
  };

  // 💡 개인화된 인사이트 생성
  const generatePersonalizedInsights = (investorType, results) => {
    const insights = [];
    
    // 타입별 특별 인사이트
    switch(investorType.type) {
      case '🚀 메가트렌드 헌터':
        insights.push({
          title: '🎯 트렌드 포착 능력',
          content: 'AI 붐을 성공적으로 포착한 것처럼, 다음 메가트렌드도 조기에 발견할 가능성이 높습니다.',
          actionable: '바이오테크, 우주경제, 양자컴퓨팅 분야 모니터링을 시작하세요.'
        });
        break;
        
      case '🌊 마켓 서퍼':
        insights.push({
          title: '🌊 타이밍 마스터',
          content: '변동성을 수익으로 전환하는 능력이 뛰어납니다. 이는 매우 희귀한 재능입니다.',
          actionable: '이 능력을 더욱 체계화하여 프로 수준으로 발전시켜보세요.'
        });
        break;
        
      default:
        insights.push({
          title: '🌱 성장 잠재력',
          content: '현재 성과는 앞으로의 성장 가능성을 보여주는 시작일 뿐입니다.',
          actionable: '지속적인 학습과 실험을 통해 더 큰 성과를 기대할 수 있습니다.'
        });
    }
    
    return insights;
  };

  // 벤치마크 수익률 계산
  const calculateBenchmarkReturn = (months) => {
    const monthlyReturns = [
      0, -2.4, 3.5, 1.5, 0.4, 6.5, 3.1, -1.8, -4.9, -2.1, 8.9, 4.4,
      1.6, 5.3, 3.1, -4.2, 4.8, 3.5, 1.1, -6.0, -9.3, -0.8, 5.4, 5.7
    ];
    
    let cumulativeReturn = 1;
    for (let i = 0; i < months && i < monthlyReturns.length; i++) {
      cumulativeReturn *= (1 + monthlyReturns[i] / 100);
    }
    return (cumulativeReturn - 1) * 100;
  };

  // 거래 이력 분석
  const analyzeTradeHistory = (transactions) => {
    const trades = transactions.filter(t => 
      typeof t === 'string' && (t.includes('매수') || t.includes('매도'))
    );
    
    const buyTrades = trades.filter(t => t.includes('매수'));
    const sellTrades = trades.filter(t => t.includes('매도'));
    const profitTrades = trades.filter(t => t.includes('손익: +'));
    const lossTrades = trades.filter(t => t.includes('손익: -'));
    
    const winRate = sellTrades.length > 0 ? 
      ((profitTrades.length / sellTrades.length) * 100).toFixed(1) : 0;
    
    // 가장 많이 거래한 종목
    const stockPerformance = {};
    trades.forEach(trade => {
      const match = trade.match(/([A-Z]+)\s+\d+주/);
      if (match) {
        const symbol = match[1];
        stockPerformance[symbol] = (stockPerformance[symbol] || 0) + 1;
      }
    });
    
    const mostTradedStock = Object.keys(stockPerformance).reduce((a, b) => 
      stockPerformance[a] > stockPerformance[b] ? a : b, 'NVDA'
    );
    
    return {
      totalTrades: trades.length,
      buyTrades: buyTrades.length,
      sellTrades: sellTrades.length,
      winRate: parseFloat(winRate),
      profitTrades: profitTrades.length,
      lossTrades: lossTrades.length,
      mostTradedStock,
      tradingFrequency: trades.length / 24
    };
  };

  // 리스크 지표 계산
  const calculateRiskMetrics = (results) => {
    const returnPercentage = ((results.totalAssets - results.initialAmount) / results.initialAmount) * 100;
    const estimatedVolatility = Math.abs(returnPercentage * 0.3);
    const sharpeRatio = returnPercentage / Math.max(estimatedVolatility, 1);
    
    return {
      volatility: estimatedVolatility.toFixed(1),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: "5.0", // 간소화
      riskLevel: getRiskLevel(estimatedVolatility)
    };
  };

  // 리스크 레벨 분류
  const getRiskLevel = (volatility) => {
    if (volatility < 10) return { level: '낮음', color: '#28a745', emoji: '🛡️' };
    if (volatility < 25) return { level: '보통', color: '#ffc107', emoji: '⚖️' };
    return { level: '높음', color: '#dc3545', emoji: '🔥' };
  };

  // 투자 등급 계산
  const calculateInvestmentGrade = (returnPercentage, sharpeRatio) => {
    const sharpe = parseFloat(sharpeRatio);
    
    if (returnPercentage >= 200 && sharpe >= 2.0) {
      return {
        grade: "💎 투자 마스터",
        description: "전설적인 투자 실력! 워렌 버핏급 성과입니다.",
        color: "#FFD700",
        emoji: "👑",
        score: 95
      };
    } else if (returnPercentage >= 100 && sharpe >= 1.5) {
      return {
        grade: "🥇 투자 고수",
        description: "뛰어난 투자 감각! 전문가 수준입니다.",
        color: "#C0C0C0", 
        emoji: "🚀",
        score: 85
      };
    } else if (returnPercentage >= 50 && sharpe >= 1.0) {
      return {
        grade: "🥈 투자 중급자",
        description: "훌륭한 성과! 꾸준히 실력을 쌓고 있습니다.",
        color: "#CD7F32",
        emoji: "📈",
        score: 75
      };
    } else if (returnPercentage >= 20) {
      return {
        grade: "🥉 투자 초보자", 
        description: "괜찮은 시작! 경험을 쌓아가고 있습니다.",
        color: "#87CEEB",
        emoji: "📊",
        score: 65
      };
    } else if (returnPercentage >= 0) {
      return {
        grade: "🔰 투자 입문자",
        description: "안전한 투자! 손실 없이 경험을 쌓았습니다.",
        color: "#90EE90", 
        emoji: "🛡️",
        score: 55
      };
    } else {
      return {
        grade: "📉 재고 필요",
        description: "투자 전략을 다시 검토해보세요. 학습이 필요합니다.",
        color: "#FF6B6B",
        emoji: "📚",
        score: 40
      };
    }
  };

  // 강점/약점 분석
  const analyzeStrengthsWeaknesses = (results, tradeAnalysis) => {
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];
    
    if (tradeAnalysis.winRate >= 70) {
      strengths.push("✅ 높은 매매 승률 (" + tradeAnalysis.winRate + "%)");
    }
    if (tradeAnalysis.tradingFrequency < 2) {
      strengths.push("✅ 적절한 거래 빈도 (과도한 매매 없음)");
    }
    if (results.totalAssets > results.initialAmount * 1.5) {
      strengths.push("✅ 우수한 수익률 달성");
    }
    
    if (tradeAnalysis.winRate < 50) {
      weaknesses.push("⚠️ 낮은 매매 승률 (" + tradeAnalysis.winRate + "%)");
      recommendations.push("💡 손절 타이밍과 종목 선택 기준 재검토 필요");
    }

    return { strengths, weaknesses, recommendations };
  };

  // 업적 생성
  const generateAchievements = (results, tradeAnalysis) => {
    const achievements = [];
    
    if (results.totalAssets >= results.initialAmount * 2) {
      achievements.push({
        icon: "🎯",
        title: "첫 100% 달성",
        description: "투자금을 2배로 불렸습니다!",
        date: "2024-06"
      });
    }
    
    if (tradeAnalysis.mostTradedStock === 'NVDA' && tradeAnalysis.winRate > 70) {
      achievements.push({
        icon: "🤖",
        title: "AI 붐 마스터", 
        description: "NVIDIA 투자 전문가입니다!",
        date: "2024-05"
      });
    }
    
    return achievements;
  };

  // 성과 개요 렌더링
  const renderOverview = () => {
    if (!reportData) return null;
    
    const { overview } = reportData;
    
    return (
      <View style={styles.overviewCard}>
        <Text style={styles.cardTitle}>📊 투자 성과 개요</Text>
        
        <View style={styles.gradeSection}>
          <Text style={styles.gradeEmoji}>{overview.grade.emoji}</Text>
          <Text style={styles.gradeTitle}>{overview.grade.grade}</Text>
          <Text style={styles.gradeDescription}>{overview.grade.description}</Text>
          <View style={styles.scoreBar}>
            <View style={[
              styles.scoreProgress, 
              { width: `${overview.grade.score}%`, backgroundColor: overview.grade.color }
            ]} />
          </View>
          <Text style={styles.scoreText}>{overview.grade.score}/100점</Text>
        </View>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {overview.returnPercentage >= 0 ? '+' : ''}{overview.returnPercentage.toFixed(1)}%
            </Text>
            <Text style={styles.metricLabel}>총 수익률</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {overview.outperformance >= 0 ? '+' : ''}{overview.outperformance.toFixed(1)}%
            </Text>
            <Text style={styles.metricLabel}>벤치마크 대비</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              ${overview.totalReturn.toLocaleString()}
            </Text>
            <Text style={styles.metricLabel}>순수익</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {overview.period}
            </Text>
            <Text style={styles.metricLabel}>투자 기간</Text>
          </View>
        </View>
      </View>
    );
  };

  // 🧠 개념화 분석 렌더링 (핵심!)
  const renderConceptualizationAnalysis = () => {
    if (!reportData || !reportData.conceptualizationAnalysis) return null;
    
    const { conceptualizationAnalysis } = reportData;
    
    return (
      <View style={styles.analysisCard}>
        <Text style={styles.cardTitle}>🧠 투자 사고력 분석</Text>
        
        {/* 개념화 레벨 표시 */}
        <View style={styles.conceptLevelSection}>
          <Text style={styles.conceptLevel}>{conceptualizationAnalysis.level}</Text>
          <Text style={styles.conceptDescription}>
            {conceptualizationAnalysis.description}
          </Text>
          
          <View style={styles.scoreBar}>
            <View style={[
              styles.scoreProgress,
              { width: `${Math.min(conceptualizationAnalysis.score * 1.5, 100)}%`, backgroundColor: '#007AFF' }
            ]} />
          </View>
          <Text style={styles.scoreText}>
            개념화 점수: {conceptualizationAnalysis.score}/70
          </Text>
        </View>
        
        {/* 상세 인사이트 */}
        {conceptualizationAnalysis.insights.length > 0 && (
          <View style={styles.insightsSection}>
            <Text style={styles.sectionSubtitle}>💡 발견된 고급 사고 패턴:</Text>
            {conceptualizationAnalysis.insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <Text style={styles.insightCategory}>{insight.category}</Text>
                <Text style={styles.insightComment}>{insight.comment}</Text>
                <View style={styles.evidenceSection}>
                  <Text style={styles.evidenceLabel}>근거:</Text>
                  {insight.evidence.map((evidence, idx) => (
                    <Text key={idx} style={styles.evidenceText}>• {evidence}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
        
        {/* 추천사항 */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionSubtitle}>🚀 다음 단계 제안:</Text>
          {conceptualizationAnalysis.recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendationText}>{rec}</Text>
          ))}
        </View>
      </View>
    );
  };

  // 🧬 DNA 분석 렌더링 (완전판!)
  const renderInvestmentDNAAnalysis = () => {
    if (!reportData || !reportData.investmentDNAAnalysis) return null;
    
    const { investmentDNAAnalysis } = reportData;
    
    return (
      <View style={styles.analysisCard}>
        <Text style={styles.cardTitle}>🧬 투자 DNA 분석</Text>
        
        {/* 투자자 타입 표시 */}
        <View style={styles.investorTypeSection}>
          <Text style={styles.investorTypeTitle}>{investmentDNAAnalysis.investorType.type}</Text>
          <Text style={styles.investorTypeDescription}>
            {investmentDNAAnalysis.investorType.description}
          </Text>
          
          <View style={styles.strengthsContainer}>
            <Text style={styles.strengthsTitle}>💪 핵심 강점:</Text>
            <View style={styles.strengthsRow}>
              {investmentDNAAnalysis.investorType.strengths.map((strength, index) => (
                <View key={index} style={styles.strengthTag}>
                  <Text style={styles.strengthText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.idealStrategyContainer}>
            <Text style={styles.idealStrategyTitle}>🎯 최적 전략:</Text>
            <Text style={styles.idealStrategyText}>{investmentDNAAnalysis.investorType.idealStrategy}</Text>
          </View>
        </View>
        
        {/* DNA 특성 분석 */}
        <View style={styles.dnaTraitsSection}>
          <Text style={styles.sectionSubtitle}>🧬 DNA 특성 분석:</Text>
          
          <View style={styles.dnaTraitsGrid}>
            <View style={styles.dnaPrimaryCard}>
              <Text style={styles.dnaLabel}>주요 DNA</Text>
              <Text style={styles.dnaPrimary}>{investmentDNAAnalysis.primaryDNA}</Text>
            </View>
            <View style={styles.dnaSecondaryCard}>
              <Text style={styles.dnaLabel}>보조 DNA</Text>
              <Text style={styles.dnaSecondary}>{investmentDNAAnalysis.secondaryDNA}</Text>
            </View>
          </View>
          
          {/* 상위 3개 특성 상세 표시 */}
          {investmentDNAAnalysis.dnaTraits.slice(0, 3).map((trait, index) => (
            <View key={index} style={styles.traitCard}>
              <View style={styles.traitHeader}>
                <Text style={styles.traitType}>{trait.type}</Text>
                <Text style={styles.traitScore}>{trait.score}점</Text>
              </View>
              <Text style={styles.traitInsight}>{trait.insight}</Text>
              <Text style={styles.traitRecommendation}>💡 {trait.recommendation}</Text>
            </View>
          ))}
        </View>
        
        {/* 성장 로드맵 */}
        <View style={styles.roadmapSection}>
          <Text style={styles.sectionSubtitle}>🛣️ 맞춤형 성장 로드맵:</Text>
          
          <View style={styles.roadmapStage}>
            <Text style={styles.roadmapStageTitle}>🎯 단기 (1-3개월)</Text>
            {investmentDNAAnalysis.growthRoadmap.shortTerm.map((item, index) => (
              <Text key={index} style={styles.roadmapItem}>• {item}</Text>
            ))}
          </View>
          
          <View style={styles.roadmapStage}>
            <Text style={styles.roadmapStageTitle}>📈 중기 (3-12개월)</Text>
            {investmentDNAAnalysis.growthRoadmap.mediumTerm.map((item, index) => (
              <Text key={index} style={styles.roadmapItem}>• {item}</Text>
            ))}
          </View>
          
          <View style={styles.roadmapStage}>
            <Text style={styles.roadmapStageTitle}>🚀 장기 (1년 이상)</Text>
            {investmentDNAAnalysis.growthRoadmap.longTerm.map((item, index) => (
              <Text key={index} style={styles.roadmapItem}>• {item}</Text>
            ))}
          </View>
        </View>
        
        {/* 호환 투자 스타일 */}
        <View style={styles.compatibleStylesSection}>
          <Text style={styles.sectionSubtitle}>🤝 추천 투자 스타일:</Text>
          {investmentDNAAnalysis.compatibleStyles.slice(0, 3).map((style, index) => (
            <View key={index} style={styles.styleCard}>
              <View style={styles.styleHeader}>
                <Text style={styles.styleName}>{style.name}</Text>
                <Text style={styles.styleCompatibility}>{style.compatibility}% 적합</Text>
              </View>
              <Text style={styles.styleReason}>{style.reason}</Text>
            </View>
          ))}
        </View>
        
        {/* 개인화된 인사이트 */}
        {investmentDNAAnalysis.personalizedInsights.length > 0 && (
          <View style={styles.personalInsightsSection}>
            <Text style={styles.sectionSubtitle}>💡 개인화된 인사이트:</Text>
            {investmentDNAAnalysis.personalizedInsights.map((insight, index) => (
              <View key={index} style={styles.personalInsightCard}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightContent}>{insight.content}</Text>
                <Text style={styles.insightActionable}>🚀 {insight.actionable}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // 거래 분석 렌더링
  const renderTradeAnalysis = () => {
    if (!reportData) return null;
    
    const { tradeAnalysis } = reportData;
    
    return (
      <View style={styles.analysisCard}>
        <Text style={styles.cardTitle}>📈 거래 분석</Text>
        
        <View style={styles.tradeStats}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>총 거래 횟수</Text>
            <Text style={styles.statValue}>{tradeAnalysis.totalTrades}건</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>매매 승률</Text>
            <Text style={[
              styles.statValue,
              { color: tradeAnalysis.winRate >= 60 ? '#28a745' : '#dc3545' }
            ]}>
              {tradeAnalysis.winRate}%
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>주력 종목</Text>
            <Text style={styles.statValue}>{tradeAnalysis.mostTradedStock}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!reportData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.title}>📊 투자 성적표</Text>
          <View style={{ width: 50 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>성적표를 생성하고 있습니다...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📊 투자 성적표</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            '📤 성적표 공유', 
            '성적표를 저장하거나 공유하시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { text: '💾 저장', onPress: () => console.log('성적표 저장') },
              { text: '📤 공유', onPress: () => console.log('성적표 공유') }
            ]
          );
        }}>
          <Text style={styles.shareButton}>공유</Text>
        </TouchableOpacity>
      </View>

      {/* 스크롤 콘텐츠 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* {renderOverview()} */}                   {/* 👈 이것도 주석처리 */}
        {/* {renderConceptualizationAnalysis()} */}  {/* 👈 이미 주석처리됨 */}
        {/* {renderInvestmentDNAAnalysis()} */}      {/* 👈 이미 주석처리됨 */}
        {/* {renderTradeAnalysis()} */}             {/* 👈 이미 주석처리됨 */}
  
        {/* 테스트용 간단한 내용 */}
        <Text style={{fontSize: 24, textAlign: 'center', margin: 20}}>
          🎉 성적표 테스트
        </Text>
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          수익률: 914%
        </Text>
  
        {/* 하단 여백 */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  gradeSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gradeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  gradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gradeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // 🧠 개념화 분석 스타일
  conceptLevelSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
  },
  conceptLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  conceptDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightsSection: {
    marginTop: 15,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  insightCategory: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  insightComment: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 8,
  },
  evidenceSection: {
    marginTop: 8,
  },
  evidenceLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  evidenceText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 8,
    marginBottom: 2,
  },
  recommendationsSection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 6,
    lineHeight: 18,
  },
  // 🧬 DNA 분석 전용 스타일
  investorTypeSection: {
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  investorTypeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  investorTypeDescription: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  strengthsContainer: {
    marginBottom: 12,
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  strengthsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  strengthTag: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  idealStrategyContainer: {
    marginTop: 12,
  },
  idealStrategyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  idealStrategyText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  dnaTraitsSection: {
    marginBottom: 20,
  },
  dnaTraitsGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dnaPrimaryCard: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  dnaSecondaryCard: {
    flex: 1,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 12,
    marginLeft: 8,
    alignItems: 'center',
  },
  dnaLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  dnaPrimary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  dnaSecondary: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  traitCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  traitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  traitType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  traitScore: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  traitInsight: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 6,
  },
  traitRecommendation: {
    fontSize: 11,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  roadmapSection: {
    marginBottom: 20,
  },
  roadmapStage: {
    marginBottom: 12,
  },
  roadmapStageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  roadmapItem: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginLeft: 8,
  },
  compatibleStylesSection: {
    marginBottom: 15,
  },
  styleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  styleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  styleName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  styleCompatibility: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#28a745',
  },
  styleReason: {
    fontSize: 11,
    color: '#666',
  },
  personalInsightsSection: {
    marginBottom: 10,
  },
  personalInsightCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 6,
  },
  insightContent: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 6,
  },
  insightActionable: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
  },
  tradeStats: {
    marginTop: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
