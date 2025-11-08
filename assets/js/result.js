document.addEventListener('DOMContentLoaded', () => {
    const resultData = JSON.parse(localStorage.getItem('quizResult'));

    if (!resultData) {
        // إذا لم توجد نتيجة، أعد المستخدم للصفحة الرئيسية
        window.location.href = 'index.html';
        return;
    }

    const score = resultData.score;
    const total = resultData.total;
    const wrongAnswers = total - score;
    const percentage = (score / total) * 100;

    document.getElementById('final-score').textContent = score;
    document.getElementById('total-questions').textContent = total;

    // رسالة تقييمية
    const feedbackMessage = document.getElementById('feedback-message');
    if (percentage === 100) {
        feedbackMessage.textContent = "ممتاز! ثقافتك رائعة 👏";
        feedbackMessage.style.color = "#28a745";
    } else if (percentage >= 70) {
        feedbackMessage.textContent = "مستوى جيد جداً 👌";
        feedbackMessage.style.color = "#17a2b8";
    } else if (percentage >= 50) {
        feedbackMessage.textContent = "لا بأس، يمكنك التحسن.";
        feedbackMessage.style.color = "#ffc107";
    } else {
        feedbackMessage.textContent = "تحتاج إلى المزيد من المراجعة 😅";
        feedbackMessage.style.color = "#dc3545";
    }

    // إعداد الدائرة النسبية
    const ctx = document.getElementById('result-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['إجابات صحيحة', 'إجابات خاطئة'],
            datasets: [{
                data: [score, wrongAnswers],
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const totalValue = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const currentValue = context.raw;
                            const percentage = ((currentValue / totalValue) * 100).toFixed(1);
                            return `${context.label}: ${currentValue} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // حذف البيانات بعد عرضها
    localStorage.removeItem('quizResult');
});