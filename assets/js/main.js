const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');

const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers-container');
const progressBar = document.getElementById('progress-bar');
const questionCounterElement = document.getElementById('question-counter');

// --- قائمة الأسئلة ---
const questions = [
    { question: "ما هي الدولة التي يمرّ عبرها خط الاستواء وجبال الأنديز في نفس الوقت؟", answers: ["البيرو", "كولومبيا", "الإكوادور", "بوليفيا"], correct: "الإكوادور", field: "جغرافيا" },
    { question: "في أي سنة سقطت الدولة العباسية؟", answers: ["1258م", "1187م", "1453م", "1099م"], correct: "1258م", field: "تاريخ" },
    { question: "ما اسم أول قمر اصطناعي أُطلق إلى الفضاء؟", answers: ["أبولو 11", "سبوتنيك 1", "مير", "فوييجر"], correct: "سبوتنيك 1", field: "علوم وتكنولوجيا" },
    { question: "أيّ من الدول التالية لا تطلّ على البحر الأبيض المتوسط؟", answers: ["تونس", "الجزائر", "الأردن", "لبنان"], correct: "الأردن", field: "جغرافيا" },
    { question: "ما هو العنصر الكيميائي الذي يُستخدم في حفظ المواد الغذائية ويُرمز له بـ 'NaCl'؟", answers: ["السكر", "الكحول", "الملح", "الخل"], correct: "الملح", field: "علوم" },
    { question: "من هو مؤلف كتاب الأمير؟", answers: ["أفلاطون", "نيقولا ميكيافيلي", "مونتسكيو", "ديكارت"], correct: "نيقولا ميكيافيلي", field: "أدب وفلسفة" },
    { question: "في أي قارة تقع بحيرة فيكتوريا؟", answers: ["آسيا", "إفريقيا", "أمريكا الجنوبية", "أوروبا"], correct: "إفريقيا", field: "جغرافيا" },
    { question: "أيّ من الكواكب التالية ليس له أقمار؟", answers: ["عطارد", "الزهرة", "الأرض", "المريخ"], correct: "عطارد", field: "فلك" },
    { question: "ما هو أصل كلمة 'ديمقراطية'؟", answers: ["لاتيني", "يوناني", "روماني", "فرعوني"], correct: "يوناني", field: "ثقافة عامة" },
    { question: "من هو العالم الذي وضع أول خريطة للعالم؟", answers: ["الإدريسي", "ابن بطوطة", "جالينوس", "أرسطو"], correct: "الإدريسي", field: "تاريخ" },
    { question: "كم عدد الدول المؤسسة للأمم المتحدة سنة 1945؟", answers: ["30", "50", "70", "100"], correct: "50", field: "تاريخ معاصر" },
    { question: "في أي مدينة تأسست منظمة اليونسكو؟", answers: ["باريس", "نيويورك", "جنيف", "برلين"], correct: "باريس", field: "ثقافة عامة" },
    { question: "من هو مكتشف الدورة الدموية الكبرى؟", answers: ["ابن النفيس", "ألكسندر فلمنغ", "باستور", "نيوتن"], correct: "ابن النفيس", field: "علوم" },
    { question: "أي من هذه الدول تعتبر من دول البلقان؟", answers: ["المجر", "اليونان", "النمسا", "بولندا"], correct: "اليونان", field: "جغرافيا" },
    { question: "ما هي الدولة التي تُعرف بلقب 'أرض الشمس المشرقة'؟", answers: ["الصين", "اليابان", "كوريا", "تايلند"], correct: "اليابان", field: "ثقافة عامة" }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // لتخزين تفاصيل إجابات المستخدم
let username = "";

startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    username = usernameInput.value.trim();
    if (username === "") {
        alert("الرجاء إدخال اسمك أولاً.");
        return;
    }
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    // خلط الأسئلة بشكل عشوائي عند كل بداية
    questions.sort(() => Math.random() - 0.5);
    displayQuestion();
}

function displayQuestion() {
    // إعادة تعيين الواجهة
    answersContainer.innerHTML = '';
    
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    questionCounterElement.textContent = `السؤال ${currentQuestionIndex + 1} من ${questions.length}`;
    
    // خلط الإجابات
    const shuffledAnswers = [...currentQuestion.answers].sort(() => Math.random() - 0.5);

    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.classList.add('answer-btn');
        button.addEventListener('click', () => selectAnswer(button, answer, currentQuestion.correct, currentQuestion.field));
        answersContainer.appendChild(button);
    });

    // تحديث شريط التقدم
    progressBar.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;
}

function selectAnswer(button, selectedAnswer, correctAnswer, field) {
    const isCorrect = selectedAnswer === correctAnswer;

    // تخزين الإجابة
    userAnswers.push({
        question: questions[currentQuestionIndex].question,
        selected: selectedAnswer,
        correct: correctAnswer,
        isCorrect: isCorrect,
        field: field
    });
    
    // تلوين الأزرار
    Array.from(answersContainer.children).forEach(btn => {
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('wrong');
        }
        btn.disabled = true; // تعطيل الأزرار بعد الاختيار
    });

    if (isCorrect) {
        score++;
    }

    // الانتقال للسؤال التالي بعد فترة قصيرة
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }, 1500); // 1.5 ثانية
}

async function endQuiz() {
    progressBar.style.width = '100%';

    try {
        // حفظ النتائج في Firestore
        await db.collection("results").add({
            username: username,
            score: score,
            totalQuestions: questions.length,
            answers: userAnswers,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // تخزين النتيجة في التخزين المحلي للانتقال لصفحة النتائج
        localStorage.setItem('quizResult', JSON.stringify({ score: score, total: questions.length }));
        
        // الانتقال لصفحة النتائج
        window.location.href = 'result.html';

    } catch (error) {
        console.error("خطأ في حفظ البيانات: ", error);
        alert("حدث خطأ ما أثناء حفظ نتيجتك. الرجاء المحاولة مرة أخرى.");
    }
}



