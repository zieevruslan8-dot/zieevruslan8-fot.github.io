let selectedPhotos = [];

// Предпросмотр фото перед загрузкой
document.getElementById('ad-photo').addEventListener('change', function(event) {
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = '';
    selectedPhotos = [];
    
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            selectedPhotos.push(e.target.result);
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            preview.appendChild(img);
        }
        
        reader.readAsDataURL(file);
    }
});

function addAd() {
    const title = document.getElementById('ad-title').value;
    const text = document.getElementById('ad-text').value;
    const price = document.getElementById('ad-price').value;
    const contact = document.getElementById('ad-contact').value;

    if (!title || !text) {
        alert('Пожалуйста, заполните заголовок и описание!');
        return;
    }

    const adContainer = document.getElementById('ads-container');
    
    const adItem = document.createElement('div');
    adItem.className = 'ad-item';
    
    let photosHTML = '';
    if (selectedPhotos.length > 0) {
        photosHTML = `
            <div class="ad-photos">
                ${selectedPhotos.map(photo => 
                    `<img src="${photo}" class="ad-photo" onclick="openPhoto('${photo}')">`
                ).join('')}
            </div>
        `;
    }
    
    adItem.innerHTML = `
        <div class="ad-title">${title}</div>
        <div class="ad-text">${text}</div>
        ${price ? `<div class="ad-price">💰 ${price} руб.</div>` : ''}
        ${contact ? `<div class="ad-contact">📞 Контакты: ${contact}</div>` : ''}
        ${photosHTML}
        <div class="ad-date">Добавлено: ${new Date().toLocaleString()}</div>
    `;
    
    // Добавляем в начало списка
    adContainer.insertBefore(adItem, adContainer.firstChild);
    
    // Очищаем форму
    clearForm();
    
    alert('Объявление успешно добавлено!');
}

function clearForm() {
    document.getElementById('ad-title').value = '';
    document.getElementById('ad-text').value = '';
    document.getElementById('ad-price').value = '';
    document.getElementById('ad-contact').value = '';
    document.getElementById('ad-photo').value = '';
    document.getElementById('photo-preview').innerHTML = '';
    selectedPhotos = [];
}

function openPhoto(photoSrc) {
    // Простой просмотр фото (можно улучшить)
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
            <head><title>Просмотр фото</title></head>
            <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
                <img src="${photoSrc}" style="max-width:100%; max-height:100%;">
            </body>
        </html>
    `);
                  }
