document.addEventListener('DOMContentLoaded', function() {
    
    // --- !! 請在這裡貼上您自己的 Apps Script Web App 網址 !! ---
    const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbyh_.../exec';

    // --- 動態產生班級選項 ---
    const classSelect = document.getElementById('studentClass');
    const grades = [
        { grade: '七年級', classes: 19, prefix: '7' },
        { grade: '八年級', classes: 19, prefix: '8' },
        { grade: '九年級', classes: 18, prefix: '9' }
    ];

    grades.forEach(g => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = g.grade;
        for (let i = 1; i <= g.classes; i++) {
            const option = document.createElement('option');
            const classNumber = String(i).padStart(2, '0');
            option.value = `${g.prefix}${classNumber}`;
            option.textContent = `${g.prefix}${classNumber}`;
            optgroup.appendChild(option);
        }
        classSelect.appendChild(optgroup);
    });

    // --- 非同步表單提交 ---
    const form = document.getElementById('data-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusMessage = document.getElementById('status-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // 防止頁面跳轉
        
        // 簡易的前端驗證
        if (!form.checkValidity()) {
            statusMessage.textContent = '請填寫所有必填欄位！';
            statusMessage.className = 'error';
            return;
        }

        // 禁用按鈕並顯示處理中
        submitBtn.disabled = true;
        submitBtn.textContent = '傳送中...';
        statusMessage.textContent = '';
        statusMessage.className = '';

        const formData = new FormData(form);

        fetch(appsScriptUrl, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data.includes('成功')) {
                statusMessage.textContent = '資料提交成功！';
                statusMessage.className = 'success';
                form.reset(); // 清空表單
                classSelect.focus(); // 將焦點移回第一個欄位
            } else {
                throw new Error(data); // 如果 Apps Script 回傳錯誤，拋出錯誤
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusMessage.textContent = '提交失敗，請稍後再試。';
            statusMessage.className = 'error';
        })
        .finally(() => {
            // 無論成功或失敗，都重新啟用按鈕
            submitBtn.disabled = false;
            submitBtn.textContent = '提交資料';
        });
    });
});
