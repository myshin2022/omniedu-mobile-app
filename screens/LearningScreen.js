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

// 🎯 임시로 courseData를 파일 안에 직접 넣어서 테스트
const mathCourseData = {
  id: 1,
  title: 'Algebra II - Advanced Functions',
  subject: 'Math',
  chapter: 'Quadratic Functions & Applications',
  instructor: 'Dr. Sarah Johnson',
  totalLessons: 5,
  currentLesson: 3,
  progress: 60,
  difficulty: 'Intermediate',
  estimatedTime: '2 hours 5 minutes',

  lessons: [
    {
      id: 1,
      title: 'Introduction to Quadratic Functions',
      duration: '15 minutes',
      type: 'video',
      completed: true,
      content: {
        description: 'Learn the basic form of quadratic functions and their key characteristics.',
        keyPoints: [
          'Standard form: f(x) = ax² + bx + c',
          'Vertex form: f(x) = a(x-h)² + k',
          'Identifying coefficients and their meanings',
          'Domain and range of quadratic functions'
        ],
        examples: [
          'f(x) = 2x² + 3x - 1',
          'g(x) = -(x-2)² + 5'
        ]
      }
    },
    {
      id: 2,
      title: 'Graphing Quadratic Functions',
      duration: '20 minutes',
      type: 'interactive',
      completed: true,
      content: {
        description: 'Master the techniques for graphing parabolas and identifying key features.',
        keyPoints: [
          'Finding the vertex using -b/2a',
          'Determining axis of symmetry',
          'Finding x and y intercepts',
          'Understanding the direction of opening'
        ],
        examples: [
          'Graph f(x) = x² - 4x + 3',
          'Graph g(x) = -2x² + 8x - 6'
        ]
      }
    },
    {
      id: 3,
      title: 'Solving Quadratic Equations',
      duration: '25 minutes',
      type: 'practice',
      completed: false,
      content: {
        description: 'Learn multiple methods to solve quadratic equations effectively.',
        keyPoints: [
          'Factoring method',
          'Quadratic formula: x = (-b ± √(b²-4ac))/2a',
          'Completing the square',
          'Using the discriminant to determine number of solutions'
        ],
        examples: [
          'Solve: x² - 5x + 6 = 0',
          'Solve: 2x² + 7x - 4 = 0'
        ]
      }
    },
    {
      id: 4,
      title: 'Applications of Quadratic Functions',
      duration: '30 minutes',
      type: 'problem-solving',
      completed: false,
      content: {
        description: 'Apply quadratic functions to solve real-world problems.',
        keyPoints: [
          'Projectile motion problems',
          'Area and perimeter optimization',
          'Business profit/revenue models',
          'Physics applications'
        ],
        examples: [
          'A ball thrown upward: h(t) = -16t² + 64t + 5',
          'Maximizing rectangular area with fixed perimeter'
        ]
      }
    },
    {
      id: 5,
      title: 'Advanced Topics & Review',
      duration: '35 minutes',
      type: 'assessment',
      completed: false,
      content: {
        description: 'Explore complex quadratic relationships and prepare for assessments.',
        keyPoints: [
          'Systems involving quadratic equations',
          'Quadratic inequalities',
          'Transformation of quadratic functions',
          'Connecting to higher-level mathematics'
        ],
        examples: [
          'Solve system: y = x² + 2x - 3 and y = 2x + 1',
          'Graph inequality: y ≥ x² - 4x + 3'
        ]
      }
    }
  ],

  quiz: {
    title: 'Quadratic Functions Assessment',
    questions: [
      {
        id: 1,
        question: 'What is the vertex of the quadratic function f(x) = 2x² - 8x + 5?',
        options: [
          '(2, -3)',
          '(4, 5)',
          '(-2, 29)',
          '(2, 5)'
        ],
        correct: 0,
        explanation: 'Using the vertex formula x = -b/2a = -(-8)/(2×2) = 2, then f(2) = 2(4) - 8(2) + 5 = -3'
      },
      {
        id: 2,
        question: 'How many real solutions does the equation x² - 6x + 9 = 0 have?',
        options: [
          'No real solutions',
          'One real solution',
          'Two real solutions',
          'Infinitely many solutions'
        ],
        correct: 1,
        explanation: 'The discriminant b² - 4ac = 36 - 36 = 0, indicating exactly one real solution (a perfect square)'
      },
      {
        id: 3,
        question: 'Which form makes it easiest to identify the vertex of a parabola?',
        options: [
          'Standard form: ax² + bx + c',
          'Factored form: a(x - r)(x - s)',
          'Vertex form: a(x - h)² + k',
          'Intercept form: a(x - p)(x - q)'
        ],
        correct: 2,
        explanation: 'Vertex form a(x - h)² + k directly shows the vertex at point (h, k)'
      },
      {
        id: 4,
        question: 'A projectile follows the path h(t) = -16t² + 48t + 64. What is the maximum height?',
        options: [
          '64 feet',
          '100 feet',
          '48 feet',
          '80 feet'
        ],
        correct: 1,
        explanation: 'The vertex occurs at t = -48/(2×-16) = 1.5, so h(1.5) = -16(2.25) + 48(1.5) + 64 = 100 feet'
      },
      {
        id: 5,
        question: 'Which quadratic function opens downward and has vertex at (3, 7)?',
        options: [
          'f(x) = 2(x - 3)² + 7',
          'f(x) = -(x - 3)² + 7',
          'f(x) = (x + 3)² - 7',
          'f(x) = -2(x + 3)² - 7'
        ],
        correct: 1,
        explanation: 'Negative coefficient makes it open downward, and vertex form (x - 3)² + 7 places vertex at (3, 7)'
      }
    ]
  }
};

