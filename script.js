const API_URL = 'https://api-web.dnccudinus.org/api/mobil';

let listMobil = [];

const carGrid = document.getElementById('carGrid');
const loading = document.getElementById('loading');
const noData = document.getElementById('noData');
const searchInput = document.getElementById('searchInput');
const brandFilter = document.getElementById('brandFilter');
const carModal = document.getElementById('carModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

// Elemen Custom Modal Beli
const buyModal = document.getElementById('buyModal');
const buyModalText = document.getElementById('buyModalText');
const closeBuyModal = document.getElementById('closeBuyModal');

function formatRupiah(angka) {
  if (!angka) return "Rp -";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
}

function ambilDataMobil() {
  loading.classList.remove('hidden');

  fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
      }
      return response.json();
    })
    .then(data => {
      let dataHasil = Array.isArray(data) ? data : (data.data || []);
      
      listMobil = dataHasil;
      tampilkanKatalog(listMobil);
      isiPilihanMerk(listMobil);
    })
    .catch(error => {
      console.error('Terjadi kesalahan saat fetch API:', error);
      carGrid.innerHTML = '';
      noData.classList.remove('hidden');
      noData.querySelector('p').textContent = 'Gagal memuat data dari server API panitia. Periksa koneksi internet Anda.';
    })
    .finally(() => {
      loading.classList.add('hidden');
    });
}

function tampilkanKatalog(data) {
  carGrid.innerHTML = '';

  if (data.length === 0) {
    noData.classList.remove('hidden');
    return;
  }

  noData.classList.add('hidden');

  data.forEach(mobil => {
    const card = document.createElement('div');
    card.className = 'car-card';

    const namaMobil = mobil.nama || mobil.nama_mobil || 'Mobil';
    const merkMobil = mobil.merk || 'Executive';
    const hargaMobil = mobil.harga || 0;
    const gambarMobil = mobil.gambar || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80';

    card.innerHTML = `
      <img src="${gambarMobil}" alt="${namaMobil}" class="car-image" onerror="this.src='https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80'">
      <div class="car-info">
        <div>
          <span class="car-brand">${merkMobil}</span>
          <h3 class="car-title">${namaMobil}</h3>
          <div class="car-price">${formatRupiah(hargaMobil)}</div>
        </div>
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
          <button class="btn btn-primary" onclick="bukaDetail(${mobil.id})" style="flex: 1;">Detail</button>
          <button class="btn" onclick="beliMobil('${namaMobil}')" style="flex: 1; background-color: #059669; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Beli</button>
        </div>
      </div>
    `;

    carGrid.appendChild(card);
  });
}

function isiPilihanMerk(data) {
  const semuaMerk = [...new Set(data.map(m => m.merk).filter(Boolean))];
  
  brandFilter.innerHTML = '<option value="ALL">Semua Merk</option>';
  semuaMerk.forEach(merk => {
    const opsi = document.createElement('option');
    opsi.value = merk;
    opsi.textContent = merk;
    brandFilter.appendChild(opsi);
  });
}

function filterMobil() {
  const kataKunci = searchInput.value.toLowerCase();
  const merkPilihan = brandFilter.value;

  const hasilFilter = listMobil.filter(mobil => {
    const nama = (mobil.nama || '').toLowerCase();
    const merk = (mobil.merk || '').toLowerCase();

    const cocokSearch = nama.includes(kataKunci) || merk.includes(kataKunci);
    const cocokBrand = merkPilihan === 'ALL' || mobil.merk === merkPilihan;

    return cocokSearch && cocokBrand;
  });

  tampilkanKatalog(hasilFilter);
}

function bukaDetail(id) {
  const mobil = listMobil.find(item => item.id === id);
  if (!mobil) return;

  const nama = mobil.nama || 'Mobil';
  const harga = formatRupiah(mobil.harga);
  const deskripsi = mobil.deskripsi || 'Tidak ada deskripsi tersedia.';
  const gambar = mobil.gambar || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80';

  modalBody.innerHTML = `
    <img src="${gambar}" alt="${nama}" style="width:100%; height:200px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">
    <h2>${nama}</h2>
    <p style="color:#38bdf8; font-weight:bold; font-size:1.2rem; margin-bottom:1rem;">${harga}</p>
    <p style="font-size:0.9rem; color:#cbd5e1;">${deskripsi}</p>
  `;

  carModal.style.display = 'flex';
}

// Fungsi Custom Notifikasi Beli
function beliMobil(nama) {
  buyModalText.innerHTML = `Terima kasih! Anda telah memesan unit <strong style="color: #38bdf8;">${nama}</strong>. Silakan lanjutkan proses administrasi showroom kami.`;
  buyModal.style.display = 'flex';
}

searchInput.addEventListener('input', filterMobil);
brandFilter.addEventListener('change', filterMobil);

closeModal.addEventListener('click', () => {
  carModal.style.display = 'none';
});

// Event Listener untuk menutup Custom Modal Beli
closeBuyModal.addEventListener('click', () => {
  buyModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === carModal) {
    carModal.style.display = 'none';
  }
  if (e.target === buyModal) {
    buyModal.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', ambilDataMobil);