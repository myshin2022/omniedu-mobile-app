// screens/CoursesScreen.js
// OmniEdu Global Tutor - All Courses Management

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CoursesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Mathematics', 'English', 'Science', 'History', 'Arts'];

  const [allCourses, setAllCourses] = useState([
    // Mathematics courses
    {
      id: 1,
      title: 'Basic Mathematics',
      subtitle: 'Numbers, Operations, and Algebra',
      category: 'Mathematics',
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 24,
      students: 1247,
      rating: 4.8,
      price: 'FREE',
      progress: 0,
      color: '#4A90E2',
      icon: 'calculator',
    },
    {
      id: 2,
      title: 'Advanced Calculus',
      subtitle: 'Derivatives, Integrals, and Applications',
      category: 'Mathematics',
      level: 'Advanced',
      duration: '12 weeks',
      lessons: 36,
      students: 892,
      rating: 4.9,
      price: 'PREMIUM',
      progress: 0,
      color: '#4A90E2',
      icon: 'calculator',
    },
    // English courses
    {
      id: 3,
      title: 'English Grammar',
      subtitle: 'Master Grammar Rules and Usage',
      category: 'English',
      level: 'Intermediate',
      duration: '6 weeks',
      lessons: 18,
      students: 2156,
      rating: 4.7,
      price: 'FREE',
      progress: 60,
      color: '#50C878',
      icon: 'book',
    },
    {
      id: 4,
      title: 'Creative Writing',
      subtitle: 'Stories, Essays, and Poetry',
      category: 'English',
      level: 'Intermediate',
      duration: '10 weeks',
      lessons: 30,
      students: 743,
      rating: 4.6,
      price: 'PREMIUM',
      progress: 0,
      color: '#50C878',
      icon: 'create',
    },
    // Science courses
    {
      id: 5,
      title: 'Physics Fundamentals',
      subtitle: 'Motion, Forces, and Energy',
      category: 'Science',
      level: 'Beginner',
      duration: '8 weeks',
      lessons: 24,
      students: 1583,
      rating: 4.8,
      price: 'FREE',
      progress: 45,
      color: '#FF6B6B',
      icon: 'flash',
    },
    {
      id: 6,
      title: 'Organic Chemistry',
      subtitle: 'Carbon Compounds and Reactions',
      category: 'Science',
      level: 'Advanced',
      duration: '14 weeks',
      lessons: 42,
      students: 657,
      rating: 4.5,
      price: 'PREMIUM',
      progress: 0,
      color: '#FF6B6B',
      icon: 'flask',
    },
    // History courses
    {
      id: 7,
      title: 'World History',
      subtitle: 'Ancient Civilizations to Modern Era',
      category: 'History',
      level: 'Intermediate',
      duration: '12 weeks',
      lessons: 36,
      students: 924,
      rating: 4.6,
      price: 'FREE',
      progress: 30,
      color: '#FFA726',
      icon: 'library',
    },
    {
      id: 8,
      title: 'American History',
      subtitle: 'Colonial Period to Present Day',
      category: 'History',
      level: 'Intermediate',
      duration: '10 weeks',
      lessons: 30,
      students: 1123,
      rating: 4.7,
      price: 'PREMIUM',
      progress: 0,
      color: '#FFA726',
      icon: 'flag',
    },
    // Arts courses
    {
      id: 9,
      title: 'Digital Art Basics',
      subtitle: 'Drawing, Design, and Illustration',
      category: 'Arts',
      level: 'Beginner',
      duration: '6 weeks',
      lessons: 18,
      students: 856,
      rating: 4.8,
      price: 'FREE',
      progress: 0,
      color: '#9C27B0',
      icon: 'brush',
    },
    {
      id: 10,
      title: 'Music Theory',
      subtitle: 'Notes, Scales, and Composition',
      category: 'Arts',
      level: 'Intermediate',
      duration: '8 weeks',
      lessons: 24,
      students: 634,
      rating: 4.5,
      price: 'PREMIUM',
      progress: 0,
      color: '#9C27B0',
      icon: 'musical-notes',
    },
  ]);

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const enrollCourse = (course) => {
    if (course.price === 'PREMIUM') {
      Alert.alert(
        'Premium Course',
        `${course.title} is a premium course.\nPremium subscription required.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Subscribe', 
            onPress: () => navigation.navigate('Premium') 
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Enroll Course',
      `Do you want to enroll in ${course.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Enroll', 
          onPress: () => {
            // Update course progress
            const updatedCourses = allCourses.map(c => 
              c.id === course.id ? { ...c, progress: 1 } : c
            );
            setAllCourses(updatedCourses);
            
            navigation.navigate('Learning', {
              courseId: course.id,
              courseTitle: course.title,
              subject: course.category,
              chapter: course.subtitle,
            });
          } 
        },
      ]
    );
  };

  const continueCourse = (course) => {
    navigation.navigate('Learning', {
      courseId: course.id,
      courseTitle: course.title,
      subject: course.category,
      chapter: course.subtitle,
    });
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FF9800';
      case 'Advanced': return '#F44336';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Courses</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by course name or content..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView 
        style={styles.coursesContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {filteredCourses.length} courses found
          </Text>
        </View>

        {filteredCourses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                <Ionicons name={course.icon} size={24} color="white" />
              </View>
              <View style={styles.courseInfo}>
                <View style={styles.courseTitleRow}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <View style={styles.priceContainer}>
                    {course.price === 'FREE' ? (
                      <Text style={styles.freePrice}>Free</Text>
                    ) : (
                      <View style={styles.premiumBadge}>
                        <Ionicons name="star" size={12} color="#FFA726" />
                        <Text style={styles.premiumPrice}>Premium</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                
                <View style={styles.courseDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>
                      <Ionicons name="time" size={12} color="#666" /> {course.duration}
                    </Text>
                    <Text style={styles.detailText}>
                      <Ionicons name="book" size={12} color="#666" /> {course.lessons} lessons
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailText}>
                      <Ionicons name="people" size={12} color="#666" /> {course.students} students
                    </Text>
                    <Text style={styles.detailText}>
                      <Ionicons name="star" size={12} color="#666" /> {course.rating}
                    </Text>
                  </View>

                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
                    <Text style={styles.levelText}>{course.level}</Text>
                  </View>
                </View>

                {course.progress > 0 && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${course.progress}%`, backgroundColor: course.color }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>Progress: {course.progress}%</Text>
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: course.color }]}
              onPress={() => course.progress > 0 ? continueCourse(course) : enrollCourse(course)}
            >
              <Text style={styles.actionButtonText}>
                {course.progress > 0 ? 'Continue Learning' : 'Enroll Now'}
              </Text>
              <Ionicons 
                name={course.progress > 0 ? "play" : "add-circle"} 
                size={16} 
                color="white" 
              />
            </TouchableOpacity>
          </View>
        ))}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  coursesContainer: {
    flex: 1,
  },
  resultsHeader: {
    padding: 20,
    paddingBottom: 12,
  },
  resultsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  courseCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseHeader: {
    marginBottom: 16,
  },
  courseIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  freePrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumPrice: {
    fontSize: 12,
    color: '#FFA726',
    marginLeft: 4,
    fontWeight: '600',
  },
  courseSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  courseDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  levelText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default CoursesScreen;