const englishCourseData = {
  id: 2,
  title: 'English 10 - Literature & Composition',
  subject: 'English',
  chapter: 'Theme Analysis in Literature',
  instructor: 'Ms. Emily Carter',
  totalLessons: 5,
  currentLesson: 2,
  progress: 40,
  difficulty: 'Intermediate',
  estimatedTime: '2 hours 5 minutes',

  lessons: [
    {
      id: 1,
      title: 'Understanding Theme vs. Topic',
      duration: '15 minutes',
      type: 'video',
      completed: true,
      content: {
        description: 'Learn to distinguish between theme and topic in literary works.',
        keyPoints: [
          'Topic: What the story is about (subject matter)',
          'Theme: What the story says about life (universal message)',
          'Themes are complete statements, not single words',
          'Multiple themes can exist in one work'
        ],
        examples: [
          'Topic: War → Theme: War destroys innocence',
          'Topic: Love → Theme: True love requires sacrifice'
        ]
      }
    },
    {
      id: 2,
      title: 'Methods for Identifying Themes',
      duration: '20 minutes',
      type: 'interactive',
      completed: true,
      content: {
        description: 'Master techniques for discovering themes in literary texts.',
        keyPoints: [
          'Analyze character development and change',
          'Examine recurring symbols and motifs',
          'Look for patterns in dialogue and conflict',
          'Consider the resolution and its implications'
        ],
        examples: [
          'Character arc analysis in Romeo and Juliet',
          'Symbolic analysis of the mockingbird in Harper Lee\'s work'
        ]
      }
    },
    {
      id: 3,
      title: 'Theme Analysis: "The Outsiders"',
      duration: '25 minutes',
      type: 'analysis',
      completed: false,
      content: {
        description: 'Apply theme analysis techniques to S.E. Hinton\'s classic novel.',
        keyPoints: [
          'Brotherhood and loyalty among the greasers',
          'Social class divisions and their consequences',
          'Loss of innocence through violence',
          'The power of literature and storytelling'
        ],
        examples: [
          'Ponyboy\'s relationship with his brothers',
          'The symbolism of "staying gold"'
        ]
      }
    },
    {
      id: 4,
      title: 'Character Development and Theme',
      duration: '30 minutes',
      type: 'discussion',
      completed: false,
      content: {
        description: 'Explore how character growth reveals and reinforces themes.',
        keyPoints: [
          'Protagonist journey and theme revelation',
          'Foil characters highlighting themes',
          'Character motivations and thematic purpose',
          'Dynamic vs. static characters in theme development'
        ],
        examples: [
          'Scout Finch\'s moral development',
          'Jay Gatsby\'s pursuit of the American Dream'
        ]
      }
    },
    {
      id: 5,
      title: 'Writing Theme Analysis Essays',
      duration: '35 minutes',
      type: 'writing',
      completed: false,
      content: {
        description: 'Learn to craft compelling essays analyzing literary themes.',
        keyPoints: [
          'Developing a clear thesis statement about theme',
          'Using textual evidence effectively',
          'Organizing analysis with topic sentences',
          'Connecting themes to broader human experience'
        ],
        examples: [
          'Sample thesis: "In To Kill a Mockingbird, Harper Lee demonstrates that moral courage..."',
          'Effective quote integration and analysis'
        ]
      }
    }
  ],

  quiz: {
    title: 'Theme Analysis Assessment',
    questions: [
      {
        id: 1,
        question: 'Which of the following is a theme, not just a topic?',
        options: [
          'Friendship',
          'The Civil War',
          'Friendship requires personal sacrifice',
          'High school students'
        ],
        correct: 2,
        explanation: 'A theme is a complete statement about life, while topics are just subjects. "Friendship requires personal sacrifice" expresses a universal truth.'
      },
      {
        id: 2,
        question: 'In "Romeo and Juliet," what theme is revealed through the feuding families?',
        options: [
          'Love conquers all obstacles',
          'Hatred destroys both enemies and innocents',
          'Young people make poor decisions',
          'Italy is a beautiful country'
        ],
        correct: 1,
        explanation: 'The family feud ultimately destroys the young lovers and forces the families to recognize the cost of their hatred.'
      },
      {
        id: 3,
        question: 'Which literary element is MOST helpful for identifying theme?',
        options: [
          'Setting descriptions',
          'Character development and change',
          'Rhyme scheme',
          'Chapter length'
        ],
        correct: 1,
        explanation: 'Character development and change most directly reveal the author\'s message about life and human nature.'
      },
      {
        id: 4,
        question: 'A good theme analysis essay should:',
        options: [
          'Summarize the entire plot',
          'Focus only on the main character',
          'Connect the theme to universal human experiences',
          'Avoid using quotes from the text'
        ],
        correct: 2,
        explanation: 'Strong theme analysis connects the specific literary work to broader truths about human nature and experience.'
      },
      {
        id: 5,
        question: 'In "The Outsiders," what does "Stay gold" symbolically represent?',
        options: [
          'Wealth and material success',
          'Preserving innocence and beauty in a harsh world',
          'The color of Ponyboy\'s hair',
          'Gang loyalty and brotherhood'
        ],
        correct: 1,
        explanation: 'The phrase comes from Robert Frost\'s poem and represents maintaining innocence and goodness despite life\'s difficulties.'
      }
    ]
  }
};

