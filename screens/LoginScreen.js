// screens/LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { loginUser } = useUser();
  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';

  const handleLogin = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert('로그인 오류', '사용자 이름/이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    console.log('🚀 API 호출 시작:', `${FLASK_API_BASE_URL}/api/login`);

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
          userId: response.data.user.id,       // ✅ 1
          username: response.data.user.username, // ✅ "testuser"
          email: response.data.user.email,       // ✅ "test@example.com"
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
  };

  return (
    <View style={styles.container}>
      {/* 로고 추가 */}
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
      />

      <Text style={styles.title}>투자 코치 📈</Text>
      <Text style={styles.subtitle}>AI와 함께하는 스마트 투자</Text>

      {/* 개발용 빠른 로그인 버튼 */}
      <TouchableOpacity style={[styles.button, styles.quickLoginButton]} onPress={quickLogin}>
        <Text style={styles.buttonText}>테스트 계정으로 빠른 로그인</Text>
      </TouchableOpacity>

      {/* 서버 연결 테스트 버튼 */}
      <TouchableOpacity style={[styles.button, styles.testButton]} onPress={testServerConnection}>
        <Text style={styles.buttonText}>서버 연결 테스트</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="사용자 이름 또는 이메일"
        value={usernameOrEmail}
        onChangeText={setUsernameOrEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.linkText}>계정이 없으신가요? 회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
    logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  quickLoginButton: {
    backgroundColor: '#6f42c1',
    marginBottom: 10,
  },
  testButton: {
    backgroundColor: '#28a745',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#007bff',
    marginTop: 15,
    fontSize: 14,
  },
});

export default LoginScreen;
