
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




function toggleMenu() {
  const nav = document.getElementById("navLinks");  
  nav.classList.toggle("show");
}
   

        document.addEventListener('DOMContentLoaded', () => {
            const journalForm = document.getElementById('journal-form');
            const journalList = document.getElementById('journal-list');

            const getJournals = () => {
                return JSON.parse(localStorage.getItem('journals')) || [];
            };

            const saveJournals = (journals) => {
                localStorage.setItem('journals', JSON.stringify(journals));
            };

            const renderJournals = () => {
                const journals = getJournals();
                journalList.innerHTML = ''; 
                if (journals.length === 0) {
                    journalList.innerHTML = '<p class="no-journal">Belum ada jurnal yang disimpan.</p>';
                    return;
                }

                journals.forEach(journal => {
                    const journalCard = document.createElement('div');
                    journalCard.className = 'journal-card animate-fade-up';
                    
                    const formattedDate = new Date(journal.id).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'long', year: 'numeric'
                    });

                    journalCard.innerHTML = `
                        <div class="journal-header">
                            <h3>${journal.name}</h3>
                            <span>Kelas: ${journal.class}</span>
                        </div>
                        <p class="journal-content">${journal.content}</p>
                        <div class="journal-footer">
                            <span class="journal-date">${formattedDate}</span>
                            <button class="delete-btn" data-id="${journal.id}">Hapus</button>
                        </div>
                    `;
                    journalList.appendChild(journalCard);
                });
            };

            journalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('nama').value.trim();
                const studentClass = document.getElementById('kelas').value.trim();
                const content = document.getElementById('isi-jurnal').value.trim();

                if (!name || !studentClass || !content) {
                    alert('Semua kolom harus diisi!');
                    return;
                }

                const newJournal = {
                    id: Date.now(),
                    name: name,
                    class: studentClass,
                    content: content
                };

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
        });


// script.js
function applyTiltEffect(cards) {
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;

            const rotateX = ((y - centerY) / centerY) * -7; // Pengali untuk intensitas
            const rotateY = ((x - centerX) / centerX) * 7;  // Pengali untuk intensitas

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'; // Kembali ke posisi normal
        });
    });
}

// Panggil fungsi ini saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.stat-card');
    const journalCards = document.querySelectorAll('.journal-card'); // Ini akan kosong di awal, kita atasi nanti
    
    applyTiltEffect(statCards);
    
    // Karena journal-card dibuat dinamis, kita perlu cara khusus
    // Kita gunakan MutationObserver untuk mendeteksi saat kartu jurnal ditambahkan
    const journalList = document.getElementById('journal-list');
    if (journalList) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    const newCards = journalList.querySelectorAll('.journal-card');
                    applyTiltEffect(newCards);
                }
            });
        });
        observer.observe(journalList, { childList: true });
    }
});