// Science Course Data
const scienceCourseData = {
  id: 3,
  title: 'Chemistry I - High School Track',
  subject: 'Science',
  chapter: 'Atomic Structure & Periodic Trends',
  instructor: 'Dr. Michael Chen',
  totalLessons: 5,
  currentLesson: 1,
  progress: 20,
  difficulty: 'Beginner',
  estimatedTime: '2 hours 5 minutes',

  lessons: [
    {
      id: 1,
      title: 'Basic Atomic Structure',
      duration: '15 minutes',
      type: 'video',
      completed: true,
      content: {
        description: 'Explore the fundamental particles that make up atoms.',
        keyPoints: [
          'Protons: positive charge, located in nucleus',
          'Neutrons: no charge, located in nucleus',
          'Electrons: negative charge, orbit the nucleus',
          'Atomic mass vs. atomic number'
        ],
        examples: [
          'Carbon atom: 6 protons, 6 neutrons, 6 electrons',
          'Oxygen atom: 8 protons, 8 neutrons, 8 electrons'
        ]
      }
    },
    {
      id: 2,
      title: 'Atomic Number and Isotopes',
      duration: '20 minutes',
      type: 'interactive',
      completed: false,
      content: {
        description: 'Learn how atomic number defines elements and understand isotopes.',
        keyPoints: [
          'Atomic number = number of protons',
          'Isotopes have same protons, different neutrons',
          'Mass number = protons + neutrons',
          'Radioactive vs. stable isotopes'
        ],
        examples: [
          'Carbon-12 vs. Carbon-14',
          'Uranium-235 vs. Uranium-238'
        ]
      }
    },
    {
      id: 3,
      title: 'Organization of the Periodic Table',
      duration: '25 minutes',
      type: 'exploration',
      completed: false,
      content: {
        description: 'Understand how elements are organized and periodic trends.',
        keyPoints: [
          'Periods (rows) and groups (columns)',
          'Atomic radius trends across periods and groups',
          'Ionization energy patterns',
          'Electronegativity trends'
        ],
        examples: [
          'Alkali metals (Group 1) properties',
          'Noble gases (Group 18) characteristics'
        ]
      }
    },
    {
      id: 4,
      title: 'Introduction to Chemical Bonding',
      duration: '30 minutes',
      type: 'problem-solving',
      completed: false,
      content: {
        description: 'Explore how atoms combine to form compounds.',
        keyPoints: [
          'Ionic bonding: transfer of electrons',
          'Covalent bonding: sharing of electrons',
          'Metallic bonding in pure metals',
          'Predicting bond types using electronegativity'
        ],
        examples: [
          'Formation of sodium chloride (NaCl)',
          'Water molecule (H₂O) covalent bonds'
        ]
      }
    },
    {
      id: 5,
      title: 'Real-World Applications',
      duration: '35 minutes',
      type: 'application',
      completed: false,
      content: {
        description: 'Connect atomic theory to modern technology and medicine.',
        keyPoints: [
          'Medical imaging using radioactive isotopes',
          'Semiconductor technology and pure silicon',
          'Nuclear energy and atomic structure',
          'Nanotechnology and atomic manipulation'
        ],
        examples: [
          'PET scans using fluorine-18',
          'Computer chips and doped silicon'
        ]
      }
    }
  ],

  quiz: {
    title: 'Atomic Structure Assessment',
    questions: [
      {
        id: 1,
        question: 'What determines the identity of an element?',
        options: [
          'Number of neutrons',
          'Number of electrons',
          'Number of protons',
          'Atomic mass'
        ],
        correct: 2,
        explanation: 'The number of protons (atomic number) uniquely identifies each element on the periodic table.'
      },
      {
        id: 2,
        question: 'Carbon-12 and Carbon-14 are:',
        options: [
          'Different elements',
          'Isotopes of carbon',
          'Ions of carbon',
          'Compounds containing carbon'
        ],
        correct: 1,
        explanation: 'Isotopes are atoms of the same element with different numbers of neutrons. Both have 6 protons but different neutron counts.'
      },
      {
        id: 3,
        question: 'As you move from left to right across a period, atomic radius generally:',
        options: [
          'Increases',
          'Decreases',
          'Stays the same',
          'Increases then decreases'
        ],
        correct: 1,
        explanation: 'Atomic radius decreases across a period because increasing nuclear charge pulls electrons closer to the nucleus.'
      },
      {
        id: 4,
        question: 'Which type of bonding occurs between sodium and chlorine in table salt?',
        options: [
          'Covalent bonding',
          'Metallic bonding',
          'Ionic bonding',
          'Hydrogen bonding'
        ],
        correct: 2,
        explanation: 'Sodium loses an electron to chlorine, forming Na⁺ and Cl⁻ ions that are held together by ionic bonding.'
      },
      {
        id: 5,
        question: 'Which application uses radioactive isotopes in medicine?',
        options: [
          'X-ray imaging',
          'PET scans',
          'Ultrasound',
          'MRI scans'
        ],
        correct: 1,
        explanation: 'PET (Positron Emission Tomography) scans use radioactive isotopes like fluorine-18 to create detailed body images.'
      }
    ]
  }
};

