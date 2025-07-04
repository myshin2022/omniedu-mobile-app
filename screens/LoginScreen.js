// screens/LoginScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const { loginUser } = useUser();
  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';
  
  const scrollViewRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        console.log('⌨️ 키보드 올라옴:', e.endCoordinates.height);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('⌨️ 키보드 내려감');
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // 입력 필드 포커스 시 스크롤
  const handleInputFocus = (inputRef, fieldName) => {
    console.log(`🔍 ${fieldName} 입력 포커스`);
    setTimeout(() => {
      if (inputRef.current && scrollViewRef.current) {
        inputRef.current.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x, y) => {
            scrollViewRef.current.scrollTo({
              y: y - 150, // 입력 필드 위에 충분한 여백 확보
              animated: true,
            });
          }
        );
      }
    }, 100);
  };

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert('로그인 오류', '사용자 이름/이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log('🚀 API 호출 시작:', `${FLASK_API_BASE_URL}/api/login`);
    Keyboard.dismiss(); // 로그인 시 키보드 숨기기

    try {
      const response = await axios.post(`${FLASK_API_BASE_URL}/api/login`, {
        username_or_email: usernameOrEmail,
        password: password,
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('✅ API 응답 성공:', response.data);

      if (response.data.success) {
        console.log('🎉 Login successful:', response.data);

        // 🆕 UserContext에 사용자 정보 저장
        const userInfo = {
          userId: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
        };

        await loginUser(userInfo);

        // 메인 대시보드로 이동
        console.log('📱 네비게이션 호출 전...');
        navigation.navigate('MainDashboard', { userInfo });
        console.log('📱 네비게이션 호출 완료!');

        Alert.alert('로그인 성공', response.data.message);
      } else {
        Alert.alert('로그인 실패', response.data.message || '알 수 없는 오류가 발생했습니다.');
        console.log('❌ Login failed:', response.data);
      }
    } catch (error) {
      console.log('🔥 전체 에러 객체:', error);

      let errorMessage = '네트워크 오류 또는 서버에 연결할 수 없습니다.';

      if (error.response) {
        console.log('📡 서버 응답 에러:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        errorMessage = error.response.data?.message || `서버 오류: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        console.log('📡 네트워크 요청 에러:', error.request);
        errorMessage = '서버로부터 응답이 없습니다. 서버가 실행 중인지, 네트워크 연결을 확인하세요.';
      } else {
        console.log('⚙️ 요청 설정 에러:', error.message);
        errorMessage = '요청 설정 중 오류가 발생했습니다: ' + error.message;
      }

      if (error.code === 'NETWORK_ERROR') {
        errorMessage = '네트워크 연결 오류: WiFi 연결을 확인하세요.';
      } else if (error.code === 'TIMEOUT') {
        errorMessage = '요청 시간 초과: 서버 응답이 너무 느립니다.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'CORS 또는 네트워크 오류: 서버 설정을 확인하세요.';
      }

      Alert.alert('로그인 오류', errorMessage);
      console.error('❌ Login API error:', error);
    }
  };

  const navigateToRegister = () => {
    console.log('Navigate to Register Screen');
    navigation.navigate('Register');
  };

  // 서버 연결 테스트 함수
  const testServerConnection = async () => {
    try {
      console.log('🔍 서버 연결 테스트 시작...');
      const response = await axios.get(`${FLASK_API_BASE_URL}/`, { timeout: 5000 });
      console.log('✅ 서버 연결 성공:', response.status);
      Alert.alert('연결 테스트', '서버 연결 성공!');
    } catch (error) {
      console.log('❌ 서버 연결 실패:', error.message);
      Alert.alert('연결 테스트', `서버 연결 실패: ${error.message}`);
    }
  };

  // 테스트용 자동 로그인 (개발 중에만 사용)
  const quickLogin = () => {
    setUsernameOrEmail('testuser');
    setPassword('password');
    Alert.alert('테스트 계정', '테스트 계정 정보가 입력되었습니다. 로그인 버튼을 누르세요.');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: Math.max(keyboardHeight, 50) + 100 } // 키보드 높이에 따른 동적 패딩
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          keyboardDismissMode="interactive"
        >
          <View style={styles.content}>
            {/* 로고 및 헤더 */}
            <View style={styles.header}>
              <Image
                source={require('../assets/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.title}>투자 코치 📈</Text>
              <Text style={styles.subtitle}>AI와 함께하는 스마트 투자</Text>
            </View>

            {/* Apple 심사용 테스트 버튼들 */}
            <View style={styles.testButtonsContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.quickLoginButton]} 
                onPress={quickLogin}
              >
                <Text style={styles.buttonText}>🚀 테스트 계정으로 빠른 로그인</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.testButton]} 
                onPress={testServerConnection}
              >
                <Text style={styles.buttonText}>🔍 서버 연결 테스트</Text>
              </TouchableOpacity>
            </View>

            {/* 로그인 폼 */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>사용자명 또는 이메일</Text>
                <TextInput
                  ref={usernameRef}
                  style={[styles.input, usernameOrEmail ? styles.inputFilled : null]}
                  placeholder="testuser 또는 이메일 주소"
                  value={usernameOrEmail}
                  onChangeText={setUsernameOrEmail}
                  onFocus={() => handleInputFocus(usernameRef, '사용자명')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, styles.passwordInput, password ? styles.inputFilled : null]}
                  placeholder="password (테스트용)"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => handleInputFocus(passwordRef, '비밀번호')}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>

              {/* 로그인 버튼 */}
              <TouchableOpacity 
                style={[
                  styles.button, 
                  styles.loginButton,
                  (!usernameOrEmail || !password) && styles.buttonDisabled
                ]} 
                onPress={handleLogin}
                disabled={!usernameOrEmail || !password}
              >
                <Text style={styles.buttonText}>🔑 로그인</Text>
              </TouchableOpacity>
            </View>

            {/* 회원가입 링크 */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>계정이 없으신가요? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.linkText}>회원가입</Text>
              </TouchableOpacity>
            </View>

            {/* 키보드 높이만큼 추가 여백 */}
            <View style={{ height: keyboardHeight }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: Dimensions.get('window').height,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  testButtonsContainer: {
    marginBottom: 30,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
    minHeight: 52,
  },
  inputFilled: {
    borderColor: '#3498db',
    backgroundColor: '#f8f9ff',
  },
  passwordInput: {
    borderColor: '#e74c3c', // 비밀번호 필드 강조
    backgroundColor: '#fff5f5',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 18,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  quickLoginButton: {
    backgroundColor: '#9b59b6',
  },
  testButton: {
    backgroundColor: '#3498db',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 50,
  },
  registerText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  linkText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;