/**
 * PULSEQUIZ - APPLICATION LOGIC
 * Tagline: "Test Your Knowledge. Track Your Progress. Stay Curious."
 * Pure Vanilla JavaScript: Event listeners, DOM manipulation, localStorage persistence, REST API integration
 */

// Strict Mode
'use strict';

/* ============================================================
   QUIZ QUESTIONS REPOSITORY
   ============================================================ */
const QUIZ_DATA = {
  html: {
    name: 'HTML',
    description: 'Structure and semantics',
    questions: [
      {
        question: 'Which HTML5 element is used to specify a footer for a document or section?',
        options: ['<footer>', '<bottom>', '<section-footer>', '<foot>'],
        answer: '<footer>'
      },
      {
        question: 'What is the primary purpose of the "alt" attribute on an <img> tag?',
        options: [
          'To provide alternative text for screen readers and broken images',
          'To define the image alignment on the page',
          'To specify a link destination when the image is clicked',
          'To set the alternative source file for retina screens'
        ],
        answer: 'To provide alternative text for screen readers and broken images'
      },
      {
        question: 'Which HTML attribute specifies that an input field must be filled out before submitting a form?',
        options: ['required', 'validate', 'mandatory', 'important'],
        answer: 'required'
      },
      {
        question: 'What does the "<nav>" semantic tag represent in an HTML document?',
        options: [
          'A section containing navigation links',
          'A floating sidebar menu only',
          'The browser navigation toolbar',
          'A container for external website hyperlinks'
        ],
        answer: 'A section containing navigation links'
      },
      {
        question: 'Which doctype declaration is correct for modern HTML5 documents?',
        options: ['<!DOCTYPE html>', '<!DOCTYPE HTML5>', '<!DOCTYPE html PUBLIC>', '<!DOCTYPE html-5>'],
        answer: '<!DOCTYPE html>'
      }
    ]
  },
  css: {
    name: 'CSS',
    description: 'Styling and responsive design',
    questions: [
      {
        question: 'Which CSS property is used to control the stacking order of positioned elements?',
        options: ['z-index', 'stack-level', 'layer-order', 'depth-index'],
        answer: 'z-index'
      },
      {
        question: 'In the CSS Box Model, what space is directly between the content area and the border?',
        options: ['padding', 'margin', 'outline', 'gap'],
        answer: 'padding'
      },
      {
        question: 'Which CSS Flexbox property aligns items along the cross axis inside a flex container?',
        options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
        answer: 'align-items'
      },
      {
        question: 'What does the "rem" unit calculate its relative size against?',
        options: [
          'The font-size of the root <html> element',
          'The font-size of the immediate parent element',
          'The viewport height divided by 100',
          'The default width of the browser window'
        ],
        answer: 'The font-size of the root <html> element'
      },
      {
        question: 'Which CSS selector targets an element when a user hovers a pointing device over it?',
        options: [':hover', ':active', ':focus', ':visited'],
        answer: ':hover'
      }
    ]
  },
  javascript: {
    name: 'JavaScript',
    description: 'Logic and interaction',
    questions: [
      {
        question: 'Which array method creates a new array populated with the results of calling a function on every element?',
        options: ['map()', 'forEach()', 'filter()', 'reduce()'],
        answer: 'map()'
      },
      {
        question: 'What is the output of "typeof null" in JavaScript?',
        options: ['object', 'null', 'undefined', 'number'],
        answer: 'object'
      },
      {
        question: 'Which keyword declares a block-scoped variable that cannot be reassigned?',
        options: ['const', 'let', 'var', 'static'],
        answer: 'const'
      },
      {
        question: 'What does the "===" operator check in JavaScript compared to "=="?',
        options: [
          'Both value equality and data type equality',
          'Value equality with automatic type coercion',
          'Only memory reference address',
          'Object prototype inheritance'
        ],
        answer: 'Both value equality and data type equality'
      },
      {
        question: 'Which method converts a JavaScript object into a JSON formatted string?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.objectify()', 'JSON.serialize()'],
        answer: 'JSON.stringify()'
      }
    ]
  },
  webdev: {
    name: 'Web Development',
    description: 'Essential web concepts',
    questions: [
      {
        question: 'Which HTTP status code signifies that a requested resource was successfully found and returned?',
        options: ['200 OK', '404 Not Found', '500 Internal Server Error', '301 Moved Permanently'],
        answer: '200 OK'
      },
      {
        question: 'What does the acronym REST stand for in modern web architecture?',
        options: [
          'Representational State Transfer',
          'Remote Execution System Transport',
          'Rapid Entity Server Transaction',
          'Relational Endpoint Schema Template'
        ],
        answer: 'Representational State Transfer'
      },
      {
        question: 'Where does the browser localStorage API persist its key-value pairs?',
        options: [
          'Locally in the browser with no expiration date',
          'Temporarily until the browser tab is closed',
          'On a remote cloud storage bucket',
          'Inside the HTTP request headers'
        ],
        answer: 'Locally in the browser with no expiration date'
      },
      {
        question: 'What is the primary function of the Domain Name System (DNS) on the internet?',
        options: [
          'Translating human-readable domain names into IP addresses',
          'Encrypting HTTPS network traffic between servers',
          'Caching web pages on content delivery networks',
          'Assigning MAC addresses to network interfaces'
        ],
        answer: 'Translating human-readable domain names into IP addresses'
      },
      {
        question: 'Which security header or mechanism helps mitigate Cross-Site Scripting (XSS) attacks?',
        options: [
          'Content Security Policy (CSP)',
          'Cross-Origin Resource Sharing (CORS)',
          'Strict Transport Security (HSTS)',
          'DomainKeys Identified Mail (DKIM)'
        ],
        answer: 'Content Security Policy (CSP)'
      }
    ]
  }
};

