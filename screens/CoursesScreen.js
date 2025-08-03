// screens/CoursesScreen.js
// OmniEdu Global Tutor - All Courses Management with API Integration

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
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CoursesScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedGrade, setSelectedGrade] = useState('K8');
    const [selectedDifficulty, setSelectedDifficulty] = useState('INTERMEDIATE');
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);

    // API에서 가져올 데이터
    const [allCourses, setAllCourses] = useState([]);
    const [availableGrades, setAvailableGrades] = useState([]);
    const [availableDifficulties, setAvailableDifficulties] = useState([]);
    const [sampleCurriculum, setSampleCurriculum] = useState({});

    const categories = ['All', 'Mathematics', 'English', 'Science', 'History', 'Arts'];

    // API Base URL
    const API_BASE = 'https://omnieduglobal.com/api/curriculum';

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // 학년 및 난이도 목록 불러오기
            await Promise.all([
                loadAvailableGrades(),
                loadAvailableDifficulties(),
                loadSampleCourses()
            ]);

        } catch (error) {
            console.error('Failed to load initial data:', error);
            Alert.alert('Error', 'Failed to load course data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableGrades = async () => {
        try {
            const response = await fetch(`${API_BASE}/grades`);
            const data = await response.json();
            if (data.success) {
                setAvailableGrades(data.data);
            }
        } catch (error) {
            console.error('Failed to load grades:', error);
        }
    };

    const loadAvailableDifficulties = async () => {
        try {
            const response = await fetch(`${API_BASE}/difficulties`);
            const data = await response.json();
            if (data.success) {
                setAvailableDifficulties(data.data);
            }
        } catch (error) {
            console.error('Failed to load difficulties:', error);
        }
    };

    const loadSampleCourses = async () => {
        try {
            // 기본 샘플 코스들 생성
            const sampleCourses = [
                {
                    id: 1,
                    title: 'Mathematics',
                    subtitle: 'Numbers, Operations, and Problem Solving',
                    category: 'Mathematics',
                    level: selectedDifficulty,
                    duration: '2 weeks (Trial)',
                    lessons: 'AI-Generated',
                    students: 1247,
                    rating: 4.8,
                    price: 'FREE TRIAL',
                    progress: 0,
                    color: '#4A90E2',
                    icon: 'calculator',
                    hasAPI: true,
                },
                {
                    id: 2,
                    title: 'English Communication',
                    subtitle: 'Speaking, Listening, and Conversation Skills',
                    category: 'English',
                    level: selectedDifficulty,
                    duration: '2 weeks (Trial)',
                    lessons: 'AI-Generated',
                    students: 892,
                    rating: 4.9,
                    price: 'FREE TRIAL',
                    progress: 0,
                    color: '#50C878',
                    icon: 'chatbubbles',
                    hasAPI: true,
                },
                {
                    id: 3,
                    title: 'Science Discovery',
                    subtitle: 'Scientific Method and Virtual Experiments',
                    category: 'Science',
                    level: selectedDifficulty,
                    duration: '2 weeks (Trial)',
                    lessons: 'AI-Generated',
                    students: 654,
                    rating: 4.7,
                    price: 'FREE TRIAL',
                    progress: 0,
                    color: '#FF6B6B',
                    icon: 'flask',
                    hasAPI: true,
                },
                {
                    id: 4,
                    title: 'World History',
                    subtitle: 'Ancient Civilizations and Cultural Heritage',
                    category: 'History',
                    level: selectedDifficulty,
                    duration: '2 weeks (Trial)',
                    lessons: 'AI-Generated',
                    students: 456,
                    rating: 4.6,
                    price: 'FREE TRIAL',
                    progress: 0,
                    color: '#9B59B6',
                    icon: 'library',
                    hasAPI: true,
                },

                // 추가할 Arts 코스
                {
                    id: 5,
                    title: 'Creative Arts',
                    subtitle: 'Visual Arts, Music, and Digital Creation',
                    category: 'Arts',
                    level: selectedDifficulty,
                    duration: '2 weeks (Trial)',
                    lessons: 'AI-Generated',
                    students: 324,
                    rating: 4.7,
                    price: 'FREE TRIAL',
                    progress: 0,
                    color: '#E67E22',
                    icon: 'color-palette',
                    hasAPI: true,
                },
                // 프리미엄 코스들
                {
                    id: 6,
                    title: 'Advanced Calculus',
                    subtitle: 'Derivatives, Integrals, and Applications',
                    category: 'Mathematics',
                    level: 'Advanced',
                    duration: '12 weeks',
                    lessons: 48,
                    students: 423,
                    rating: 4.8,
                    price: 'PREMIUM',
                    progress: 0,
                    color: '#4A90E2',
                    icon: 'calculator',
                },
                {
                    id: 7,
                    title: 'Academic Writing',
                    subtitle: 'Essays, Research Papers, and Citations',
                    category: 'English',
                    level: 'Advanced',
                    duration: '10 weeks',
                    lessons: 35,
                    students: 567,
                    rating: 4.9,
                    price: 'PREMIUM',
                    progress: 0,
                    color: '#50C878',
                    icon: 'document-text',
                }
            ];

            setAllCourses(sampleCourses);
        } catch (error) {
            console.error('Failed to load sample courses:', error);
        }
    };

    const loadSampleCurriculum = async (subject) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/samples/${subject}/${selectedGrade}/${selectedDifficulty}`);
            const data = await response.json();

            if (data.success) {
                setSampleCurriculum(prev => ({
                    ...prev,
                    [subject]: data.data
                }));

                // 샘플 커리큘럼 표시
                Alert.alert(
                    `${subject.charAt(0).toUpperCase() + subject.slice(1)} Sample`,
                    `${data.data.title}\n\n${data.data.description}\n\nDuration: ${data.data.duration}\nTopics: ${data.data.week1?.topics?.join(', ') || 'Various topics'}`,
                    [
                        { text: 'Close', style: 'cancel' },
                        {
                            text: 'Start Trial',
                            onPress: () => startTrialCourse(subject, data.data)
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Failed to load sample curriculum:', error);
            Alert.alert('Error', 'Failed to load sample curriculum');
        } finally {
            setLoading(false);
        }
    };

    const startTrialCourse = (subject, curriculumData) => {
        navigation.navigate('Learning', {
            courseId: `trial_${subject}`,
            courseTitle: curriculumData.title,
            subject: subject,
            chapter: curriculumData.week1?.title || 'Week 1',
            isTrialMode: true,
            curriculumData: curriculumData
        });
    };

    const filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const onRefresh = async () => {
        setRefreshing(true);
        await loadInitialData();
        setRefreshing(false);
    };

    const enrollCourse = (course) => {
        if (course.price === 'PREMIUM') {
            Alert.alert(
                'Premium Course',
                `${course.title} is a premium course.\nPremium subscription required.`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Upgrade to Premium',
                        onPress: () => navigation.navigate('Premium')
                    }
                ]
            );
        } else if (course.hasAPI) {
            // API 기반 샘플 코스
            const subjectMap = {
                'Mathematics': 'math',
                'English': 'english',
                'Science': 'science',
                'History': 'history',    // ← 추가
                'Arts': 'arts'           // ← 추가
            };
            const apiSubject = subjectMap[course.category];
            if (apiSubject) {
                loadSampleCurriculum(apiSubject);
            }
        } else {
            // 기존 방식
            Alert.alert(
                'Enroll Course',
                `Would you like to start ${course.title}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Start Learning',
                        onPress: () => {
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
        }
    };

    const renderCourseCard = (course) => (
        <View key={course.id} style={[styles.courseCard, { borderLeftColor: course.color }]}>
            <View style={styles.courseHeader}>
                <View style={[styles.courseIcon, { backgroundColor: course.color }]}>
                    <Ionicons name={course.icon} size={24} color="white" />
                </View>
                <View style={styles.courseInfo}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
                    <View style={styles.courseMeta}>
                        <Text style={styles.metaText}>
                            <Ionicons name="time" size={12} color="#666" /> {course.duration}
                        </Text>
                        <Text style={styles.metaText}>
                            <Ionicons name="book" size={12} color="#666" /> {course.lessons} lessons
                        </Text>
                        <Text style={styles.metaText}>
                            <Ionicons name="people" size={12} color="#666" /> {course.students}
                        </Text>
                    </View>
                </View>
                <View style={styles.coursePrice}>
                    <Text style={[
                        styles.priceText,
                        course.price === 'PREMIUM' ? styles.premiumPrice : styles.freePrice
                    ]}>
                        {course.price}
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{course.rating}</Text>
                    </View>
                </View>
            </View>

            {course.progress > 0 && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{course.progress}% Complete</Text>
                </View>
            )}

            <View style={styles.courseActions}>
                {course.hasAPI && (
                    <TouchableOpacity
                        style={styles.previewButton}
                        onPress={() => {
                            const subjectMap = {
                                'Mathematics': 'math',
                                'English': 'english',
                                'Science': 'science',
                                'History': 'history',     // ← 추가
                                'Arts': 'arts'           // ← 추가
                            };
                            const apiSubject = subjectMap[course.category];
                            if (apiSubject) {
                                loadSampleCurriculum(apiSubject);
                            }
                        }}
                    >
                        <Ionicons name="eye" size={16} color="#4A90E2" />
                        <Text style={styles.previewButtonText}>Preview Sample</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.enrollButton,
                        course.price === 'PREMIUM' ? styles.premiumButton : styles.freeButton
                    ]}
                    onPress={() => enrollCourse(course)}
                >
                    <Text style={[
                        styles.enrollButtonText,
                        course.price === 'PREMIUM' ? styles.premiumButtonText : styles.freeButtonText
                    ]}>
                        {course.progress > 0 ? 'Continue' :
                            course.price === 'PREMIUM' ? 'Upgrade Required' : 'Start Trial'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Loading Courses...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>All Courses</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search and Filters */}
            <View style={styles.filterContainer}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map(category => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category && styles.selectedCategory
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.selectedCategoryText
                                ]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Grade and Difficulty Selectors */}
                <View style={styles.selectorRow}>
                    <TouchableOpacity
                        style={styles.selectorButton}
                        onPress={() => setShowGradeModal(true)}
                    >
                        <Text style={styles.selectorText}>Grade: {selectedGrade}</Text>
                        <Ionicons name="chevron-down" size={16} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.selectorButton}
                        onPress={() => setShowDifficultyModal(true)}
                    >
                        <Text style={styles.selectorText}>Level: {selectedDifficulty}</Text>
                        <Ionicons name="chevron-down" size={16} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.coursesList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredCourses.map(renderCourseCard)}
            </ScrollView>

            {/* Grade Selection Modal */}
            <Modal visible={showGradeModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Grade Level</Text>
                        <ScrollView style={styles.modalList}>
                            {availableGrades.map(grade => (
                                <TouchableOpacity
                                    key={grade}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedGrade(grade);
                                        setShowGradeModal(false);
                                        loadSampleCourses();
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{grade}</Text>
                                    {selectedGrade === grade && (
                                        <Ionicons name="checkmark" size={20} color="#4A90E2" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowGradeModal(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Difficulty Selection Modal */}
            <Modal visible={showDifficultyModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Difficulty Level</Text>
                        <ScrollView style={styles.modalList}>
                            {availableDifficulties.map(difficulty => (
                                <TouchableOpacity
                                    key={difficulty}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setSelectedDifficulty(difficulty);
                                        setShowDifficultyModal(false);
                                        loadSampleCourses();
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{difficulty}</Text>
                                    {selectedDifficulty === difficulty && (
                                        <Ionicons name="checkmark" size={20} color="#4A90E2" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setShowDifficultyModal(false)}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    filterContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    filterRow: {
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
    },
    selectedCategory: {
        backgroundColor: '#4A90E2',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    selectedCategoryText: {
        color: 'white',
    },
    selectorRow: {
        flexDirection: 'row',
        gap: 12,
    },
    selectorButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    selectorText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    coursesList: {
        flex: 1,
        padding: 16,
    },
    courseCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    courseHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    courseIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    courseInfo: {
        flex: 1,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    courseSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    courseMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
    },
    coursePrice: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    freePrice: {
        color: '#27ae60',
    },
    premiumPrice: {
        color: '#e74c3c',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#eee',
        borderRadius: 2,
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
    },
    courseActions: {
        flexDirection: 'row',
        gap: 12,
    },
    previewButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#4A90E2',
        gap: 6,
    },
    previewButtonText: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '500',
    },
    enrollButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    freeButton: {
        backgroundColor: '#4A90E2',
    },
    premiumButton: {
        backgroundColor: '#FFA726',
    },
    enrollButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    freeButtonText: {
        color: 'white',
    },
    premiumButtonText: {
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalList: {
        maxHeight: 300,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalCloseButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#4A90E2',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCloseText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CoursesScreen;
