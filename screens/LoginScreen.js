// screens/LoginScreen.js
// OmniEdu Global Tutor - LoginScreen with Quick Test Login

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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';  

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

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
  // 🚀 Quick Test Login Function
  const quickTestLogin = () => {
    setUsernameOrEmail('testuser');
    setPassword('password');
    
    // Auto-login after setting credentials
    setTimeout(() => {
      navigation.replace('StudentDashboard');
    }, 500);

    Alert.alert('Quick Login', 'Logging in with test credentials...', [], { cancelable: false });
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
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
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🎓</Text>
          </View>
          <Text style={styles.title}>OmniEdu Global Tutor</Text>
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

          {/* 🚀 Quick Test Login Button - 개발/테스트용 */}
          <TouchableOpacity 
            style={styles.quickTestButton} 
            onPress={quickTestLogin}
          >
            <Text style={styles.quickTestButtonText}>⚡ Quick Test Login</Text>
            <Text style={styles.quickTestSubtext}>testuser / password</Text>
          </TouchableOpacity>

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

        {/* 개발자 노트 - 나중에 제거 */}
        <View style={styles.devNote}>
          <Text style={styles.devNoteText}>
            🔧 Development Mode: Quick login enabled for testing
          </Text>
          <Text style={styles.devNoteSubtext}>
            Remove this section before App Store submission
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: '#f8f9fa',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // 🚀 Quick Test Login Styles
  quickTestButton: {
    backgroundColor: '#27ae60',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  quickTestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickTestSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e1e8ed',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#7f8c8d',
    fontSize: 14,
  },
  signupButton: {
    backgroundColor: '#fff',
    height: 50,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
  // 개발자 노트 스타일 - 나중에 제거
  devNote: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    alignItems: 'center',
  },
  devNoteText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  devNoteSubtext: {
    fontSize: 11,
    color: '#856404',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
