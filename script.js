// Инициализация Supabase ДО всех функций
const supabaseUrl = 'https://nbkwwikpknothvmmfnkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3Z3aWtwa25vdGh2bW1mbmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjIwMjYsImV4cCI6MjA3Nzk5ODAyNn0.B8yh-oBFidrCUAJOnarCSeqxQ83nZpOMeboCcXa5g70';

// Создаем клиент Supabase
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let selectedPhotos = [];

// Предпросмотр фото
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
        };
        reader.readAsDataURL(file);
    }
});

// Добавление объявления
async function addAd() {
    const title = document.getElementById('ad-title').value;
    const text = document.getElementById('ad-text').value;
    const price = document.getElementById('ad-price').value;
    const contact = document.getElementById('ad-contact').value;

    if (!title) {
        alert('Введите название!');
        return;
    }

    try {
        console.log('Пытаемся сохранить в базу...');
        
        const { data, error } = await supabase
            .from('ads')
            .insert([{ 
                title: title,
                description: text || 'Нет описания',
                price: price || 'Не указана',
                contact: contact || 'Не указаны',
                photos: JSON.stringify(selectedPhotos),
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error('Ошибка Supabase:', error);
            throw error;
        }
        
        console.log('Успешно сохранено:', data);
        alert('✅ Объявление успешно размещено!');
        
        // Очищаем форму
        document.getElementById('ad-title').value = '';
        document.getElementById('ad-text').value = '';
        document.getElementById('ad-price').value = '';
        document.getElementById('ad-contact').value = '';
        document.getElementById('ad-photo').value = '';
        document.getElementById('photo-preview').innerHTML = '';
        selectedPhotos = [];
        
        // Обновляем список
        loadAds();
        
    } catch (error) {
        console.error('Общая ошибка:', error);
        alert('❌ Ошибка: ' + error.message);
    }
}

// Загрузка объявлений
async function loadAds() {
    try {
        console.log('Загружаем объявления...');
        
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        console.log('Загружено объявлений:', data.length);
        
        const container = document.getElementById('ads-container');
        container.innerHTML = '';
        
        data.forEach(ad => {
            const adItem = document.createElement('div');
            adItem.className = 'ad-item';
            adItem.innerHTML = `
                <div class="ad-title">${ad.title}</div>
                <div class="ad-text">${ad.description}</div>
                <div class="ad-price">💰 ${ad.price}</div>
                <div class="ad-contact">📞 ${ad.contact}</div>
                <div class="ad-date">📅 ${new Date(ad.created_at).toLocaleString('ru-RU')}</div>
            `;
            container.appendChild(adItem);
        });
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

// Запускаем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, запускаем загрузку объявлений...');
    loadAds();
});