/* ============================================================
   LOCAL STORAGE KEYS
   ============================================================ */
const STORAGE_KEYS = {
  STATS: 'pulsequiz_stats',
  CATEGORY_PROGRESS: 'pulsequiz_cat_progress',
  HISTORY: 'pulsequiz_history',
  UNFINISHED_QUIZ: 'pulsequiz_unfinished',
  THEME: 'pulsequiz_theme',
  ACTIVE_SECTION: 'pulsequiz_active_section',
  LAST_JOKE: 'pulsequiz_last_joke'
};

/* ============================================================
   APPLICATION STATE
   ============================================================ */
let appStats = {
  questionsAnswered: 0,
  correctAnswers: 0,
  bestScore: 0,
  quizzesCompleted: 0
};

let categoryProgress = {
  html: { correct: 0, total: 0 },
  css: { correct: 0, total: 0 },
  javascript: { correct: 0, total: 0 },
  webdev: { correct: 0, total: 0 }
};

let quizHistory = [];

let activeQuiz = null;
let timerInterval = null;
const QUIZ_TOTAL_SECONDS = 30;

/* ============================================================
   DOM ELEMENTS
   ============================================================ */
const elements = {
  // Navigation & Sections
  navLinks: document.querySelectorAll('.nav-link'),
  sections: document.querySelectorAll('.app-section'),
  topNavBrand: document.getElementById('topNavBrand'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeLabel: document.getElementById('themeLabel'),

  // Dashboard Stats
  statQuestionsAnswered: document.getElementById('statQuestionsAnswered'),
  statCorrectAnswers: document.getElementById('statCorrectAnswers'),
  statBestScore: document.getElementById('statBestScore'),
  statQuizzesCompleted: document.getElementById('statQuizzesCompleted'),

  // Continue Learning
  continueCardTitle: document.getElementById('continueCardTitle'),
  continueCardDesc: document.getElementById('continueCardDesc'),
  continueProgressBox: document.getElementById('continueProgressBox'),
  continueProgressMeta: document.getElementById('continueProgressMeta'),
  continueProgressFill: document.getElementById('continueProgressFill'),
  continueBtn: document.getElementById('continueBtn'),

  // Daily Challenge
  startDailyBtn: document.getElementById('startDailyBtn'),

  // Dashboard Action Buttons
  heroStartQuizBtn: document.getElementById('heroStartQuizBtn'),
  heroExploreCategoriesBtn: document.getElementById('heroExploreCategoriesBtn'),

  // Quiz Screens & Modals
  quizStartScreen: document.getElementById('quizStartScreen'),
  quizActiveScreen: document.getElementById('quizActiveScreen'),
  quizCategoryPickerGrid: document.getElementById('quizCategoryPickerGrid'),
  quizStartScreenLaunchBtn: document.getElementById('quizStartScreenLaunchBtn'),
  quizResumeScreenBtn: document.getElementById('quizResumeScreenBtn'),
  quizResumeBtnText: document.getElementById('quizResumeBtnText'),

  // Quiz Start Confirmation Modal
  quizConfirmModal: document.getElementById('quizConfirmModal'),
  modalQuizCategory: document.getElementById('modalQuizCategory'),
  modalQuizCancelBtn: document.getElementById('modalQuizCancelBtn'),
  modalQuizConfirmBtn: document.getElementById('modalQuizConfirmBtn'),

  // Quiz Engine Interface
  quizCategoryBadge: document.getElementById('quizCategoryBadge'),
  quizTimerDisplay: document.getElementById('quizTimerDisplay'),
  quizTimerBox: document.getElementById('quizTimerBox'),
  quizProgressText: document.getElementById('quizProgressText'),
  quizProgressFill: document.getElementById('quizProgressFill'),
  quizQuestionNumber: document.getElementById('quizQuestionNumber'),
  quizQuestionText: document.getElementById('quizQuestionText'),
  optionsContainer: document.getElementById('optionsContainer'),
  quizPrevBtn: document.getElementById('quizPrevBtn'),
  quizNextBtn: document.getElementById('quizNextBtn'),
  quizQuitBtn: document.getElementById('quizQuitBtn'),

  // Quiz Results Interface
  resultsScore: document.getElementById('resultsScore'),
  resultsAccuracy: document.getElementById('resultsAccuracy'),
  resultsCorrect: document.getElementById('resultsCorrect'),
  resultsIncorrect: document.getElementById('resultsIncorrect'),
  resultsTimeTaken: document.getElementById('resultsTimeTaken'),
  reviewList: document.getElementById('reviewList'),
  resultsRetryBtn: document.getElementById('resultsRetryBtn'),
  resultsCategoriesBtn: document.getElementById('resultsCategoriesBtn'),
  resultsDashboardBtn: document.getElementById('resultsDashboardBtn'),

  // Progress Page
  progTotalAnswered: document.getElementById('progTotalAnswered'),
  progCorrect: document.getElementById('progCorrect'),
  progIncorrect: document.getElementById('progIncorrect'),
  progAccuracy: document.getElementById('progAccuracy'),
  progQuizzes: document.getElementById('progQuizzes'),
  progBestScore: document.getElementById('progBestScore'),
  catProgressContainer: document.getElementById('catProgressContainer'),
  historyContainer: document.getElementById('historyContainer'),
  progressEmptyState: document.getElementById('progressEmptyState'),
  progressContent: document.getElementById('progressContent'),

  // Live Joke
  jokeSetup: document.getElementById('jokeSetup'),
  jokePunchline: document.getElementById('jokePunchline'),
  jokeLoadingBox: document.getElementById('jokeLoadingBox'),
  jokeErrorBox: document.getElementById('jokeErrorBox'),
  jokeContentBox: document.getElementById('jokeContentBox'),
  getJokeBtn: document.getElementById('getJokeBtn'),
  tryJokeAgainBtn: document.getElementById('tryJokeAgainBtn'),
  jokeSavedNotice: document.getElementById('jokeSavedNotice')
};

/* ============================================================
   INITIALIZATION
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  loadTheme();
  loadSavedData();
  setupEventListeners();
  updateDashboard();
  updateProgress();

  // Restore last section or default to home
  const savedSection = localStorage.getItem(STORAGE_KEYS.ACTIVE_SECTION) || 'home';
  // If user was mid-quiz, navigate to quiz
  const unfinished = loadUnfinishedQuiz();
  if (unfinished && savedSection === 'quiz') {
    restoreQuizState(unfinished);
    navigateToSection('quiz');
  } else {
    navigateToSection(savedSection);
  }

  // Restore last saved joke if present
  const lastJoke = loadLastJoke();
  if (lastJoke) {
    displayJoke(lastJoke, true);
  }
}

/* ============================================================
   THEME LOGIC
   ============================================================ */
function loadTheme() {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeLabel(savedTheme);
  } catch (error) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeLabel('dark');
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
  } catch (error) {
    // Graceful fallback
  }
  updateThemeLabel(newTheme);
}

