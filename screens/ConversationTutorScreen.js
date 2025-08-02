// screens/ConversationTutorScreen.js
// 임시 텍스트 기반 회화 연습 (음성 기능은 나중에 추가)

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ConversationTutorScreen = ({ navigation, route }) => {
  const { subject, returnScreen } = route.params || {};
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your English Conversation Tutor. Let's practice speaking English together! What would you like to talk about?",
      sender: 'tutor',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);
  
  const FLASK_API_BASE_URL = 'https://omnieduglobal.com';

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
      // 임시로 간단한 응답 (Flask 서버 연결 전까지)
      setTimeout(() => {
        const responses = [
          "That's interesting! Can you tell me more about that?",
          "Great! How do you feel about it?",
          "I see. What do you think about this topic?",
          "Excellent! Your English is improving. Can you give me an example?",
          "Perfect! Let's practice with a different topic. What's your favorite hobby?",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const tutorMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          sender: 'tutor',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, tutorMessage]);
        setIsLoading(false);
      }, 1000);

      // TODO: 실제 Flask 서버 연결
      /*
      const response = await fetch(`${FLASK_API_BASE_URL}/api/conversation-tutor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          mode: 'conversation'
        }),
      });

      const data = await response.json();

      if (response.ok) {
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
      */
    } catch (error) {
      console.error('Conversation error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble right now. Let's continue our conversation!",
        sender: 'tutor',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const startQuickConversation = (topic) => {
    const topicMessages = {
      'Daily Life': "Let's talk about your daily routine. What time do you usually wake up?",
      'Hobbies': "What are your favorite hobbies? Tell me about something you enjoy doing in your free time.",
      'Travel': "Have you traveled anywhere interesting? Where would you like to visit?",
      'Food': "What's your favorite food? Can you describe a dish from your country?",
      'Work/Study': "Tell me about your work or studies. What do you do every day?",
    };

    const message = {
      id: Date.now(),
      text: topicMessages[topic] || "Let's practice English conversation!",
      sender: 'tutor',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
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
            <Ionicons name="chatbubbles" size={16} color="#e74c3c" />
            <Text style={styles.tutorLabel}>Conversation Tutor</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Conversation Tutor</Text>
          <Text style={styles.headerSubtitle}>English Speaking Practice</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('AITutor')}>
          <Ionicons name="text" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#e74c3c" />
            <Text style={styles.loadingText}>Tutor is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.topicsContainer}>
          <Text style={styles.topicsTitle}>Quick Topics:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Daily Life', 'Hobbies', 'Travel', 'Food', 'Work/Study'].map((topic) => (
              <TouchableOpacity
                key={topic}
                style={styles.topicButton}
                onPress={() => startQuickConversation(topic)}
              >
                <Text style={styles.topicButtonText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your response in English..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={300}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle" size={16} color="#f39c12" />
          <Text style={styles.noticeText}>Voice feature coming soon! Practice with text for now.</Text>
        </View>
      </View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  messagesContainer: {
    flex: 1,
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
    backgroundColor: '#e74c3c',
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tutorLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginLeft: 4,
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
    paddingTop: 12,
  },
  topicsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  topicsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  topicButton: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  topicButtonText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 80,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: '#e74c3c',
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
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    marginTop: 4,
  },
  noticeText: {
    fontSize: 12,
    color: '#f39c12',
    marginLeft: 4,
    fontStyle: 'italic',
  },
});

export default ConversationTutorScreen;