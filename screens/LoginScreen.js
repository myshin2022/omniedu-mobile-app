// screens/LoginScreen.js - 수정된 버전 (이미지 에러 처리)
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageError, setImageError] = useState(false);

  // 🔧 Secret 5-tap system for TestUser access
  const [tapCount, setTapCount] = useState(0);
  const [showTestUser, setShowTestUser] = useState(false);

  const handleLogin = async () => {
    try {
      // 입력 값 검증
      if (!usernameOrEmail || !password) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }

      const response = await fetch('https://omnieduglobal.com/student/api/mobile/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: usernameOrEmail,
          password: password
        })
      });

      const result = await response.json();

      if (result.success) {
        // 사용자 정보 저장
        await AsyncStorage.setItem('userToken', 'logged_in');
        await AsyncStorage.setItem('userId', result.user_id.toString());
        await AsyncStorage.setItem('userEmail', result.email);

        Alert.alert(
          'Welcome!',
          'Login successful!',
          [{
            text: 'OK',
            onPress: () => navigation.replace('StudentDashboard')
          }]
        );
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }

    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Network Error', 'Please check your internet connection and try again');
    }
  };

  // 🔧 Secret 5-tap detection for developer mode
  const handleSecretTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);

    if (newCount === 5) {
      setShowTestUser(true);
      setTapCount(0);

      Alert.alert(
        "🔧 Developer Mode",
        "Secret TestUser access unlocked!",
        [{ text: "Cool! 😎", style: "default" }]
      );
    }

    // Reset count after 5 seconds if not completed
    setTimeout(() => {
      if (newCount < 5) setTapCount(0);
    }, 5000);
  };

  // 🚀 TestUser auto-login (only visible after 5 taps)
  const handleTestUserLogin = () => {
    setUsernameOrEmail('testuser');
    setPassword('password');

    // Auto-login after setting credentials
    setTimeout(() => {
      navigation.replace('StudentDashboard');
    }, 500);

    Alert.alert('Developer Login', 'Logging in with test credentials...', [], { cancelable: false });
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  // 이미지 로딩 에러 핸들러
  const handleImageError = (error) => {
    console.warn('Logo image failed to load:', error);
    setImageError(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {/* 🎯 안전한 이미지 로고 (에러 처리 포함) */}
          <View style={styles.logoContainer}>
            {!imageError ? (
              <Image
                source={require('../assets/icon.png')}
                style={styles.logoImage}
                resizeMode="contain"
                onError={handleImageError}
                onLoadStart={() => console.log('Loading logo...')}
                onLoadEnd={() => console.log('Logo loaded successfully')}
              />
            ) : (
              // 이미지 로딩 실패 시 fallback UI
              <View style={styles.fallbackLogo}>
                <Text style={styles.fallbackLogoText}>OE</Text>
              </View>
            )}
          </View>

          {/* 5번 탭 영역 */}
          <TouchableOpacity
            onPress={handleSecretTap}
            activeOpacity={0.9}
          >
            <Text style={styles.title}>OmniEdu Global Tutor</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle}>Learn Anything, Anytime, Anywhere</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username or Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username or email"
              placeholderTextColor="#999"
              value={usernameOrEmail}
              onChangeText={setUsernameOrEmail}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* 🔧 Secret TestUser button - only visible after 5 taps on title */}
          {showTestUser && (
            <TouchableOpacity
              style={styles.secretTestButton}
              onPress={handleTestUserLogin}
            >
              <Text style={styles.secretTestButtonText}>🔧 Developer TestUser</Text>
              <Text style={styles.secretTestSubtext}>testuser / password</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
            <Text style={styles.signupButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Join millions of learners worldwide with AI-powered personalized education
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  // 🎨 안전한 이미지 로고 컨테이너
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  // 🛡️ 이미지 로딩 실패 시 fallback 로고
  fallbackLogo: {
    width: 90,
    height: 90,
    backgroundColor: '#4285f4',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackLogoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  loginButton: {
    height: 56,
    backgroundColor: '#4285f4',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4285f4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  // 🔧 Secret TestUser button styles (only visible after 5 taps)
  secretTestButton: {
    height: 48,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ff5252',
  },
  secretTestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  secretTestSubtext: {
    fontSize: 11,
    color: '#ffcccb',
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  signupButton: {
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4285f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285f4',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default LoginScreen;