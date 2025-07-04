// screens/RegisterScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollViewRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);

  // 서버 URL
  const FLASK_API_BASE_URL = 'https://learntoinvestai.com';

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 입력 필드 포커스 시 스크롤
  const handleInputFocus = (inputRef) => {
    setTimeout(() => {
      if (inputRef.current && scrollViewRef.current) {
        inputRef.current.measureLayout(
          scrollViewRef.current.getInnerViewNode(),
          (x, y) => {
            scrollViewRef.current.scrollTo({
              y: y - 100, // 입력 필드 위에 여백 확보
              animated: true,
            });
          }
        );
      }
    }, 100);
  };

  // 1단계: 폼 제출 (필드 검증)
  const handleSubmit = () => {
    console.log('📝 [USER] 폼 제출 시도');

    // 필수 필드 검증
    if (!formData.username.trim()) {
      Alert.alert('오류', '사용자명을 입력해주세요.');
      usernameRef.current?.focus();
      return;
    }
    if (!formData.email.trim()) {
      Alert.alert('오류', '이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }
    if (!formData.password.trim()) {
      Alert.alert('오류', '비밀번호를 입력해주세요.');
      passwordRef.current?.focus();
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      confirmPasswordRef.current?.focus();
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('오류', '비밀번호는 6자리 이상이어야 합니다.');
      passwordRef.current?.focus();
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('오류', '올바른 이메일 형식을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }

    console.log('✅ [USER] 폼 검증 통과');
    Keyboard.dismiss(); // 키보드 숨기기
    setFormSubmitted(true);
  };

  // 2단계: 실제 회원가입 API 호출
  const handleRegister = async () => {
    console.log('📝 회원가입 요청 중...');
    setLoading(true);

    try {
      const response = await axios.post(`${FLASK_API_BASE_URL}/api/register`, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        first_name: formData.firstName.trim() || null,
        last_name: formData.lastName.trim() || null,
      });

      console.log('✅ 회원가입 응답:', response.data);

      if (response.data.success) {
        console.log('🎉 회원가입 성공!');

        // 자동 로그인 시도
        try {
          const loginResponse = await axios.post(`${FLASK_API_BASE_URL}/api/login`, {
            username: formData.username.trim(),
            password: formData.password,
          });

          if (loginResponse.data.success) {
            console.log('🎉 자동 로그인 성공!');
            // 여기서 로그인 상태를 Context나 AsyncStorage에 저장
          }
        } catch (loginError) {
          console.error('자동 로그인 실패:', loginError);
        }

        setRegistrationSuccess(true);
      } else {
        Alert.alert('회원가입 실패', response.data.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('❌ 회원가입 오류:', error);
      Alert.alert(
        '회원가입 오류',
        error.response?.data?.error || '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
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
            <View style={styles.header}>
              <Text style={styles.title}>🎯 투자 계정 만들기</Text>
              <Text style={styles.subtitle}>무료로 $100,000 가상 자금을 받고 투자를 시작하세요!</Text>
            </View>

            {/* 입력 필드들 */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>사용자명 *</Text>
                <TextInput
                  ref={usernameRef}
                  style={styles.input}
                  placeholder="영문, 숫자 조합 (예: investor123)"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  onFocus={() => handleInputFocus(usernameRef)}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!formSubmitted}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>이메일 주소 *</Text>
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder="example@email.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  onFocus={() => handleInputFocus(emailRef)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!formSubmitted}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호 * (중요: 키보드가 가리지 않도록 화면이 자동 스크롤됩니다)</Text>
                <TextInput
                  ref={passwordRef}
                  style={[styles.input, styles.passwordInput]}
                  placeholder="6자리 이상 입력"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  onFocus={() => {
                    console.log('🔍 비밀번호 입력 포커스');
                    handleInputFocus(passwordRef);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!formSubmitted}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>비밀번호 확인 *</Text>
                <TextInput
                  ref={confirmPasswordRef}
                  style={[styles.input, styles.passwordInput]}
                  placeholder="비밀번호를 다시 입력"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  onFocus={() => {
                    console.log('🔍 비밀번호 확인 입력 포커스');
                    handleInputFocus(confirmPasswordRef);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!formSubmitted}
                  returnKeyType="next"
                  onSubmitEditing={() => firstNameRef.current?.focus()}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>이름 (선택)</Text>
                  <TextInput
                    ref={firstNameRef}
                    style={styles.input}
                    placeholder="홍길동"
                    value={formData.firstName}
                    onChangeText={(value) => handleInputChange('firstName', value)}
                    onFocus={() => handleInputFocus(firstNameRef)}
                    editable={!formSubmitted}
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>성 (선택)</Text>
                  <TextInput
                    ref={lastNameRef}
                    style={styles.input}
                    placeholder="김"
                    value={formData.lastName}
                    onChangeText={(value) => handleInputChange('lastName', value)}
                    onFocus={() => handleInputFocus(lastNameRef)}
                    editable={!formSubmitted}
                    returnKeyType="done"
                    onSubmitEditing={() => Keyboard.dismiss()}
                  />
                </View>
              </View>
            </View>

            {/* 3단계 버튼 플로우 */}
            <View style={styles.buttonContainer}>
              {!formSubmitted ? (
                // 1단계: 제출 버튼
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>📝 제출</Text>
                </TouchableOpacity>
              ) : !registrationSuccess ? (
                // 2단계: 회원가입 버튼
                <View>
                  <View style={styles.reviewContainer}>
                    <Text style={styles.reviewTitle}>✅ 입력 정보 확인</Text>
                    <Text style={styles.reviewText}>사용자명: {formData.username}</Text>
                    <Text style={styles.reviewText}>이메일: {formData.email}</Text>
                    <Text style={styles.reviewNote}>위 정보로 계정을 생성하시겠습니까?</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.registerButton, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.registerButtonText}>✅ 회원가입 완료</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setFormSubmitted(false)}
                  >
                    <Text style={styles.backButtonText}>← 정보 수정</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // 3단계: 성공 및 시작하기
                <View>
                  <View style={styles.successContainer}>
                    <Text style={styles.successMessage}>🎉 회원가입이 성공적으로 완료되었습니다!</Text>
                    <Text style={styles.successSubMessage}>
                      축하합니다! $100,000의 가상 자금으로 안전하게 투자를 연습하세요.
                    </Text>
                    <Text style={styles.successNote}>
                      ✨ AI 투자 코치가 당신의 투자 여정을 도와드립니다!
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate('MainDashboard')}
                  >
                    <Text style={styles.startButtonText}>🚀 투자 여정 시작하기</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 로그인 링크 */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>이미 계정이 있으신가요? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>로그인하기</Text>
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
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 30, // 키보드 대응을 위해 간격 더 늘림
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16, // 패딩 늘림
    fontSize: 16,
    backgroundColor: 'white',
    color: '#2c3e50',
    minHeight: 50, // 최소 높이 지정
  },
  passwordInput: {
    borderColor: '#3498db', // 비밀번호 필드 강조
    borderWidth: 2,
    backgroundColor: '#f8f9ff', // 약간 다른 배경색
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  buttonContainer: {
    marginTop: 30, // 더 큰 간격
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18, // 더 큰 버튼
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
  reviewNote: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
    fontStyle: 'italic',
  },
  registerButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    backgroundColor: '#e8f5e8',
    padding: 25,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#27ae60',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 15,
  },
  successSubMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
  },
  successNote: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 20, // 더 큰 최종 버튼
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 50, // 더 큰 하단 여백
  },
  loginText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  loginLink: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
});

export default RegisterScreen;