function updateThemeLabel(theme) {
  if (elements.themeLabel) {
    elements.themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }
}

/* ============================================================
   EVENT LISTENERS SETUP
   ============================================================ */
let selectedPreQuizCategory = 'html';

let pendingQuizConfig = {
  categoryKey: 'html',
  isDaily: false
};

function setupEventListeners() {
  // Navigation Links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSection = link.getAttribute('data-section');
      if (targetSection) {
        navigateToSection(targetSection);
      }
    });
  });

  // Top Nav Brand Link
  if (elements.topNavBrand) {
    elements.topNavBrand.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToSection('home');
    });
  }

  // Quiz Start Landing Screen Category Selection
  const catPickBtns = document.querySelectorAll('.quiz-cat-pick-btn');
  catPickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catPickBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPreQuizCategory = btn.getAttribute('data-category') || 'html';
    });
  });

  // Quiz Start Screen Action Buttons
  if (elements.quizStartScreenLaunchBtn) {
    elements.quizStartScreenLaunchBtn.addEventListener('click', () => {
      promptStartQuiz(selectedPreQuizCategory, false);
    });
  }

  if (elements.quizResumeScreenBtn) {
    elements.quizResumeScreenBtn.addEventListener('click', () => {
      const unfinished = loadUnfinishedQuiz();
      if (unfinished && !unfinished.completed) {
        restoreQuizState(unfinished);
      } else {
        promptStartQuiz(selectedPreQuizCategory, false);
      }
    });
  }

  // Quiz Start Confirmation Modal Controls
  if (elements.modalQuizCancelBtn) {
    elements.modalQuizCancelBtn.addEventListener('click', closeQuizConfirmModal);
  }

  if (elements.modalQuizConfirmBtn) {
    elements.modalQuizConfirmBtn.addEventListener('click', () => {
      closeQuizConfirmModal();
      actuallyStartQuiz(pendingQuizConfig.categoryKey, pendingQuizConfig.isDaily);
    });
  }

  if (elements.quizConfirmModal) {
    elements.quizConfirmModal.addEventListener('click', (e) => {
      if (e.target === elements.quizConfirmModal) {
        closeQuizConfirmModal();
      }
    });
  }

  // Close modal on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuizConfirmModal();
    }
  });

  // Theme Toggle
  if (elements.themeToggleBtn) {
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Dashboard Hero Actions
  if (elements.heroStartQuizBtn) {
    elements.heroStartQuizBtn.addEventListener('click', () => {
      promptStartQuiz('html', false);
    });
  }
  if (elements.heroExploreCategoriesBtn) {
    elements.heroExploreCategoriesBtn.addEventListener('click', () => {
      navigateToSection('categories');
    });
  }

  // Category Start Quiz Buttons
  document.querySelectorAll('[data-start-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      const catKey = btn.getAttribute('data-start-category');
      promptStartQuiz(catKey, false);
    });
  });

  // Daily Challenge Button
  if (elements.startDailyBtn) {
    elements.startDailyBtn.addEventListener('click', () => {
      promptStartQuiz('daily', true);
    });
  }

  // Continue Learning Button
  if (elements.continueBtn) {
    elements.continueBtn.addEventListener('click', () => {
      const unfinished = loadUnfinishedQuiz();
      if (unfinished && !unfinished.completed) {
        restoreQuizState(unfinished);
      } else {
        promptStartQuiz('html', false);
      }
    });
  }

  // Quiz Engine Controls
  if (elements.quizNextBtn) {
    elements.quizNextBtn.addEventListener('click', nextQuestion);
  }
  if (elements.quizPrevBtn) {
    elements.quizPrevBtn.addEventListener('click', previousQuestion);
  }
  if (elements.quizQuitBtn) {
    elements.quizQuitBtn.addEventListener('click', quitQuiz);
  }

  // Results Screen Controls
  if (elements.resultsRetryBtn) {
    elements.resultsRetryBtn.addEventListener('click', retryQuiz);
  }
  if (elements.resultsCategoriesBtn) {
    elements.resultsCategoriesBtn.addEventListener('click', () => {
      navigateToSection('categories');
    });
  }
  if (elements.resultsDashboardBtn) {
    elements.resultsDashboardBtn.addEventListener('click', () => {
      navigateToSection('home');
    });
  }

  // Progress Empty State Action Button
  const startFirstBtn = document.getElementById('startFirstQuizBtn');
  if (startFirstBtn) {
    startFirstBtn.addEventListener('click', () => {
      promptStartQuiz('html', false);
    });
  }

  // Live Joke Controls
  if (elements.getJokeBtn) {
    elements.getJokeBtn.addEventListener('click', fetchJoke);
  }
  if (elements.tryJokeAgainBtn) {
    elements.tryJokeAgainBtn.addEventListener('click', fetchJoke);
  }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function navigateToSection(sectionId) {
  // If navigating away from an active ongoing quiz, save state
  if (sectionId !== 'quiz' && activeQuiz && !activeQuiz.completed) {
    saveQuizState();
  }

  // Handle quiz section display states
  if (sectionId === 'quiz') {
    if (activeQuiz && !activeQuiz.completed) {
      if (elements.quizStartScreen) elements.quizStartScreen.style.display = 'none';
      if (elements.quizActiveScreen) elements.quizActiveScreen.style.display = 'block';
    } else {
      if (elements.quizStartScreen) elements.quizStartScreen.style.display = 'block';
      if (elements.quizActiveScreen) elements.quizActiveScreen.style.display = 'none';
      updateQuizStartScreen();
    }
  }

  elements.sections.forEach(sec => {
    sec.classList.remove('active');
  });

  const targetSec = document.getElementById(sectionId);
  if (targetSec) {
    targetSec.classList.add('active');
  } else {
    // Fallback to home
    const homeSec = document.getElementById('home');
    if (homeSec) homeSec.classList.add('active');
    sectionId = 'home';
  }

  // Update active navigation link
  elements.navLinks.forEach(link => {
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Save active section
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SECTION, sectionId);
  } catch (e) {
    // Ignore
  }

  // Refresh dynamic states if returning to dashboard or progress
  if (sectionId === 'home') {
    updateDashboard();
  } else if (sectionId === 'progress') {
    updateProgress();
  } else if (sectionId === 'joke') {
    handleJokeSectionOpened();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateQuizStartScreen() {
  const unfinished = loadUnfinishedQuiz();
  if (elements.quizResumeScreenBtn && elements.quizResumeBtnText) {
    if (unfinished && !unfinished.completed) {
      const qNum = (unfinished.currentIndex || 0) + 1;
      elements.quizResumeBtnText.textContent = `Resume ${unfinished.categoryName} (Q${qNum})`;
      elements.quizResumeScreenBtn.style.display = 'inline-flex';
    } else {
      elements.quizResumeScreenBtn.style.display = 'none';
    }
  }
}

// Navigation helpers
function closeSidebar() {}
function openSidebar() {}
function toggleSidebar() {}

/* ============================================================
   LOCAL STORAGE & DATA PERSISTENCE
   ============================================================ */
function loadSavedData() {
  try {
    const rawStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (rawStats) {
      const parsed = JSON.parse(rawStats);
      appStats = {
        questionsAnswered: Number(parsed.questionsAnswered) || 0,
        correctAnswers: Number(parsed.correctAnswers) || 0,
        bestScore: Number(parsed.bestScore) || 0,
        quizzesCompleted: Number(parsed.quizzesCompleted) || 0
      };
    }
  } catch (error) {
    appStats = { questionsAnswered: 0, correctAnswers: 0, bestScore: 0, quizzesCompleted: 0 };
  }

  try {
    const rawProg = localStorage.getItem(STORAGE_KEYS.CATEGORY_PROGRESS);
    if (rawProg) {
      const parsed = JSON.parse(rawProg);
      categoryProgress = {
        html: { correct: Number(parsed.html?.correct) || 0, total: Number(parsed.html?.total) || 0 },
        css: { correct: Number(parsed.css?.correct) || 0, total: Number(parsed.css?.total) || 0 },
        javascript: { correct: Number(parsed.javascript?.correct) || 0, total: Number(parsed.javascript?.total) || 0 },
        webdev: { correct: Number(parsed.webdev?.correct) || 0, total: Number(parsed.webdev?.total) || 0 }
      };
    }
  } catch (error) {
    categoryProgress = {
      html: { correct: 0, total: 0 },
      css: { correct: 0, total: 0 },
      javascript: { correct: 0, total: 0 },
      webdev: { correct: 0, total: 0 }
    };
  }

  try {
    const rawHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (rawHistory) {
      quizHistory = JSON.parse(rawHistory);
      if (!Array.isArray(quizHistory)) quizHistory = [];
    }
  } catch (error) {
    quizHistory = [];
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(appStats));
    localStorage.setItem(STORAGE_KEYS.CATEGORY_PROGRESS, JSON.stringify(categoryProgress));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(quizHistory));
  } catch (error) {
    // Storage quota or disabled fallback
  }
}

