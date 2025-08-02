// screens/AITutorScreen.js
// 키보드 문제 해결 버전

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AITutorScreen = ({ navigation, route }) => {
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Tutor. I can help you with any subject. What would you like to learn today?",
      sender: 'tutor',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);

  const FLASK_API_BASE_URL = 'https://omnieduglobal.com';

  const subjects = [
    { id: 'general', name: 'General', icon: '🎓', color: '#4A90E2' },
    { id: 'math', name: 'Mathematics', icon: '🔢', color: '#e74c3c' },
    { id: 'science', name: 'Science', icon: '🧪', color: '#9b59b6' },
    { id: 'english', name: 'English Literature', icon: '📚', color: '#27ae60' },
    { id: 'history', name: 'History', icon: '🏛️', color: '#f39c12' },
    { id: 'geography', name: 'Geography', icon: '🌍', color: '#16a085' },
    { id: 'art', name: 'Art & Design', icon: '🎨', color: '#e67e22' },
    { id: 'music', name: 'Music', icon: '🎵', color: '#8e44ad' },
  ];

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // 키보드가 나타나면 스크롤을 맨 아래로
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // 메시지가 추가될 때마다 스크롤
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const getCurrentSubject = () => {
    return subjects.find(s => s.name === selectedSubject) || subjects[0];
  };

  const changeSubject = (subject) => {
    setSelectedSubject(subject.name);
    setShowSubjectPicker(false);

    const changeMessage = {
      id: Date.now(),
      text: `${subject.icon} Switched to ${subject.name}. How can I help you with this subject?`,
      sender: 'tutor',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, changeMessage]);
  };

const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'student',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // ✅ 실제 작동하는 엔드포인트 사용
      const response = await fetch(`${FLASK_API_BASE_URL}/student/chat_gpt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          topic: selectedSubject.toLowerCase(), // 과목을 주제로 사용
          history: messages.map(msg => ({
            role: msg.sender === 'student' ? 'user' : 'assistant',
            content: msg.text
          })),
          level: 'general', // 앱에서는 일반 레벨 사용
          levelConfig: {
            name: 'General',
            speed: 0.9,
            complexity: 'normal',
            vocabulary: 'standard',
            encouragement: false,
            helpfulMode: false,
            patience: 'normal'
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const tutorMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'tutor',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, tutorMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('AI Tutor Error:', error);
      
      // 연결 실패 시 오프라인 모드로 전환
      if (!isOfflineMode) {
        setIsOfflineMode(true);
        const offlineMessage = {
          id: Date.now() + 1,
          text: "🔄 Connection issue detected. Switching to offline demo mode:\n\n" + getDemoResponse(currentInput, selectedSubject),
          sender: 'tutor',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, offlineMessage]);
      } else {
        // 이미 오프라인 모드인 경우 데모 응답
        const demoMessage = {
          id: Date.now() + 1,
          text: getDemoResponse(currentInput, selectedSubject),
          sender: 'tutor',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, demoMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const startConversationMode = () => {
    navigation.navigate('ConversationTutor', {
      subject: 'English Conversation',
      returnScreen: 'AITutor'
    });
  };

  const renderMessage = (message) => {
    const isTutor = message.sender === 'tutor';

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isTutor ? styles.tutorMessage : styles.studentMessage
      ]}>
        {isTutor && (
          <View style={styles.tutorHeader}>
            <Ionicons name="school" size={18} color="#4A90E2" />
            <Text style={styles.tutorLabel}>AI Tutor</Text>
            <Text style={styles.subjectLabel}>{selectedSubject}</Text>
          </View>
        )}

        <Text style={[
          styles.messageText,
          isTutor ? styles.tutorText : styles.studentText
        ]}>
          {message.text}
        </Text>

        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  const renderSubjectPicker = () => (
    <Modal
      visible={showSubjectPicker}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSubjectPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.subjectPickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Choose Subject</Text>
            <TouchableOpacity onPress={() => setShowSubjectPicker(false)}>
              <Ionicons name="close" size={24} color="#7f8c8d" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.subjectsList}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.subjectOption,
                  selectedSubject === subject.name && styles.selectedSubjectOption
                ]}
                onPress={() => changeSubject(subject)}
              >
                <Text style={styles.subjectIcon}>{subject.icon}</Text>
                <Text style={[
                  styles.subjectName,
                  selectedSubject === subject.name && styles.selectedSubjectName
                ]}>
                  {subject.name}
                </Text>
                {selectedSubject === subject.name && (
                  <Ionicons name="checkmark" size={20} color="#4A90E2" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subjectSelector}
          onPress={() => setShowSubjectPicker(true)}
        >
          <Text style={styles.subjectIcon}>{getCurrentSubject().icon}</Text>
          <Text style={styles.headerTitle}>{selectedSubject}</Text>
          <Ionicons name="chevron-down" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity onPress={startConversationMode}>
          <Ionicons name="chatbubbles" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.messagesContent,
            { paddingBottom: keyboardHeight > 0 ? 20 : 80 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text style={styles.loadingText}>AI Tutor is thinking...</Text>
            </View>
          )}
        </ScrollView>

        <View style={[
          styles.inputContainer,
          keyboardHeight > 0 && styles.inputContainerKeyboard
        ]}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Explain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Example</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Quiz me</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.conversationButton]}
              onPress={startConversationMode}
            >
              <Ionicons name="mic" size={14} color="#fff" />
              <Text style={[styles.quickActionText, styles.conversationButtonText]}>Talk</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={`Ask me anything about ${selectedSubject.toLowerCase()}...`}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 300);
              }}
            />

            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {renderSubjectPicker()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  keyboardContainer: {
    flex: 1,
  },
  subjectSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subjectIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: '85%',
  },
  tutorMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  studentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tutorLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginLeft: 4,
  },
  subjectLabel: {
    fontSize: 10,
    color: '#7f8c8d',
    marginLeft: 4,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  tutorText: {
    color: '#2c3e50',
  },
  studentText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#95a5a6',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
    paddingTop: 8,
  },
  inputContainerKeyboard: {
    paddingBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickActionButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  conversationButton: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  conversationButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#4A90E2',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  subjectPickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subjectsList: {
    paddingHorizontal: 20,
  },
  subjectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  selectedSubjectOption: {
    backgroundColor: '#f0f7ff',
  },
  subjectName: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 12,
  },
  selectedSubjectName: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
});

export default AITutorScreen;