// History Course Data
const historyCourseData = {
  id: 4,
  title: 'World History - Ancient Civilizations',
  subject: 'History',
  chapter: 'Ancient Greece & Democracy',
  instructor: 'Professor Lisa Thompson',
  totalLessons: 5,
  currentLesson: 4,
  progress: 80,
  difficulty: 'Intermediate',
  estimatedTime: '2 hours 5 minutes',

  lessons: [
    {
      id: 1,
      title: 'The Rise of Ancient Greece',
      duration: '15 minutes',
      type: 'video',
      completed: true,
      content: {
        description: 'Explore the geographical and cultural foundations of Greek civilization.',
        keyPoints: [
          'Geographic influence: mountains and seas',
          'City-state (polis) system development',
          'Key early settlements and trade networks',
          'The concept of citizenship emerges'
        ],
        examples: [
          'Athens and Sparta as contrasting city-states',
          'Greek colonization around the Mediterranean'
        ]
      }
    },
    {
      id: 2,
      title: 'Athenian Democracy vs. Modern Democracy',
      duration: '20 minutes',
      type: 'comparison',
      completed: true,
      content: {
        description: 'Compare ancient Athenian democracy with contemporary democratic systems.',
        keyPoints: [
          'Direct vs. representative democracy',
          'Citizenship requirements and exclusions',
          'Role of the Assembly (Ecclesia)',
          'Ostracism as a democratic tool'
        ],
        examples: [
          'Pericles and the Golden Age of Athens',
          'The trial of Socrates and democratic justice'
        ]
      }
    },
    {
      id: 3,
      title: 'Greek Philosophy and Intellectual Legacy',
      duration: '25 minutes',
      type: 'discussion',
      completed: true,
      content: {
        description: 'Examine the philosophical foundations laid by Greek thinkers.',
        keyPoints: [
          'Socrates and the Socratic method',
          'Plato\'s Academy and ideal forms',
          'Aristotle\'s scientific approach',
          'Impact on Western thought and education'
        ],
        examples: [
          'The Allegory of the Cave',
          'Aristotelian logic and classification'
        ]
      }
    },
    {
      id: 4,
      title: 'Greek Culture, Arts, and Daily Life',
      duration: '30 minutes',
      type: 'cultural',
      completed: true,
      content: {
        description: 'Discover the cultural achievements and daily experiences of ancient Greeks.',
        keyPoints: [
          'Olympic Games and athletic competition',
          'Theater: tragedy and comedy',
          'Architecture: columns and proportions',
          'Religion and mythology in daily life'
        ],
        examples: [
          'The Parthenon and Doric architecture',
          'Plays by Sophocles and Aristophanes'
        ]
      }
    },
    {
      id: 5,
      title: 'Greek Legacy in the Modern World',
      duration: '35 minutes',
      type: 'synthesis',
      completed: false,
      content: {
        description: 'Analyze how Greek contributions continue to influence contemporary society.',
        keyPoints: [
          'Democratic principles in modern governments',
          'Scientific method and rational inquiry',
          'Architectural influence on government buildings',
          'Olympic Games revival and international cooperation'
        ],
        examples: [
          'U.S. Capitol building design',
          'Modern Olympic movement since 1896'
        ]
      }
    }
  ],

  quiz: {
    title: 'Ancient Greece Assessment',
    questions: [
      {
        id: 1,
        question: 'What was the basic political unit of ancient Greece?',
        options: [
          'Empire',
          'City-state (polis)',
          'Kingdom',
          'Province'
        ],
        correct: 1,
        explanation: 'The polis (city-state) was the fundamental political organization in ancient Greece, including both urban centers and surrounding countryside.'
      },
      {
        id: 2,
        question: 'How did Athenian democracy differ from modern democracy?',
        options: [
          'It was representative rather than direct',
          'It included all residents as citizens',
          'It was direct democracy limited to male citizens',
          'It had no voting system'
        ],
        correct: 2,
        explanation: 'Athenian democracy was direct (citizens voted directly on issues) but limited to free adult males, excluding women, slaves, and foreigners.'
      },
      {
        id: 3,
        question: 'Which philosopher is known for the teaching method of asking probing questions?',
        options: [
          'Plato',
          'Aristotle',
          'Socrates',
          'Pythagoras'
        ],
        correct: 2,
        explanation: 'Socrates developed the Socratic method, using systematic questioning to help students discover knowledge through their own reasoning.'
      },
      {
        id: 4,
        question: 'The ancient Olympic Games were held to honor which Greek god?',
        options: [
          'Apollo',
          'Zeus',
          'Athena',
          'Poseidon'
        ],
        correct: 1,
        explanation: 'The Olympic Games were held in Olympia every four years to honor Zeus, the king of the Greek gods.'
      },
      {
        id: 5,
        question: 'Which Greek architectural feature is commonly seen in modern government buildings?',
        options: [
          'Flying buttresses',
          'Pointed arches',
          'Classical columns',
          'Stained glass windows'
        ],
        correct: 2,
        explanation: 'Greek classical columns (Doric, Ionic, Corinthian) are widely used in modern government buildings to symbolize democratic ideals and classical learning.'
      }
    ]
  }
};