function saveQuizState() {
  if (!activeQuiz || activeQuiz.completed) {
    clearUnfinishedQuiz();
    return;
  }
  try {
    const payload = {
      categoryKey: activeQuiz.categoryKey,
      categoryName: activeQuiz.categoryName,
      isDaily: activeQuiz.isDaily,
      questions: activeQuiz.questions,
      currentIndex: activeQuiz.currentIndex,
      selectedAnswers: activeQuiz.selectedAnswers,
      timeRemaining: activeQuiz.timeRemaining,
      totalQuestions: activeQuiz.questions.length
    };
    localStorage.setItem(STORAGE_KEYS.UNFINISHED_QUIZ, JSON.stringify(payload));
  } catch (e) {
    // Ignore
  }
}

function loadUnfinishedQuiz() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNFINISHED_QUIZ);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
      return parsed;
    }
  } catch (e) {
    return null;
  }
  return null;
}

function clearUnfinishedQuiz() {
  try {
    localStorage.removeItem(STORAGE_KEYS.UNFINISHED_QUIZ);
  } catch (e) {
    // Ignore
  }
}

function saveLastJoke(joke) {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_JOKE, JSON.stringify(joke));
  } catch (e) {
    // Ignore
  }
}

function loadLastJoke() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_JOKE);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

