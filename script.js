// Awal file script.js yang sudah dirapikan

// --- FUNGSI GLOBAL YANG BISA DIPANGGIL DI MANA SAJA ---

// Fungsi untuk efek 3D Tilt pada kartu
function applyTiltEffect(cards) {
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;
            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// --- EVENT LISTENER UTAMA (HANYA SATU) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- BAGIAN 1: LOGIKA YANG BERJALAN DI SEMUA HALAMAN ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const protectedLinks = document.querySelectorAll('.protected-link');
    const publicLinks = document.querySelectorAll('.public-link');

    // Mengatur visibilitas link navbar berdasarkan status login
    if (isLoggedIn) {
        protectedLinks.forEach(link => link.style.display = 'list-item');
        publicLinks.forEach(link => link.style.display = 'none');
    } else {
        protectedLinks.forEach(link => link.style.display = 'none');
        publicLinks.forEach(link => link.style.display = 'list-item');
    }

    // Logika untuk tombol logout
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }

    // --- BAGIAN 2: LOGIKA SPESIFIK PER HALAMAN ---

    // Jalankan skrip Parallax HANYA jika ada elemen .parallax-bg
    if (document.querySelector('.parallax-bg')) {
        document.addEventListener('mousemove', function(e) {
            const layers = document.querySelectorAll('.parallax-bg .layer, .moon');
            const x = (window.innerWidth - e.pageX * 2) / window.innerWidth;
            const y = (window.innerHeight - e.pageY * 2) / window.innerHeight;
            layers.forEach(layer => {
                const speed = layer.getAttribute('data-speed');
                const xMove = x * speed * 20;
                const yMove = y * speed * 20;
                layer.style.transform = `translateX(${xMove}px) translateY(${yMove}px)`;
            });
        });
    }

    // Terapkan efek tilt pada kartu dashboard
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length > 0) {
        applyTiltEffect(statCards);
    }
    
    // Jalankan skrip Journal HANYA jika ada form jurnal
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
        // ... (SALIN SEMUA KODE JURNAL KAMU DARI 'DOMContentLoaded' YANG LAMA, LALU PASTE DI SINI) ...
        // Mulai dari const journalList = ... sampai renderJournals();
        const journalList = document.getElementById('journal-list');

        const getJournals = () => JSON.parse(localStorage.getItem('journals')) || [];
        const saveJournals = (journals) => localStorage.setItem('journals', JSON.stringify(journals));
        
        const renderJournals = () => {
            const journals = getJournals();
            journalList.innerHTML = '';
            journals.forEach(journal => {
                const journalCard = document.createElement('div');
                journalCard.className = 'journal-card animate-fade-up';
                const formattedDate = new Date(journal.id).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
                journalCard.innerHTML = `
                    <div class="journal-header"><h3>${journal.name}</h3><span>Kelas: ${journal.class}</span></div>
                    <p class="journal-content">${journal.content}</p>
                    <div class="journal-footer"><span class="journal-date">${formattedDate}</span><button class="delete-btn" data-id="${journal.id}">Hapus</button></div>
                `;
                journalList.appendChild(journalCard);
            });
            // Terapkan efek tilt ke kartu jurnal yang baru dirender
            applyTiltEffect(journalList.querySelectorAll('.journal-card'));
        };

        journalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('nama').value.trim();
            const studentClass = document.getElementById('kelas').value.trim();
            const content = document.getElementById('isi-jurnal').value.trim();
            if (!name || !studentClass || !content) { alert('Semua kolom harus diisi!'); return; }
            const newJournal = { id: Date.now(), name, class: studentClass, content };
            const journals = getJournals();
            journals.unshift(newJournal);
            saveJournals(journals);
            journalForm.reset();
            renderJournals();
        });

        journalList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const journalId = e.target.getAttribute('data-id');
                const isConfirmed = confirm('Anda yakin ingin menghapus jurnal ini? Aksi ini tidak bisa dibatalkan.');
                if (isConfirmed) {
                    let journals = getJournals();
                    journals = journals.filter(journal => journal.id != journalId);
                    saveJournals(journals);
                    renderJournals();
                }
            }
        });

        renderJournals();
    }
});