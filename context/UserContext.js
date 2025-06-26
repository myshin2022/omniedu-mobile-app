// context/UserContext.js - 로그인 시스템과 연동된 개선 버전
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 사용자 정보 상태
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 구독 관련 상태
  const [isPremium, setIsPremium] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  useEffect(() => {
    // 앱 시작 시 저장된 사용자 정보 로드
    loadStoredUserData();
  }, []);

  useEffect(() => {
    // 사용자가 변경될 때마다 해당 사용자의 구독 정보 로드
    if (user?.userId) {
      loadUserSubscriptionData();
    }
  }, [user]);

  // 저장된 사용자 정보 로드
  const loadStoredUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
        console.log('💾 저장된 사용자 정보 로드:', userData);
      }
    } catch (error) {
      console.log('❌ 사용자 정보 로드 에러:', error);
    }
  };

  // 사용자별 구독 정보 로드
  const loadUserSubscriptionData = async () => {
    if (!user?.userId) return;

    try {
      // 사용자별 키 생성
      const premiumKey = `isPremium_${user.userId}`;
      const countKey = `simulationCount_${user.userId}`;
      const resetKey = `lastResetDate_${user.userId}`;

      const premiumStatus = await AsyncStorage.getItem(premiumKey);
      const count = await AsyncStorage.getItem(countKey);
      const resetDate = await AsyncStorage.getItem(resetKey);

      setIsPremium(premiumStatus === 'true');

      // 월별 리셋 체크
      const today = new Date().toDateString();
      const currentMonth = new Date().getMonth();
      const storedMonth = resetDate ? new Date(resetDate).getMonth() : currentMonth;

      if (currentMonth !== storedMonth) {
        // 새로운 달이면 카운트 리셋
        console.log('🔄 새로운 달 - 시뮬레이션 카운트 리셋 (사용자:', user.username, ')');
        setSimulationCount(0);
        await AsyncStorage.setItem(countKey, '0');
        await AsyncStorage.setItem(resetKey, today);
        setLastResetDate(today);
      } else {
        setSimulationCount(parseInt(count) || 0);
        setLastResetDate(resetDate || today);
      }

      console.log('📊 사용자별 구독 데이터 로드:', {
        userId: user.userId,
        username: user.username,
        isPremium: premiumStatus === 'true',
        simulationCount: parseInt(count) || 0,
        resetDate
      });

    } catch (error) {
      console.log('❌ 사용자 구독 데이터 로드 에러:', error);
    }
  };

  // 로그인 함수 (LoginScreen에서 호출)
  const loginUser = async (userInfo) => {
    try {
      setUser(userInfo);
      setIsLoggedIn(true);

      // 사용자 정보를 AsyncStorage에 저장
      await AsyncStorage.setItem('currentUser', JSON.stringify(userInfo));

      console.log('✅ 사용자 로그인 완료:', userInfo);

      // 해당 사용자의 구독 정보는 useEffect에서 자동 로드됨
    } catch (error) {
      console.log('❌ 로그인 에러:', error);
    }
  };

  // 로그아웃 함수
  const logoutUser = async () => {
    try {
      setUser(null);
      setIsLoggedIn(false);
      setIsPremium(false);
      setSimulationCount(0);

      // 저장된 사용자 정보 삭제
      await AsyncStorage.removeItem('currentUser');

      console.log('✅ 사용자 로그아웃 완료');
    } catch (error) {
      console.log('❌ 로그아웃 에러:', error);
    }
  };

  // 시뮬레이션 횟수 증가
  const incrementSimulationCount = async () => {
    if (!user?.userId) return;

    const newCount = simulationCount + 1;
    setSimulationCount(newCount);

    const countKey = `simulationCount_${user.userId}`;
    await AsyncStorage.setItem(countKey, newCount.toString());

    console.log('📈 시뮬레이션 카운트 증가:', {
      userId: user.userId,
      username: user.username,
      newCount
    });
  };

  // 프리미엄 업그레이드
  const purchasePremium = async () => {
    if (!user?.userId) return;

    setIsPremium(true);

    const premiumKey = `isPremium_${user.userId}`;
    await AsyncStorage.setItem(premiumKey, 'true');

    console.log('✨ 프리미엄 업그레이드 완료:', {
      userId: user.userId,
      username: user.username
    });
  };

  // 시뮬레이션 사용 가능 여부 확인
  const canUseSimulation = () => {
    const canUse = isPremium || simulationCount < 5; // 무료: 월 5회 제한

    console.log('🎮 시뮬레이션 사용 가능 여부:', {
      userId: user?.userId,
      username: user?.username,
      isPremium,
      simulationCount,
      limit: 5,
      canUse
    });

    return canUse;
  };

  // 사용자 구독 정보 새로고침
  const refreshUserData = async () => {
    if (user?.userId) {
      await loadUserSubscriptionData();
    }
  };

  // 디버깅용: 사용자 데이터 리셋
  const resetUserData = async () => {
    if (!user?.userId) return;

    const premiumKey = `isPremium_${user.userId}`;
    const countKey = `simulationCount_${user.userId}`;
    const resetKey = `lastResetDate_${user.userId}`;

    await AsyncStorage.removeItem(premiumKey);
    await AsyncStorage.removeItem(countKey);
    await AsyncStorage.removeItem(resetKey);

    setIsPremium(false);
    setSimulationCount(0);

    console.log('🔄 사용자 구독 데이터 리셋 완료:', user.username);
  };

  // 전체 앱 데이터 리셋 (개발용)
  const resetAllData = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    setIsPremium(false);
    setSimulationCount(0);
    console.log('🔄 전체 앱 데이터 리셋 완료');
  };

  // 기존 loadUserData 함수 (호환성 유지)
  const loadUserData = async () => {
    await loadStoredUserData();
  };

  return (
    <UserContext.Provider value={{
      // 사용자 정보
      user,
      isLoggedIn,
      loginUser,
      logoutUser,

      // 구독 관련
      isPremium,
      simulationCount,
      canUseSimulation,
      incrementSimulationCount,
      purchasePremium,
      refreshUserData,

      // 기존 호환성
      loadUserData,

      // 개발/디버깅용
      resetUserData,
      resetAllData,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};