/* ============================================================
   DASHBOARD UPDATES
   ============================================================ */
function updateDashboard() {
  updateStatistics();
  updateContinueLearningCard();
}

function updateStatistics() {
  if (elements.statQuestionsAnswered) {
    elements.statQuestionsAnswered.textContent = appStats.questionsAnswered;
  }
  if (elements.statCorrectAnswers) {
    elements.statCorrectAnswers.textContent = appStats.correctAnswers;
  }
  if (elements.statBestScore) {
    elements.statBestScore.textContent = `${appStats.bestScore}%`;
  }
  if (elements.statQuizzesCompleted) {
    elements.statQuizzesCompleted.textContent = appStats.quizzesCompleted;
  }
}

function updateContinueLearningCard() {
  const unfinished = loadUnfinishedQuiz();
  if (unfinished) {
    const answeredCount = unfinished.selectedAnswers.filter(a => a !== null).length;
    const totalCount = unfinished.totalQuestions;
    const pct = Math.round((answeredCount / totalCount) * 100);

    if (elements.continueCardTitle) {
      elements.continueCardTitle.textContent = `Resume practice in ${unfinished.categoryName}`;
    }
    if (elements.continueCardDesc) {
      elements.continueCardDesc.textContent = `${answeredCount} of ${totalCount} questions completed`;
    }
    if (elements.continueProgressBox) {
      elements.continueProgressBox.style.display = 'block';
    }
    if (elements.continueProgressMeta) {
      elements.continueProgressMeta.textContent = `${pct}% completed`;
    }
    if (elements.continueProgressFill) {
      elements.continueProgressFill.style.width = `${pct}%`;
    }
    if (elements.continueBtn) {
      elements.continueBtn.textContent = 'Continue';
    }
  } else {
    if (elements.continueCardTitle) {
      elements.continueCardTitle.textContent = 'Continue Learning';
    }
    if (elements.continueCardDesc) {
      elements.continueCardDesc.textContent = 'Start your first quiz to begin tracking your progress.';
    }
    if (elements.continueProgressBox) {
      elements.continueProgressBox.style.display = 'none';
    }
    if (elements.continueBtn) {
      elements.continueBtn.textContent = 'Start New Quiz';
    }
  }
}

/* ============================================================
   PROGRESS SECTION UPDATES
   ============================================================ */
