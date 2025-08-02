// screens/ProgressScreen.js
// OmniEdu Global Tutor - Learning Progress Analytics

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProgressScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const [selectedTab, setSelectedTab] = useState('Overview');

  const periods = ['Yesterday', 'This Week', 'This Month', 'All Time'];
  const tabs = ['Overview', 'By Subject', 'Achievements', 'Goals'];

  // Overall statistics
  const [overallStats, setOverallStats] = useState({
    totalHours: 127,
    coursesCompleted: 8,
    averageScore: 87,
    currentStreak: 12,
    longestStreak: 23,
    totalLessons: 156,
    rank: 'Advanced Learner',
    level: 15,
  });

  // Subject-wise progress
  const [subjectProgress, setSubjectProgress] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      icon: 'calculator',
      color: '#4A90E2',
      progress: 75,
      timeSpent: 12.5,
      lessonsCompleted: 9,
      totalLessons: 12,
      averageScore: 89,
      status: 'In Progress',
    },
    {
      id: 2,
      subject: 'English Literature',
      icon: 'book',
      color: '#50C878',
      progress: 60,
      timeSpent: 8.2,
      lessonsCompleted: 6,
      totalLessons: 10,
      averageScore: 85,
      status: 'In Progress',
    },
    {
      id: 3,
      subject: 'Physics',
      icon: 'flash',
      color: '#FF6B6B',
      progress: 100,
      timeSpent: 15.3,
      lessonsCompleted: 8,
      totalLessons: 8,
      averageScore: 92,
      status: 'Completed',
    },
    {
      id: 4,
      subject: 'World History',
      icon: 'library',
      color: '#FFA726',
      progress: 30,
      timeSpent: 4.1,
      lessonsCompleted: 3,
      totalLessons: 10,
      averageScore: 83,
      status: 'In Progress',
    },
    {
      id: 5,
      subject: 'Chemistry',
      icon: 'flask',
      color: '#9C27B0',
      progress: 0,
      timeSpent: 0,
      lessonsCompleted: 0,
      totalLessons: 12,
      averageScore: 0,
      status: 'Not Started',
    },
  ]);

  // Achievements
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: '7-Day Learning Streak',
      description: 'Completed learning for 7 consecutive days!',
      icon: 'flame',
      color: '#FF6B6B',
      earned: true,
      dateEarned: '2024-07-25',
      progress: 100,
    },
    {
      id: 2,
      title: 'Mathematics Master',
      description: 'Complete 10 mathematics lessons',
      icon: 'calculator',
      color: '#4A90E2',
      earned: false,
      progress: 90,
    },
    {
      id: 3,
      title: 'Quiz Champion',
      description: 'Score 90% or higher on 5 quizzes',
      icon: 'trophy',
      color: '#FFA726',
      earned: true,
      dateEarned: '2024-07-20',
      progress: 100,
    },
    {
      id: 4,
      title: 'Speed Learner',
      description: 'Complete a lesson in under 15 minutes',
      icon: 'timer',
      color: '#50C878',
      earned: true,
      dateEarned: '2024-07-18',
      progress: 100,
    },
    {
      id: 5,
      title: 'Knowledge Seeker',
      description: 'Study for 50 total hours',
      icon: 'school',
      color: '#9C27B0',
      earned: false,
      progress: 68,
    },
  ]);

  // Learning goals
  const [studyGoals, setStudyGoals] = useState([
    {
      id: 1,
      title: 'Weekly Study Hours',
      current: 8.5,
      target: 10,
      unit: 'hours',
      color: '#4A90E2',
      deadline: 'by Sunday',
    },
    {
      id: 2,
      title: 'Lessons This Month',
      current: 12,
      target: 20,
      unit: 'lessons',
      color: '#50C878',
      deadline: 'by month end',
    },
    {
      id: 3,
      title: 'Quiz Average Score',
      current: 87,
      target: 90,
      unit: '%',
      color: '#FF6B6B',
      deadline: 'ongoing',
    },
    {
      id: 4,
      title: 'Learning Streak',
      current: 12,
      target: 30,
      unit: 'days',
      color: '#FFA726',
      deadline: 'ongoing',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const setGoal = () => {
    Alert.alert(
      'Set Goal',
      'Would you like to set a new learning goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Goal', onPress: () => {} }
      ]
    );
  };

  const renderOverview = () => (
    <View>
      {/* Overall Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Overall Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#4A90E2" />
            <Text style={styles.statNumber}>{overallStats.totalHours}h</Text>
            <Text style={styles.statLabel}>Total Hours</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#50C878" />
            <Text style={styles.statNumber}>{overallStats.coursesCompleted}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>{overallStats.averageScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color="#FFA726" />
            <Text style={styles.statNumber}>{overallStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
        
        <View style={styles.additionalStats}>
          <View style={styles.additionalStatItem}>
            <Text style={styles.additionalStatLabel}>Learning Level</Text>
            <Text style={styles.additionalStatValue}>Level {overallStats.level}</Text>
          </View>
          <View style={styles.additionalStatItem}>
            <Text style={styles.additionalStatLabel}>Rank</Text>
            <Text style={styles.additionalStatValue}>{overallStats.rank}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSubjects = () => (
    <View style={styles.subjectsContainer}>
      <Text style={styles.sectionTitle}>📚 Progress by Subject</Text>
      {subjectProgress.map((subject) => (
        <View key={subject.id} style={styles.subjectCard}>
          <View style={styles.subjectHeader}>
            <View style={[styles.subjectIcon, { backgroundColor: subject.color }]}>
              <Ionicons name={subject.icon} size={20} color="white" />
            </View>
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectTitle}>{subject.subject}</Text>
              <Text style={styles.subjectStatus}>{subject.status}</Text>
            </View>
            <Text style={styles.subjectProgress}>{subject.progress}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${subject.progress}%`, backgroundColor: subject.color },
              ]}
            />
          </View>
          
          <View style={styles.subjectDetails}>
            <Text style={styles.subjectDetail}>
              <Ionicons name="time" size={12} color="#666" /> {subject.timeSpent}h spent
            </Text>
            <Text style={styles.subjectDetail}>
              <Ionicons name="book" size={12} color="#666" /> {subject.lessonsCompleted}/{subject.totalLessons} lessons
            </Text>
            {subject.averageScore > 0 && (
              <Text style={styles.subjectDetail}>
                <Ionicons name="trending-up" size={12} color="#666" /> {subject.averageScore}% avg score
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      <Text style={styles.sectionTitle}>🏆 Achievements</Text>
      {achievements.map((achievement) => (
        <View 
          key={achievement.id} 
          style={[
            styles.achievementCard,
            !achievement.earned && styles.unearned
          ]}
        >
          <View style={styles.achievementHeader}>
            <View style={[
              styles.achievementIcon, 
              { backgroundColor: achievement.earned ? achievement.color : '#ccc' }
            ]}>
              <Ionicons 
                name={achievement.icon} 
                size={20} 
                color="white" 
              />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={[
                styles.achievementTitle,
                !achievement.earned && styles.unearnedText
              ]}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
              {achievement.earned && achievement.dateEarned && (
                <Text style={styles.achievementDate}>
                  Earned on {achievement.dateEarned}
                </Text>
              )}
            </View>
            {achievement.earned ? (
              <Ionicons name="checkmark-circle" size={24} color={achievement.color} />
            ) : (
              <View style={styles.achievementProgress}>
                <Text style={styles.achievementProgressText}>
                  Progress: {achievement.progress}%
                </Text>
                <View style={styles.achievementProgressBar}>
                  <View
                    style={[
                      styles.achievementProgressFill,
                      { width: `${achievement.progress}%`, backgroundColor: achievement.color },
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderGoals = () => (
    <View style={styles.goalsContainer}>
      <View style={styles.goalHeaderContainer}>
        <Text style={styles.sectionTitle}>🎯 Learning Goals</Text>
        <TouchableOpacity onPress={setGoal} style={styles.setGoalButton}>
          <Ionicons name="add" size={20} color="#4A90E2" />
          <Text style={styles.setGoalText}>Set Goal</Text>
        </TouchableOpacity>
      </View>
      
      {studyGoals.map((goal) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100);
        const isCompleted = goal.current >= goal.target;
        
        return (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalDeadline}>{goal.deadline}</Text>
            </View>
            
            <View style={styles.goalProgress}>
              <Text style={styles.goalProgressText}>
                {goal.current} / {goal.target} {goal.unit}
              </Text>
              <Text style={[
                styles.goalProgressPercent,
                isCompleted && styles.goalCompleted
              ]}>
                {Math.round(progress)}%
              </Text>
            </View>
            
            <View style={styles.goalProgressBar}>
              <View
                style={[
                  styles.goalProgressFill,
                  { 
                    width: `${progress}%`, 
                    backgroundColor: isCompleted ? '#4CAF50' : goal.color 
                  },
                ]}
              />
            </View>
            
            {isCompleted && (
              <Text style={styles.goalCompletedText}>
                🎉 Goal completed!
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );

  const renderContent = () => {
    switch(selectedTab) {
      case 'Overview': return renderOverview();
      case 'By Subject': return renderSubjects();
      case 'Achievements': return renderAchievements();
      case 'Goals': return renderGoals();
      default: return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Progress</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Period Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.periodContainer}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.periodTextActive
            ]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextActive
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  periodContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  periodButtonActive: {
    backgroundColor: '#4A90E2',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  content: {
    flex: 1,
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
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  additionalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  additionalStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  additionalStatLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  additionalStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  subjectsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  subjectCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  subjectStatus: {
    fontSize: 12,
    color: '#666',
  },
  subjectProgress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 12,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  subjectDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  subjectDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  achievementsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  achievementCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  unearned: {
    opacity: 0.6,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  unearnedText: {
    color: '#999',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#4A90E2',
    fontStyle: 'italic',
  },
  achievementProgress: {
    alignItems: 'flex-end',
  },
  achievementProgressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  achievementProgressBar: {
    width: 60,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
  },
  achievementProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  goalsContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  goalHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  setGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
  },
  setGoalText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  goalCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  goalProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalProgressText: {
    fontSize: 14,
    color: '#666',
  },
  goalProgressPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  goalCompleted: {
    color: '#4CAF50',
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  goalCompletedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProgressScreen;
