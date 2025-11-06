// Supabase инициализация
const supabaseUrl = 'https://nbkwwikpknothvmmfnkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3Z3aWtwa25vdGh2bW1mbmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjIwMjYsImV4cCI6MjA3Nzk5ODAyNn0.B8yh-oBFidrCUAJOnarCSeqxQ83nZpOMeboCcXa5g70';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Функция добавления
async function addAd() {
    const title = document.getElementById('ad-title').value;
    const text = document.getElementById('ad-text').value;
    
    if (!title) {
        alert('Введите название!');
        return;
    }

    try {
        await supabase.from('ads').insert([{
            title: title,
            description: text || '',
            price: document.getElementById('ad-price').value || '',
            contact: document.getElementById('ad-contact').value || ''
        }]);
        
        alert('✅ Успешно!');
        // Очистка формы
        document.getElementById('ad-title').value = '';
        document.getElementById('ad-text').value = '';
        document.getElementById('ad-price').value = '';
        document.getElementById('ad-contact').value = '';
        
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
}

// Загрузка объявлений
async function loadAds() {
    try {
        const { data } = await supabase.from('ads').select('*');
        const container = document.getElementById('ads-container');
        container.innerHTML = '';
        
        data.forEach(ad => {
            container.innerHTML += `
                <div class="ad-item">
                    <div class="ad-title">${ad.title}</div>
                    <div class="ad-text">${ad.description}</div>
                </div>
            `;
        });
    } catch (error) {
        console.log('Ошибка загрузки:', error);
    }
}

// Запуск
loadAds();
