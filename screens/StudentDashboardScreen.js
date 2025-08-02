// screens/StudentDashboardScreen.js
// OmniEdu Global Tutor - Student Learning Dashboard

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentDashboardScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [studentData, setStudentData] = useState({
    name: 'Alex Kim',
    grade: 'Grade 10',
    isPremium: true,
    profileImage: null,
  });

  const [learningStats, setLearningStats] = useState({
    totalHours: 42,
    completedSessions: 28,
    averageScore: 87,
    dayStreak: 12,
  });

  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Mathematics',
      subtitle: 'Quadratic Functions',
      progress: 75,
      nextLesson: 'Solving Equations',
      color: '#4A90E2',
      icon: 'calculator',
    },
    {
      id: 2,
      title: 'English Literature',
      subtitle: 'Shakespeare Analysis',
      progress: 60,
      nextLesson: 'Romeo and Juliet',
      color: '#50C878',
      icon: 'book',
    },
    {
      id: 3,
      title: 'Physics',
      subtitle: 'Motion and Forces',
      progress: 45,
      nextLesson: 'Newton\'s Laws',
      color: '#FF6B6B',
      icon: 'flash',
    },
    {
      id: 4,
      title: 'World History',
      subtitle: 'Industrial Revolution',
      progress: 30,
      nextLesson: 'Steam Engine Impact',
      color: '#FFA726',
      icon: 'library',
    },
  ]);

  const quickActions = [
    { id: 1, title: 'AI Tutor', icon: 'chatbubbles', color: '#4A90E2', screen: 'ChatBot' },
    { id: 2, title: 'All Courses', icon: 'book', color: '#50C878', screen: 'Courses' },
    { id: 3, title: 'Progress', icon: 'analytics', color: '#FF6B6B', screen: 'Progress' },
    { id: 4, title: 'Premium', icon: 'star', color: '#FFA726', screen: 'Premium' },
  ];

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      // Load student data from AsyncStorage
      const savedData = await AsyncStorage.getItem('studentData');
      if (savedData) {
        setStudentData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudentData();
    setRefreshing(false);
  };

  const handleQuickAction = (action) => {
    if (action.screen === 'ChatBot') {
      navigation.navigate('AITutor');
    } else if (action.screen === 'Courses') {
      navigation.navigate('Courses');
    } else if (action.screen === 'Progress') {
      navigation.navigate('Progress');
    } else if (action.screen === 'Premium') {
      navigation.navigate('Premium');
    }
  };

  const handleCoursePress = (course) => {
    navigation.navigate('Learning', {
      courseId: course.id,
      courseTitle: course.title,
      subject: course.title,
      chapter: course.subtitle,
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Do you want to preserve your learning data?',
      [
        {
          text: 'Delete Data & Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
        {
          text: 'Keep Data & Logout',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading learning data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.welcomeText}>Hello!</Text>
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{studentData.name}</Text>
            <Text style={styles.studentGrade}>{studentData.grade}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {studentData.isPremium && (
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={16} color="#FFA726" />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Learning Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Learning Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.totalHours}</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.completedSessions}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.averageScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.dayStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.quickActionItem, { backgroundColor: action.color }]}
              onPress={() => handleQuickAction(action)}
            >
              <Ionicons name={action.icon} size={24} color="white" />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Courses */}
      <View style={styles.coursesContainer}>
        <Text style={styles.sectionTitle}>📚 Current Courses</Text>
        {courses.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => handleCoursePress(course)}
          >
            <View style={styles.courseHeader}>
              <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                <Ionicons name={course.icon} size={20} color="white" />
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
              </View>
              <Text style={styles.courseProgress}>{course.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${course.progress}%`, backgroundColor: course.color },
                ]}
              />
            </View>
            <Text style={styles.nextLesson}>Next: {course.nextLesson}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 16,
    color: '#4A90E2',
    marginRight: 8,
  },
  studentGrade: {
    fontSize: 14,
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  premiumText: {
    fontSize: 12,
    color: '#FFA726',
    marginLeft: 4,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  coursesContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
  },
  courseCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  courseProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  nextLesson: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default StudentDashboardScreen;
