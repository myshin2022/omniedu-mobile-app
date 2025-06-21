// screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);

  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';

  const handleRegister = async () => {
    // 입력 검증
    if (!formData.username || !formData.email || !formData.password) {
      Alert.alert('입력 오류', '사용자 이름, 이메일, 비밀번호는 필수입니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('비밀번호 오류', '비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('이메일 오류', '올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 회원가입 요청 중...');
      const response = await axios.post(`${FLASK_API_BASE_URL}/api/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName || null,
        last_name: formData.lastName || null,
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      console.log('✅ 회원가입 응답:', response.data);

      if (response.data.success) {
        Alert.alert(
          '회원가입 성공!', 
          '계정이 생성되었고 자동으로 로그인되었습니다.\n$100,000의 가상 자금으로 투자 시뮬레이션을 시작하세요!',
          [
            {
              text: '시작하기',
              onPress: () => {
                // 자동 로그인 후 메인 대시보드로 이동
                navigation.navigate('MainDashboard', {
                  userInfo: {
                    user_id: response.data.user_id,
                    username: response.data.username,
                    email: response.data.email,
                  }
                });
              }
            }
          ]
        );
      } else {
        Alert.alert('회원가입 실패', response.data.message || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      
      let errorMessage = '회원가입 중 오류가 발생했습니다.';
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || '입력 정보를 확인해주세요.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = '서버 연결에 실패했습니다. 네트워크를 확인해주세요.';
      }
      
      Alert.alert('회원가입 오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backButtonText}>← 로그인으로</Text>
        </TouchableOpacity>
      </View>

      {/* 타이틀 */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>투자 코치 가입 📈</Text>
        <Text style={styles.subtitle}>
          AI와 함께하는 스마트 투자 학습{'\n'}
          $100,000 가상 자금으로 시작하세요!
        </Text>
      </View>

      {/* 입력 폼 */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>필수 정보</Text>
        
        <TextInput
          style={styles.input}
          placeholder="사용자 이름 *"
          value={formData.username}
          onChangeText={(value) => updateFormData('username', value)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="이메일 주소 *"
          value={formData.email}
          onChangeText={(value) => updateFormData('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호 (6자 이상) *"
          value={formData.password}
          onChangeText={(value) => updateFormData('password', value)}
          secureTextEntry
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인 *"
          value={formData.confirmPassword}
          onChangeText={(value) => updateFormData('confirmPassword', value)}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={[styles.sectionTitle, styles.optionalSection]}>선택 정보</Text>
        
        <TextInput
          style={styles.input}
          placeholder="이름 (선택사항)"
          value={formData.firstName}
          onChangeText={(value) => updateFormData('firstName', value)}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="성 (선택사항)"
          value={formData.lastName}
          onChangeText={(value) => updateFormData('lastName', value)}
          autoCapitalize="words"
        />
      </View>

      {/* 가입 혜택 */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>🎁 가입 혜택</Text>
        <Text style={styles.benefitItem}>💰 $100,000 가상 투자 자금</Text>
        <Text style={styles.benefitItem}>🤖 AI 투자 코치 무료 상담</Text>
        <Text style={styles.benefitItem}>📊 실시간 주가 및 분석 도구</Text>
        <Text style={styles.benefitItem}>🏆 다른 투자자들과 성과 비교</Text>
      </View>

      {/* 회원가입 버튼 */}
      <TouchableOpacity 
        style={[styles.registerButton, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.registerButtonText}>🚀 투자 여정 시작하기</Text>
        )}
      </TouchableOpacity>

      {/* 로그인 링크 */}
      <TouchableOpacity 
        style={styles.loginLinkContainer}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginLinkText}>
          이미 계정이 있으신가요? <Text style={styles.loginLink}>로그인</Text>
        </Text>
      </TouchableOpacity>

      {/* 하단 여백 */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  optionalSection: {
    marginTop: 10,
    color: '#666',
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
  benefitsContainer: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  benefitItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    lineHeight: 20,
  },
  registerButton: {
    width: '100%',
    padding: 18,
    backgroundColor: '#28a745',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default RegisterScreen;
