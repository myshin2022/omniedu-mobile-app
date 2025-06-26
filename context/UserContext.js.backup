// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('isPremium');
      const count = await AsyncStorage.getItem('simulationCount');
      const resetDate = await AsyncStorage.getItem('lastResetDate');
      
      setIsPremium(premiumStatus === 'true');
      
      // 월별 리셋 체크
      const today = new Date().toDateString();
      const currentMonth = new Date().getMonth();
      const storedMonth = resetDate ? new Date(resetDate).getMonth() : currentMonth;
      
      if (currentMonth !== storedMonth) {
        // 새로운 달이면 카운트 리셋
        console.log('🔄 새로운 달 - 시뮬레이션 카운트 리셋');
        setSimulationCount(0);
        await AsyncStorage.setItem('simulationCount', '0');
        await AsyncStorage.setItem('lastResetDate', today);
      } else {
        setSimulationCount(parseInt(count) || 0);
      }
      
      console.log('📊 사용자 데이터 로드:', {
        isPremium: premiumStatus === 'true',
        simulationCount: parseInt(count) || 0,
        resetDate
      });
      
    } catch (error) {
      console.log('❌ 사용자 데이터 로드 에러:', error);
    }
  };

  const incrementSimulationCount = async () => {
    const newCount = simulationCount + 1;
    setSimulationCount(newCount);
    await AsyncStorage.setItem('simulationCount', newCount.toString());
    console.log('📈 시뮬레이션 카운트 증가:', newCount);
  };

  const purchasePremium = async () => {
    setIsPremium(true);
    await AsyncStorage.setItem('isPremium', 'true');
    console.log('✨ 프리미엄 업그레이드 완료');
  };

  const canUseSimulation = () => {
    const canUse = isPremium || simulationCount < 5; // 무료: 월 5회 제한
    console.log('🎮 시뮬레이션 사용 가능:', canUse, {
      isPremium,
      simulationCount,
      limit: 5
    });
    return canUse;
  };

  // 디버깅용: 데이터 리셋 함수
  const resetUserData = async () => {
    await AsyncStorage.removeItem('isPremium');
    await AsyncStorage.removeItem('simulationCount');
    await AsyncStorage.removeItem('lastResetDate');
    setIsPremium(false);
    setSimulationCount(0);
    console.log('🔄 사용자 데이터 리셋 완료');
  };

  return (
    <UserContext.Provider value={{
      isPremium,
      simulationCount,
      canUseSimulation,
      incrementSimulationCount,
      purchasePremium,
      loadUserData,
      resetUserData, // 개발 중에만 사용
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
