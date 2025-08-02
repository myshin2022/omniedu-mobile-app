// screens/LearningScreen.js
// OmniEdu Global Tutor - Interactive Learning Content

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LearningScreen = ({ navigation, route }) => {
  const { courseId, courseTitle, subject, chapter } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);
  const [studyTime, setStudyTime] = useState(0);

  // Sample learning content
  const [courseData, setCourseData] = useState({
    id: courseId || 1,
    title: courseTitle || 'Basic Mathematics',
    subject: subject || 'Mathematics',
    chapter: chapter || 'Quadratic Functions',
    instructor: 'Dr. Sarah Johnson',
    totalLessons: 5,
    lessons: [
      {
        id: 1,
        title: 'Introduction to Quadratic Functions',
        duration: '15 min',
        content: `A quadratic function is a polynomial function of degree 2. The general form is:

f(x) = ax² + bx + c

where a, b, and c are constants and a ≠ 0.

Key characteristics:
• The graph is a parabola
• Has a vertex (highest or lowest point)
• Opens upward if a > 0, downward if a < 0
• Has a line of symmetry`,
        examples: [
          'f(x) = x² - 4x + 3',
          'f(x) = -2x² + 5x - 1',
          'f(x) = 3x² + 2x + 7'
        ]
      },
      {
        id: 2,
        title: 'Finding the Vertex',
        duration: '20 min',
        content: `The vertex of a quadratic function f(x) = ax² + bx + c is at:

x = -b/(2a)

Once you find the x-coordinate, substitute back to find y:
y = f(-b/(2a))

The vertex form is: f(x) = a(x - h)² + k
where (h, k) is the vertex.`,
        examples: [
          'For f(x) = x² - 6x + 8: vertex at (3, -1)',
          'For f(x) = -x² + 4x - 3: vertex at (2, 1)',
          'For f(x) = 2x² - 8x + 6: vertex at (2, -2)'
        ]
      },
      {
        id: 3,
        title: 'Solving Quadratic Equations',
        duration: '25 min',
        content: `There are several methods to solve quadratic equations:

1. Factoring: ax² + bx + c = (px + q)(rx + s)
2. Quadratic Formula: x = (-b ± √(b² - 4ac))/(2a)
3. Completing the Square
4. Graphing

The discriminant b² - 4ac tells us:
• If > 0: two real solutions
• If = 0: one real solution
• If < 0: no real solutions`,
        examples: [
          'x² - 5x + 6 = 0 → (x-2)(x-3) = 0',
          'x² - 4x + 4 = 0 → (x-2)² = 0',
          'x² + x + 1 = 0 → no real solutions'
        ]
      },
      {
        id: 4,
        title: 'Graphing Parabolas',
        duration: '30 min',
        content: `To graph a quadratic function:

1. Find the vertex
2. Determine the direction (opens up/down)
3. Find the y-intercept (set x = 0)
4. Find x-intercepts (set y = 0)
5. Plot additional points
6. Draw the parabola

Key features:
• Axis of symmetry: x = -b/(2a)
• Domain: all real numbers
• Range: depends on vertex and direction`,
        examples: [
          'y = x² - 4x + 3 has vertex (2, -1)',
          'y = -x² + 2x + 3 has vertex (1, 4)',
          'y = 2x² - 4x + 5 has vertex (1, 3)'
        ]
      },
      {
        id: 5,
        title: 'Applications and Word Problems',
        duration: '35 min',
        content: `Quadratic functions appear in many real-world situations:

• Projectile motion: h(t) = -16t² + v₀t + h₀
• Area optimization problems
• Revenue and profit functions
• Engineering and physics

Problem-solving steps:
1. Identify the given information
2. Set up the quadratic equation
3. Solve using appropriate method
4. Check the solution in context`,
        examples: [
          'A ball thrown upward: h(t) = -16t² + 32t + 6',
          'Rectangle area: A = x(20-x)',
          'Profit function: P(x) = -x² + 100x - 1500'
        ]
      }
    ],
    quiz: [
      {
        question: 'What are the solutions to x² - 7x + 12 = 0?',
        options: ['x = 2, 6', 'x = 3, 4', 'x = 1, 12', 'x = -3, -4'],
        correct: 1,
      },
      {
        question: 'If the discriminant D = 25, how many real solutions does the equation have?',
        options: ['0', '1', '2', '3'],
        correct: 2,
      },
      {
        question: 'What is the vertex of y = x² - 6x + 5?',
        options: ['(3, -4)', '(3, 4)', '(-3, -4)', '(-3, 4)'],
        correct: 0,
      },
      {
        question: 'Which direction does y = -2x² + 4x - 1 open?',
        options: ['Upward', 'Downward', 'Left', 'Right'],
        correct: 1,
      },
      {
        question: 'What is the axis of symmetry for y = 3x² - 12x + 7?',
        options: ['x = 2', 'x = -2', 'x = 4', 'x = -4'],
        correct: 0,
      }
    ]
  });

  const currentLesson = courseData.lessons[currentLessonIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextLesson = () => {
    if (currentLessonIndex < courseData.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setLessonProgress(0);
    } else {
      // Course completion
      Alert.alert(
        'Congratulations! 🎉',
        `You have completed ${courseData.chapter}!\n\nTotal study time: ${formatTime(studyTime)}`,
        [
          {
            text: 'Go to Dashboard',
            onPress: () => navigation.navigate('StudentDashboard'),
          },
          {
            text: 'View Progress',
            onPress: () => navigation.navigate('Progress'),
          },
        ]
      );
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setLessonProgress(100);
    }
  };

  const startQuiz = () => {
    if (lessonProgress < 100) {
      Alert.alert('Notice', 'Please complete the lesson before starting the quiz.');
      return;
    }
    setShowQuiz(true);
  };

  const submitQuiz = () => {
    const totalQuestions = courseData.quiz.length;
    let correct = 0;
    
    courseData.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });

    const score = Math.round((correct / totalQuestions) * 100);
    setQuizScore(score);
    setShowQuiz(false);

    setTimeout(() => {
      Alert.alert(
        'Quiz Results',
        `Score: ${score} points (${correct}/${totalQuestions})\n\n${score >= 80 ? 'Excellent work! 🎉' : 'Please review the material again. 📚'}`,
        [
          { text: 'OK', onPress: () => nextLesson() }
        ]
      );
    }, 500);
  };

  const selectQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const completeLesson = () => {
    setLessonProgress(100);
    Alert.alert(
      'Lesson Complete!',
      'You have completed this lesson. Try the quiz now!',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.courseTitle}>{courseData.title}</Text>
          <Text style={styles.chapterTitle}>{courseData.chapter}</Text>
        </View>
        <Text style={styles.studyTime}>{formatTime(studyTime)}</Text>
      </View>

      {/* Progress Indicators */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Overall Progress: {Math.round(((currentLessonIndex) / courseData.lessons.length) * 100)}%
          </Text>
          <Text style={styles.progressText}>
            Current Lesson: {lessonProgress}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentLessonIndex + lessonProgress/100) / courseData.lessons.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      {/* Quiz Modal */}
      <Modal visible={showQuiz} animationType="slide">
        <View style={styles.quizContainer}>
          <View style={styles.quizHeader}>
            <Text style={styles.quizTitle}>Quiz Time! 📝</Text>
            <TouchableOpacity onPress={() => setShowQuiz(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.quizContent}>
            {courseData.quiz.map((question, questionIndex) => (
              <View key={questionIndex} style={styles.questionContainer}>
                <Text style={styles.questionNumber}>Question {questionIndex + 1}</Text>
                <Text style={styles.questionText}>{question.question}</Text>
                
                {question.options.map((option, optionIndex) => (
                  <TouchableOpacity
                    key={optionIndex}
                    style={[
                      styles.optionButton,
                      quizAnswers[questionIndex] === optionIndex && styles.selectedOption
                    ]}
                    onPress={() => selectQuizAnswer(questionIndex, optionIndex)}
                  >
                    <Text style={[
                      styles.optionText,
                      quizAnswers[questionIndex] === optionIndex && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonNumber}>Lesson {currentLesson.id}</Text>
          <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
          <Text style={styles.lessonDuration}>
            <Ionicons name="time" size={14} color="#666" /> {currentLesson.duration}
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>📚 Learning Content</Text>
          <Text style={styles.contentText}>{currentLesson.content}</Text>
          
          {currentLesson.examples && (
            <View style={styles.examplesSection}>
              <Text style={styles.examplesTitle}>💡 Examples:</Text>
              {currentLesson.examples.map((example, index) => (
                <Text key={index} style={styles.exampleText}>• {example}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          {lessonProgress < 100 ? (
            <TouchableOpacity style={styles.completeButton} onPress={completeLesson}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.completeButtonText}>Complete Lesson</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.quizButton} onPress={startQuiz}>
              <Ionicons name="help-circle" size={20} color="white" />
              <Text style={styles.quizButtonText}>Take Quiz</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentLessonIndex === 0 && styles.navButtonDisabled]}
          onPress={previousLesson}
          disabled={currentLessonIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentLessonIndex === 0 ? "#ccc" : "#4A90E2"} />
          <Text style={[styles.navButtonText, currentLessonIndex === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.lessonIndicator}>
          <Text style={styles.indicatorText}>
            {currentLessonIndex + 1} / {courseData.lessons.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, lessonProgress < 100 && styles.navButtonDisabled]}
          onPress={nextLesson}
          disabled={lessonProgress < 100}
        >
          <Text style={[styles.navButtonText, lessonProgress < 100 && styles.navButtonTextDisabled]}>
            Next
          </Text>
          <Ionicons name="chevron-forward" size={20} color={lessonProgress < 100 ? "#ccc" : "#4A90E2"} />
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chapterTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  studyTime: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  progressContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  lessonHeader: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  lessonNumber: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lessonDuration: {
    fontSize: 14,
    color: '#666',
  },
  contentSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  examplesSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  actionButtons: {
    padding: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 8,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  lessonIndicator: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  indicatorText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quizContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quizContent: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#4A90E2',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LearningScreen;
