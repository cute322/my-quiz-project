document.addEventListener('DOMContentLoaded', async () => {
    const resultsTable = document.getElementById('results-table');
    const totalParticipantsEl = document.getElementById('total-participants');
    const averageScoreEl = document.getElementById('average-score');
    const successRateEl = document.getElementById('success-rate');
    const successChartCtx = document.getElementById('success-pie-chart').getContext('2d');

    try {
        const snapshot = await db.collection("results").orderBy("timestamp", "desc").get();
        if (snapshot.empty) {
            resultsTable.innerHTML = "<p>لا توجد أي نتائج مسجلة حتى الآن.</p>";
            return;
        }

        let resultsHtml = `
            <table>
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>النتيجة</th>
                        <th>التاريخ</th>
                        <th>المجالات التي أخطأ فيها</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalScore = 0;
        let successCount = 0;
        const totalParticipants = snapshot.size;

        snapshot.forEach(doc => {
            const result = doc.data();
            const scorePercentage = (result.score / result.totalQuestions) * 100;
            totalScore += result.score;
            
            if (scorePercentage >= 50) {
                successCount++;
            }

            // تجميع الأخطاء حسب المجال
            const mistakesByField = {};
            result.answers.forEach(ans => {
                if (!ans.isCorrect) {
                    mistakesByField[ans.field] = (mistakesByField[ans.field] || 0) + 1;
                }
            });

            let mistakesHtml = '<ul class="mistakes-list">';
            for (const field in mistakesByField) {
                mistakesHtml += `<li><strong>${field}:</strong> ${mistakesByField[field]} أخطاء</li>`;
            }
            mistakesHtml += '</ul>';
            if (Object.keys(mistakesByField).length === 0) {
                 mistakesHtml = "لا توجد أخطاء";
            }

            resultsHtml += `
                <tr>
                    <td>${result.username}</td>
                    <td>${result.score} / ${result.totalQuestions}</td>
                    <td>${new Date(result.timestamp.seconds * 1000).toLocaleString('ar-EG')}</td>
                    <td>${mistakesHtml}</td>
                </tr>
            `;
        });

        resultsHtml += `</tbody></table>`;
        resultsTable.innerHTML = resultsHtml;

        // تحديث الإحصائيات العامة
        totalParticipantsEl.textContent = totalParticipants;
        averageScoreEl.textContent = (totalScore / totalParticipants).toFixed(2);
        const successRate = (successCount / totalParticipants) * 100;
        successRateEl.textContent = `${successRate.toFixed(1)}%`;
        
        // رسم مخطط نسبة النجاح
        new Chart(successChartCtx, {
            type: 'pie',
            data: {
                labels: ['ناجحون', 'راسبون'],
                datasets: [{
                    data: [successCount, totalParticipants - successCount],
                    backgroundColor: ['#28a745', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'توزيع نسبة النجاح'
                    }
                }
            }
        });


    } catch (error) {
        console.error("خطأ في جلب البيانات: ", error);
        resultsTable.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات من قاعدة البيانات.</p>";
    }
});