// Art Course Data
const artCourseData = {
  id: 5,
  title: 'Visual Arts I - Drawing & Design Fundamentals',
  subject: 'Art',
  chapter: 'Color Theory & Composition',
  instructor: 'Ms. Isabella Rodriguez',
  totalLessons: 5,
  currentLesson: 3,
  progress: 60,
  difficulty: 'Beginner',
  estimatedTime: '2 hours 5 minutes',

  lessons: [
    {
      id: 1,
      title: 'Introduction to Color Theory',
      duration: '15 minutes',
      type: 'demonstration',
      completed: true,
      content: {
        description: 'Learn the fundamental principles of color and how they interact.',
        keyPoints: [
          'Primary colors: Red, Blue, Yellow',
          'Secondary colors: Orange, Green, Purple',
          'Color temperature: Warm vs. Cool colors',
          'Color wheel relationships and harmony'
        ],
        examples: [
          'Complementary colors: Red and Green',
          'Analogous colors: Blue, Blue-green, Green'
        ]
      }
    },
    {
      id: 2,
      title: 'Understanding Value and Contrast',
      duration: '20 minutes',
      type: 'practice',
      completed: true,
      content: {
        description: 'Master the use of light and dark to create depth and interest.',
        keyPoints: [
          'Value scale from white to black',
          'Creating contrast for visual impact',
          'Using shadows and highlights effectively',
          'Value studies in monochrome'
        ],
        examples: [
          'High contrast: Black and white photography',
          'Low contrast: Fog or mist scenes'
        ]
      }
    },
    {
      id: 3,
      title: 'Composition and Visual Balance',
      duration: '25 minutes',
      type: 'analysis',
      completed: false,
      content: {
        description: 'Explore how to arrange elements for compelling visual compositions.',
        keyPoints: [
          'Rule of thirds and focal points',
          'Symmetrical vs. asymmetrical balance',
          'Leading lines and visual flow',
          'Negative space and breathing room'
        ],
        examples: [
          'Photography composition techniques',
          'Classical painting arrangements'
        ]
      }
    },
    {
      id: 4,
      title: 'Drawing Techniques and Mark-Making',
      duration: '30 minutes',
      type: 'hands-on',
      completed: false,
      content: {
        description: 'Develop fundamental drawing skills and expressive mark-making.',
        keyPoints: [
          'Line quality: thick, thin, bold, delicate',
          'Shading techniques: hatching, cross-hatching, blending',
          'Gesture drawing for capturing movement',
          'Observational drawing from life'
        ],
        examples: [
          'Contour line drawings',
          'Quick gesture sketches of people'
        ]
      }
    },
    {
      id: 5,
      title: 'Digital Art Tools and Portfolio Development',
      duration: '35 minutes',
      type: 'technology',
      completed: false,
      content: {
        description: 'Introduction to digital art tools and building an artistic portfolio.',
        keyPoints: [
          'Digital drawing tablets and software basics',
          'Photoshop and Illustrator fundamentals',
          'Documenting and presenting artwork',
          'Building a cohesive portfolio theme'
        ],
        examples: [
          'Digital painting techniques',
          'Portfolio layout and organization'
        ]
      }
    }
  ],

  quiz: {
    title: 'Visual Arts Fundamentals Assessment',
    questions: [
      {
        id: 1,
        question: 'Which colors are considered primary colors in traditional color theory?',
        options: [
          'Red, Green, Blue',
          'Red, Blue, Yellow',
          'Orange, Green, Purple',
          'Black, White, Gray'
        ],
        correct: 1,
        explanation: 'Primary colors (Red, Blue, Yellow) cannot be created by mixing other colors and are the foundation for all other colors.'
      },
      {
        id: 2,
        question: 'What is the purpose of using complementary colors in art?',
        options: [
          'To create harmony and peace',
          'To make colors look muddy',
          'To create contrast and visual excitement',
          'To make everything look the same'
        ],
        correct: 2,
        explanation: 'Complementary colors (opposite on the color wheel) create strong contrast and visual impact when placed next to each other.'
      },
      {
        id: 3,
        question: 'The rule of thirds in composition involves:',
        options: [
          'Using only three colors',
          'Dividing the image into nine equal sections',
          'Making three different drawings',
          'Using three different brushes'
        ],
        correct: 1,
        explanation: 'The rule of thirds divides an image into nine equal sections with two horizontal and two vertical lines, placing important elements along these lines or intersections.'
      },
      {
        id: 4,
        question: 'Which shading technique uses parallel lines to create value?',
        options: [
          'Blending',
          'Stippling',
          'Hatching',
          'Scumbling'
        ],
        correct: 2,
        explanation: 'Hatching uses parallel lines to create areas of shadow and value, with closer lines creating darker areas.'
      },
      {
        id: 5,
        question: 'What is negative space in art?',
        options: [
          'Dark or black areas only',
          'Mistakes in the artwork',
          'The empty or open areas around and between objects',
          'Sad or depressing themes'
        ],
        correct: 2,
        explanation: 'Negative space refers to the empty areas around and between the main subjects, which is as important as the positive space in creating good composition.'
      }
    ]
  }
};