function updateProgress() {
  const total = appStats.questionsAnswered;
  const correct = appStats.correctAnswers;
  const incorrect = Math.max(0, total - correct);
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (elements.progTotalAnswered) elements.progTotalAnswered.textContent = total;
  if (elements.progCorrect) elements.progCorrect.textContent = correct;
  if (elements.progIncorrect) elements.progIncorrect.textContent = incorrect;
  if (elements.progAccuracy) elements.progAccuracy.textContent = `${accuracy}%`;
  if (elements.progQuizzes) elements.progQuizzes.textContent = appStats.quizzesCompleted;
  if (elements.progBestScore) elements.progBestScore.textContent = `${appStats.bestScore}%`;

  // Check if zero activity
  if (appStats.quizzesCompleted === 0 && appStats.questionsAnswered === 0) {
    if (elements.progressEmptyState) elements.progressEmptyState.style.display = 'block';
    if (elements.progressContent) elements.progressContent.style.display = 'none';
    return;
  } else {
    if (elements.progressEmptyState) elements.progressEmptyState.style.display = 'none';
    if (elements.progressContent) elements.progressContent.style.display = 'block';
  }

  // Render Category Breakdown
  if (elements.catProgressContainer) {
    elements.catProgressContainer.innerHTML = '';
    const categoriesConfig = [
      { key: 'html', label: 'HTML' },
      { key: 'css', label: 'CSS' },
      { key: 'javascript', label: 'JavaScript' },
      { key: 'webdev', label: 'Web Development' }
    ];

    categoriesConfig.forEach(cat => {
      const data = categoryProgress[cat.key] || { correct: 0, total: 0 };
      const catPct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

      const item = document.createElement('div');
      item.className = 'cat-progress-item';
      item.innerHTML = `
        <div class="cat-progress-header">
          <span class="cat-progress-name">${cat.label}</span>
          <span class="cat-progress-score">${data.correct} / ${data.total} (${catPct}%)</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${catPct}%"></div>
        </div>
      `;
      elements.catProgressContainer.appendChild(item);
    });
  }

  // Render Quiz History
  if (elements.historyContainer) {
    elements.historyContainer.innerHTML = '';
    if (quizHistory.length === 0) {
      elements.historyContainer.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.88rem;">No completed quiz records yet.</p>
      `;
    } else {
      quizHistory.slice(0, 5).forEach(record => {
        const row = document.createElement('div');
        row.className = 'history-row';
        row.innerHTML = `
          <div>
            <div class="history-row-cat">${record.categoryName}</div>
            <div class="history-row-meta">${record.date} - ${record.timeTaken}s taken</div>
          </div>
          <div class="history-row-stats">
            <span style="color: var(--accent-green);">${record.score} / ${record.total}</span>
            <span style="color: var(--text-secondary); font-size: 0.84rem;">${record.accuracy}%</span>
          </div>
        `;
        elements.historyContainer.appendChild(row);
      });
    }
  }
}

/* ============================================================
   QUIZ ENGINE
   ============================================================ */

/**
 * Fisher-Yates shuffle array algorithm
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function promptStartQuiz(categoryKey = 'html', isDaily = false) {
  pendingQuizConfig = { categoryKey, isDaily };

  let catName = 'HTML';
  if (isDaily) {
    catName = 'Daily Challenge';
  } else if (QUIZ_DATA[categoryKey]) {
    catName = QUIZ_DATA[categoryKey].name;
  }

  if (elements.modalQuizCategory) {
    elements.modalQuizCategory.textContent = catName;
  }
  const modalTitle = document.getElementById('modalQuizTitle');
  if (modalTitle) {
    modalTitle.textContent = `Start ${catName} Quiz?`;
  }
  const modalDesc = document.getElementById('modalQuizDesc');
  if (modalDesc) {
    modalDesc.innerHTML = `You're about to begin a 5-question timed quiz in <strong>${catName}</strong>. Make sure you're ready before the 30-second timer begins.`;
  }

  if (elements.quizConfirmModal) {
    elements.quizConfirmModal.classList.add('active');
    elements.quizConfirmModal.setAttribute('aria-hidden', 'false');
  }
}

function closeQuizConfirmModal() {
  if (elements.quizConfirmModal) {
    elements.quizConfirmModal.classList.remove('active');
    elements.quizConfirmModal.setAttribute('aria-hidden', 'true');
  }
}

function actuallyStartQuiz(categoryKey, isDaily = false) {
  stopTimer();

  let questions = [];
  let categoryName = '';

  if (isDaily) {
    categoryName = 'Daily Challenge';
    // Mixed questions: take 1 or 2 from each category
    const pool = [];
    Object.keys(QUIZ_DATA).forEach(cat => {
      QUIZ_DATA[cat].questions.forEach(q => pool.push({ ...q, originCategory: cat }));
    });
    const shuffledPool = shuffleArray(pool);
    questions = shuffledPool.slice(0, 5);
  } else {
    const catData = QUIZ_DATA[categoryKey] || QUIZ_DATA.html;
    categoryName = catData.name;
    questions = shuffleArray(catData.questions).slice(0, 5);
  }

  // Randomize answer options for each question while preserving correct answer
  const preparedQuestions = questions.map(q => {
    return {
      question: q.question,
      options: shuffleArray(q.options),
      answer: q.answer,
      originCategory: q.originCategory || categoryKey
    };
  });

  activeQuiz = {
    categoryKey: categoryKey,
    categoryName: categoryName,
    isDaily: isDaily,
    questions: preparedQuestions,
    currentIndex: 0,
    selectedAnswers: new Array(preparedQuestions.length).fill(null),
    timeRemaining: QUIZ_TOTAL_SECONDS,
    completed: false
  };

  if (elements.quizStartScreen) {
    elements.quizStartScreen.style.display = 'none';
  }
  if (elements.quizActiveScreen) {
    elements.quizActiveScreen.style.display = 'block';
  }

  saveQuizState();
  navigateToSection('quiz');
  loadQuestion(0);
  startTimer();
}

// Aliased startQuiz so all triggers require confirmation modal
const startQuiz = promptStartQuiz;

function restoreQuizState(saved) {
  stopTimer();
  activeQuiz = {
    categoryKey: saved.categoryKey,
    categoryName: saved.categoryName,
    isDaily: saved.isDaily,
    questions: saved.questions,
    currentIndex: saved.currentIndex || 0,
    selectedAnswers: saved.selectedAnswers || new Array(saved.questions.length).fill(null),
    timeRemaining: Math.max(1, saved.timeRemaining || QUIZ_TOTAL_SECONDS),
    completed: false
  };

  if (elements.quizStartScreen) {
    elements.quizStartScreen.style.display = 'none';
  }
  if (elements.quizActiveScreen) {
    elements.quizActiveScreen.style.display = 'block';
  }

  navigateToSection('quiz');
  loadQuestion(activeQuiz.currentIndex);
  startTimer();
}

function loadQuestion(index) {
  if (!activeQuiz || index < 0 || index >= activeQuiz.questions.length) return;

  activeQuiz.currentIndex = index;
  const currentQ = activeQuiz.questions[index];
  const total = activeQuiz.questions.length;

  // Update Header Metadata
  if (elements.quizCategoryBadge) {
    elements.quizCategoryBadge.textContent = activeQuiz.categoryName;
  }
  if (elements.quizProgressText) {
    elements.quizProgressText.textContent = `Question ${index + 1} of ${total}`;
  }
  if (elements.quizProgressFill) {
    const pct = Math.round(((index + 1) / total) * 100);
    elements.quizProgressFill.style.width = `${pct}%`;
  }
  if (elements.quizQuestionNumber) {
    elements.quizQuestionNumber.textContent = `Question ${index + 1}`;
  }
  if (elements.quizQuestionText) {
    elements.quizQuestionText.textContent = currentQ.question;
  }

  // Render Options
  if (elements.optionsContainer) {
    elements.optionsContainer.innerHTML = '';
    const userSelected = activeQuiz.selectedAnswers[index];
    const prefixes = ['A', 'B', 'C', 'D'];

    currentQ.options.forEach((opt, optIndex) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.type = 'button';

      const isSelected = userSelected !== null && userSelected === optIndex;
      const hasAnswered = userSelected !== null;

      if (hasAnswered) {
        btn.disabled = true;
        if (isSelected) {
          btn.classList.add('selected');
        }
        if (opt === currentQ.answer) {
          btn.classList.add('correct');
        } else if (isSelected) {
          btn.classList.add('incorrect');
        }
      }

      const prefix = document.createElement('span');
      prefix.className = 'option-prefix';
      prefix.textContent = prefixes[optIndex];

      const optionText = document.createElement('span');
      optionText.className = 'option-text';
      optionText.textContent = opt;

      btn.appendChild(prefix);
      btn.appendChild(optionText);

      if (!hasAnswered) {
        btn.addEventListener('click', () => selectAnswer(optIndex));
      }

      elements.optionsContainer.appendChild(btn);
    });
  }

  // Update Navigation Controls
  if (elements.quizPrevBtn) {
    elements.quizPrevBtn.disabled = index === 0;
    elements.quizPrevBtn.style.opacity = index === 0 ? '0.5' : '1';
  }

  if (elements.quizNextBtn) {
    // User cannot click Next without selecting an answer
    const hasAnswered = activeQuiz.selectedAnswers[index] !== null;
    elements.quizNextBtn.disabled = !hasAnswered;
    elements.quizNextBtn.style.opacity = hasAnswered ? '1' : '0.5';

    if (index === total - 1) {
      elements.quizNextBtn.innerHTML = `Finish Quiz <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    } else {
      elements.quizNextBtn.innerHTML = `Next Question <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    }
  }

  saveQuizState();
}

function selectAnswer(optionIndex) {
  if (!activeQuiz) return;
  const currentIndex = activeQuiz.currentIndex;
  if (activeQuiz.selectedAnswers[currentIndex] !== null) return; // already answered

  activeQuiz.selectedAnswers[currentIndex] = optionIndex;
  saveQuizState();

  // Reload current question to reveal correct/incorrect feedback & enable Next
  loadQuestion(currentIndex);
}

function nextQuestion() {
  if (!activeQuiz) return;
  const currentIndex = activeQuiz.currentIndex;
  const total = activeQuiz.questions.length;

  // Guard: User must select answer first
  if (activeQuiz.selectedAnswers[currentIndex] === null) return;

  if (currentIndex < total - 1) {
    loadQuestion(currentIndex + 1);
  } else {
    finishQuiz();
  }
}

function previousQuestion() {
  if (!activeQuiz || activeQuiz.currentIndex <= 0) return;
  loadQuestion(activeQuiz.currentIndex - 1);
}

function startTimer() {
  stopTimer();
  updateTimerUI();

  timerInterval = setInterval(() => {
    if (!activeQuiz || activeQuiz.completed) {
      stopTimer();
      return;
    }

    activeQuiz.timeRemaining -= 1;
    updateTimerUI();

    if (activeQuiz.timeRemaining <= 0) {
      stopTimer();
      finishQuiz();
    } else {
      // Save state every few seconds
      saveQuizState();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerUI() {
  if (!activeQuiz) return;
  const seconds = Math.max(0, activeQuiz.timeRemaining);
  const formatted = `00:${seconds.toString().padStart(2, '0')}`;

  if (elements.quizTimerDisplay) {
    elements.quizTimerDisplay.textContent = formatted;
  }

  if (elements.quizTimerBox) {
    elements.quizTimerBox.classList.remove('warning', 'critical');
    if (seconds <= 5) {
      elements.quizTimerBox.classList.add('critical');
    } else if (seconds <= 10) {
      elements.quizTimerBox.classList.add('warning');
    }
  }
}

function quitQuiz() {
  stopTimer();
  activeQuiz = null;
  clearUnfinishedQuiz();
  if (elements.quizStartScreen) elements.quizStartScreen.style.display = 'block';
  if (elements.quizActiveScreen) elements.quizActiveScreen.style.display = 'none';
  updateDashboard();
  navigateToSection('home');
}

function finishQuiz() {
  stopTimer();
  if (!activeQuiz || activeQuiz.completed) return;
  activeQuiz.completed = true;

  // Calculate scores
  let correctCount = 0;
  let answeredCount = 0;

  activeQuiz.questions.forEach((q, idx) => {
    const selectedIdx = activeQuiz.selectedAnswers[idx];
    if (selectedIdx !== null) {
      answeredCount++;
      const selectedOption = q.options[selectedIdx];
      if (selectedOption === q.answer) {
        correctCount++;
      }
    }
  });

  const totalQuestions = activeQuiz.questions.length;
  const incorrectCount = answeredCount - correctCount;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const timeTaken = QUIZ_TOTAL_SECONDS - Math.max(0, activeQuiz.timeRemaining);

  // Update App Statistics
  appStats.questionsAnswered += answeredCount;
  appStats.correctAnswers += correctCount;
  appStats.quizzesCompleted += 1;
  if (accuracy > appStats.bestScore) {
    appStats.bestScore = accuracy;
  }

  // Update Category Progress
  activeQuiz.questions.forEach((q, idx) => {
    const selectedIdx = activeQuiz.selectedAnswers[idx];
    const catKey = q.originCategory;
    if (categoryProgress[catKey]) {
      categoryProgress[catKey].total += 1;
      if (selectedIdx !== null && q.options[selectedIdx] === q.answer) {
        categoryProgress[catKey].correct += 1;
      }
    }
  });

  // Save to history
  const historyRecord = {
    categoryName: activeQuiz.categoryName,
    score: correctCount,
    total: totalQuestions,
    correctAnswers: correctCount,
    incorrectAnswers: incorrectCount,
    accuracy: accuracy,
    timeTaken: timeTaken,
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  };
  quizHistory.unshift(historyRecord);
  if (quizHistory.length > 20) quizHistory.pop();

  saveData();
  clearUnfinishedQuiz();
  showResults(correctCount, totalQuestions, accuracy, incorrectCount, timeTaken);
}

function showResults(score, total, accuracy, incorrect, timeTaken) {
  if (elements.resultsScore) elements.resultsScore.textContent = `${score} / ${total}`;
  if (elements.resultsAccuracy) elements.resultsAccuracy.textContent = `${accuracy}%`;
  if (elements.resultsCorrect) elements.resultsCorrect.textContent = score;
  if (elements.resultsIncorrect) elements.resultsIncorrect.textContent = incorrect;
  if (elements.resultsTimeTaken) elements.resultsTimeTaken.textContent = `${timeTaken}s`;

  // Render Answer Review
  if (elements.reviewList && activeQuiz) {
    elements.reviewList.innerHTML = '';
    activeQuiz.questions.forEach((q, idx) => {
      const userSelectedIdx = activeQuiz.selectedAnswers[idx];
      const hasAnswered = userSelectedIdx !== null;
      const userAnswerText = hasAnswered ? q.options[userSelectedIdx] : 'No answer selected';
      const isCorrect = hasAnswered && userAnswerText === q.answer;

      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-item-card';

      const headerDiv = document.createElement('div');
      headerDiv.className = 'review-item-header';

      const questionDiv = document.createElement('div');
      questionDiv.className = 'review-item-question';
      questionDiv.textContent = `${idx + 1}. ${q.question}`;

      const statusBadge = document.createElement('span');
      statusBadge.className = `status-badge ${isCorrect ? 'correct' : 'incorrect'}`;
      statusBadge.textContent = isCorrect ? 'Correct' : 'Incorrect';

      headerDiv.appendChild(questionDiv);
      headerDiv.appendChild(statusBadge);

      const answersBox = document.createElement('div');
      answersBox.className = 'review-answers-box';

      // User answer row
      const userRow = document.createElement('div');
      userRow.className = 'review-answer-row';

      const userLabel = document.createElement('span');
      userLabel.className = 'review-answer-label';
      userLabel.textContent = 'Your Answer:';

      const userSpan = document.createElement('span');
      userSpan.className = `review-answer-text ${isCorrect ? 'text-correct' : 'text-incorrect'}`;
      userSpan.textContent = userAnswerText;

      userRow.appendChild(userLabel);
      userRow.appendChild(userSpan);

      // Correct answer row
      const correctRow = document.createElement('div');
      correctRow.className = 'review-answer-row';

      const correctLabel = document.createElement('span');
      correctLabel.className = 'review-answer-label';
      correctLabel.textContent = 'Correct Answer:';

      const correctSpan = document.createElement('span');
      correctSpan.className = 'review-answer-text text-correct';
      correctSpan.textContent = q.answer;

      correctRow.appendChild(correctLabel);
      correctRow.appendChild(correctSpan);

      answersBox.appendChild(userRow);
      answersBox.appendChild(correctRow);

      reviewCard.appendChild(headerDiv);
      reviewCard.appendChild(answersBox);

      elements.reviewList.appendChild(reviewCard);
    });
  }

  updateDashboard();
  updateProgress();
  navigateToSection('results');
}

function retryQuiz() {
  if (!activeQuiz) {
    startQuiz('html', false);
    return;
  }
  startQuiz(activeQuiz.categoryKey, activeQuiz.isDaily);
}

/* ============================================================
   LIVE JOKE API
   ============================================================ */
function handleJokeSectionOpened() {
  const lastJoke = loadLastJoke();
  if (lastJoke && lastJoke.setup && lastJoke.punchline) {
    displayJoke(lastJoke, true);
  } else {
    fetchJoke();
  }
}

async function fetchJoke() {
  const JOKE_API_URL = 'https://official-joke-api.appspot.com/random_joke';

  // Show loading state
  if (elements.jokeLoadingBox) elements.jokeLoadingBox.classList.add('active');
  if (elements.jokeErrorBox) elements.jokeErrorBox.classList.remove('active');
  if (elements.jokeContentBox) elements.jokeContentBox.style.display = 'none';
  if (elements.jokeSavedNotice) elements.jokeSavedNotice.style.display = 'none';
  if (elements.getJokeBtn) elements.getJokeBtn.disabled = true;

  try {
    const response = await fetch(JOKE_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();

    if (data && typeof data.setup === 'string' && typeof data.punchline === 'string') {
      const trimmedSetup = data.setup.trim();
      const trimmedPunchline = data.punchline.trim();
      if (trimmedSetup && trimmedPunchline) {
        const jokeToSave = {
          setup: trimmedSetup,
          punchline: trimmedPunchline,
          id: data.id || Date.now()
        };
        saveLastJoke(jokeToSave);
        displayJoke(jokeToSave, false);
      } else {
        throw new Error('Malformed joke response strings');
      }
    } else {
      throw new Error('Malformed joke response structure');
    }
  } catch (error) {
    // Show error state
    if (elements.jokeLoadingBox) elements.jokeLoadingBox.classList.remove('active');
    if (elements.jokeErrorBox) elements.jokeErrorBox.classList.add('active');
    if (elements.jokeContentBox) elements.jokeContentBox.style.display = 'none';
    if (elements.jokeSavedNotice) elements.jokeSavedNotice.style.display = 'none';
  } finally {
    if (elements.getJokeBtn) {
      elements.getJokeBtn.disabled = false;
      const btnText = document.getElementById('getJokeBtnText');
      if (btnText) {
        btnText.textContent = 'Get Another Joke';
      }
    }
  }
}

function displayJoke(joke, isRestored = false) {
  if (!joke || typeof joke.setup !== 'string' || typeof joke.punchline !== 'string') return;
  const setup = joke.setup.trim();
  const punchline = joke.punchline.trim();
  if (!setup || !punchline) return;

  if (elements.jokeLoadingBox) elements.jokeLoadingBox.classList.remove('active');
  if (elements.jokeErrorBox) elements.jokeErrorBox.classList.remove('active');
  if (elements.jokeContentBox) {
    elements.jokeContentBox.style.display = 'flex';
  }

  if (elements.jokeSetup) {
    elements.jokeSetup.textContent = setup;
  }
  if (elements.jokePunchline) {
    elements.jokePunchline.textContent = punchline;
    elements.jokePunchline.style.display = 'block';
  }

  if (elements.jokeSavedNotice) {
    elements.jokeSavedNotice.style.display = isRestored ? 'inline-block' : 'none';
  }

  const btnText = document.getElementById('getJokeBtnText');
  if (btnText) {
    btnText.textContent = 'Get Another Joke';
  }
}
