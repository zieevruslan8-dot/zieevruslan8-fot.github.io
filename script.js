// Supabase клиент
const supabaseUrl = 'https://nbkwwikpknothvmmfnkj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ia3Z3aWtwa25vdGh2bW1mbmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjIwMjYsImV4cCI6MjA3Nzk5ODAyNn0.B8yh-oBFidrCUAJOnarCSeqxQ83nZpOMeboCcXa5g70'
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

let selectedPhotos = []

// Предпросмотр фото
document.getElementById('ad-photo').addEventListener('change', function(event) {
    const preview = document.getElementById('photo-preview')
    preview.innerHTML = ''
    selectedPhotos = []
    
    const files = event.target.files
    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()
        
        reader.onload = function(e) {
            selectedPhotos.push(e.target.result)
            
            const img = document.createElement('img')
            img.src = e.target.result
            img.className = 'preview-image'
            preview.appendChild(img)
        }
        
        reader.readAsDataURL(file)
    }
})

// Добавление объявления
async function addAd() {
    const title = document.getElementById('ad-title').value
    const text = document.getElementById('ad-text').value
    const price = document.getElementById('ad-price').value
    const contact = document.getElementById('ad-contact').value

    if (!title || !text) {
        alert('Пожалуйста, заполните название и описание!')
        return
    }

    try {
        const { data, error } = await supabase
            .from('ads')
            .insert([
                {
                    title: title,
                    description: text,
                    price: price || 'Не указана',
                    contact: contact || 'Не указаны',
                    photos: JSON.stringify(selectedPhotos),
                    created_at: new Date()
                }
            ])

        if (error) throw error

        clearForm()
        loadAds()
        alert('Объявление успешно размещено!')
    } catch (error) {
        alert('Ошибка при сохранении: ' + error.message)
    }
}

// Загрузка объявлений
async function loadAds() {
    try {
        const { data: ads, error } = await supabase
            .from('ads')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        const adContainer = document.getElementById('ads-container')
        adContainer.innerHTML = ''
        
        ads.forEach(ad => {
            const adItem = document.createElement('div')
            adItem.className = 'ad-item'
            
            let photos = []
            try {
                photos = JSON.parse(ad.photos || '[]')
            } catch (e) {
                photos = []
            }
            
            let photosHTML = ''
            if (photos.length > 0) {
                photosHTML = `
                    <div class="ad-photos">
                        ${photos.map(photo => 
                            `<img src="${photo}" class="ad-photo" onclick="openPhoto('${photo}')">`
                        ).join('')}
                    </div>
                `
            }
            
            adItem.innerHTML = `
                <div class="ad-title">${ad.title}</div>
                <div class="ad-text">${ad.description}</div>
                <div class="ad-price">💰 ${ad.price} рублей</div>
                <div class="ad-contact">📞 Контакты: ${ad.contact}</div>
                ${photosHTML}
                <div class="ad-date">Добавлено: ${new Date(ad.created_at).toLocaleString('ru-RU')}</div>
            `
            
            adContainer.appendChild(adItem)
        })
    } catch (error) {
        console.error('Ошибка загрузки:', error)
    }
}

function clearForm() {
    document.getElementById('ad-title').value = ''
    document.getElementById('ad-text').value = ''
    document.getElementById('ad-price').value = ''
    document.getElementById('ad-contact').value = ''
    document.getElementById('ad-photo').value = ''
    document.getElementById('photo-preview').innerHTML = ''
    selectedPhotos = []
}

function openPhoto(photoSrc) {
    const newWindow = window.open('', '_blank')
    newWindow.document.write(`
        <html>
            <head><title>Просмотр фотографии</title></head>
            <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
                <img src="${photoSrc}" style="max-width:100%; max-height:100%;">
                <button onclick="window.close()" style="position:absolute; top:10px; right:10px; background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">Закрыть</button>
            </body>
        </html>
    `)
}

// Загружаем объявления при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadAds()
})