const LearningScreen = ({ navigation, route }) => {
  const { courseId, courseTitle, subject, chapter } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);
  const [studyTime, setStudyTime] = useState(0);

  // 🎯 과목에 따라 적절한 courseData 선택
  const getCourseData = (subject) => {
    // 디버깅: subject 값 확인
    console.log('Current subject:', subject);
    console.log('Route params:', route.params);

    // 대소문자 구분 없이 처리
    const subjectLower = subject?.toLowerCase();

    switch (subjectLower) {
      case 'math':
      case 'mathematics':
        console.log('Loading Math courseData');
        return mathCourseData;
      case 'english':
        console.log('Loading English courseData');
        return englishCourseData;
      case 'science':
        console.log('Loading Science courseData');
        return scienceCourseData; // 🧪 이제 Science 데이터!
      case 'history':
        console.log('Loading History courseData');
        return historyCourseData; // 🏛️ 이제 History 데이터!
      case 'art':
      case 'arts':
        console.log('Loading Art courseData');
        return artCourseData; // 🎨 Art 데이터 추가!
      default:
        console.log('Loading default (Math) courseData');
        return mathCourseData; // 기본값
    }
  };

  // 선택된 과목에 맞는 courseData 사용
  const courseData = getCourseData(subject);

  const currentLesson = courseData.lessons[currentLessonIndex];

  // Study timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format study time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    setLessonProgress(100);
    if (currentLessonIndex < courseData.lessons.length - 1) {
      Alert.alert(
        'Lesson Complete!',
        'Great job! Ready for the next lesson?',
        [
          { text: 'Continue', onPress: () => nextLesson() },
          { text: 'Review', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        'Course Complete!',
        'Congratulations! Take the quiz to test your knowledge.',
        [
          { text: 'Take Quiz', onPress: () => setShowQuiz(true) },
          { text: 'Review', style: 'cancel' }
        ]
      );
    }
  };

  // Navigate to next lesson
  const nextLesson = () => {
    if (currentLessonIndex < courseData.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setLessonProgress(0);
    }
  };

  // Navigate to previous lesson
  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setLessonProgress(0);
    }
  };

  // Handle quiz answer
  const handleQuizAnswer = (questionIndex, selectedOption) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  // Submit quiz
  const submitQuiz = () => {
    let score = 0;
    courseData.quiz.questions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        score++;
      }
    });

    const percentage = Math.round((score / courseData.quiz.questions.length) * 100);
    setQuizScore(percentage);

    Alert.alert(
      'Quiz Complete!',
      `Your score: ${score}/${courseData.quiz.questions.length} (${percentage}%)`,
      [{ text: 'OK', onPress: () => setShowQuiz(false) }]
    );
  };

  // Render lesson content
  const renderLessonContent = () => (
    <ScrollView style={styles.lessonContent}>
      <View style={styles.lessonHeader}>
        <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
        <View style={styles.lessonMeta}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.lessonDuration}>{currentLesson.duration}</Text>
          <View style={styles.lessonType}>
            <Text style={styles.lessonTypeText}>{currentLesson.type}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>Description</Text>
        <Text style={styles.contentText}>{currentLesson.content.description}</Text>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>Key Points</Text>
        {currentLesson.content.keyPoints.map((point, index) => (
          <View key={index} style={styles.keyPoint}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>Examples</Text>
        {currentLesson.content.examples.map((example, index) => (
          <View key={index} style={styles.exampleContainer}>
            <Text style={styles.exampleText}>{example}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleLessonComplete}
      >
        <Text style={styles.completeButtonText}>Mark as Complete</Text>
        <Ionicons name="checkmark-circle" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );

  // Render quiz
  const renderQuiz = () => (
    <Modal visible={showQuiz} animationType="slide">
      <View style={styles.quizContainer}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizTitle}>{courseData.quiz.title}</Text>
          <TouchableOpacity onPress={() => setShowQuiz(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.quizContent}>
          {courseData.quiz.questions.map((question, questionIndex) => (
            <View key={questionIndex} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {questionIndex + 1}. {question.question}
              </Text>

              {question.options.map((option, optionIndex) => (
                <TouchableOpacity
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    quizAnswers[questionIndex] === optionIndex && styles.selectedOption
                  ]}
                  onPress={() => handleQuizAnswer(questionIndex, optionIndex)}
                >
                  <Text style={[
                    styles.optionText,
                    quizAnswers[questionIndex] === optionIndex && styles.selectedOptionText
                  ]}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Text>
                </TouchableOpacity>
              ))}

              {quizAnswers[questionIndex] !== undefined && (
                <View style={styles.explanationContainer}>
                  <Text style={styles.explanationTitle}>Explanation:</Text>
                  <Text style={styles.explanationText}>{question.explanation}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.submitButton} onPress={submitQuiz}>
          <Text style={styles.submitButtonText}>Submit Quiz</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.courseTitle}>{courseData.title}</Text>
          <Text style={styles.chapterTitle}>{courseData.chapter}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.timerText}>{formatTime(studyTime)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            Lesson {currentLessonIndex + 1} of {courseData.lessons.length}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round((currentLessonIndex / courseData.lessons.length) * 100)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentLessonIndex / courseData.lessons.length) * 100}%` }
            ]}
          />
        </View>
      </View>

      {/* Course Info */}
      <View style={styles.courseInfo}>
        <View style={styles.instructorInfo}>
          <Ionicons name="person-circle" size={24} color="#4CAF50" />
          <Text style={styles.instructorName}>{courseData.instructor}</Text>
        </View>
        <View style={styles.courseStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{courseData.totalLessons}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{courseData.difficulty}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{courseData.estimatedTime}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading lesson...</Text>
        </View>
      ) : (
        renderLessonContent()
      )}

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentLessonIndex === 0 && styles.disabledButton]}
          onPress={previousLesson}
          disabled={currentLessonIndex === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentLessonIndex === 0 ? "#ccc" : "white"} />
          <Text style={[styles.navButtonText, currentLessonIndex === 0 && styles.disabledText]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quizButton}
          onPress={() => setShowQuiz(true)}
        >
          <Ionicons name="help-circle" size={20} color="white" />
          <Text style={styles.quizButtonText}>Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentLessonIndex === courseData.lessons.length - 1 && styles.disabledButton
          ]}
          onPress={nextLesson}
          disabled={currentLessonIndex === courseData.lessons.length - 1}
        >
          <Text style={[
            styles.navButtonText,
            currentLessonIndex === courseData.lessons.length - 1 && styles.disabledText
          ]}>
            Next
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={currentLessonIndex === courseData.lessons.length - 1 ? "#ccc" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Quiz Modal */}
      {renderQuiz()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chapterTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  courseInfo: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorName: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  lessonContent: {
    flex: 1,
    padding: 16,
  },
  lessonHeader: {
    marginBottom: 20,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonDuration: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  lessonType: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  lessonTypeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  contentSection: {
    marginBottom: 24,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  keyPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 8,
    fontWeight: 'bold',
  },
  keyPointText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  exampleContainer: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  exampleText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'monospace',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
  quizButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quizButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  quizContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 50,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quizContent: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  optionButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  explanationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 14,
    color: '#2E7D32',
  },
  submitButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#4CAF50',
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