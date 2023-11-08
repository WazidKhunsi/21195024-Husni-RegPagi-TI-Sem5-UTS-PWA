    // Membuka atau membuat basis data IndexedDB
    const request = window.indexedDB.open("KomentarDB", 1);
    let db;

    request.onsuccess = function (event) {
      db = event.target.result;
    };

    request.onupgradeneeded = function (event) {
      db = event.target.result;
      const objectStore = db.createObjectStore("komentar", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("nama", "nama", { unique: false });
      objectStore.createIndex("komentar", "komentar", { unique: false });
    };

    // Menyimpan komentar ke dalam IndexedDB
    const komentarForm = document.getElementById("komentarForm");
    const namaInput = document.getElementById("nama");
    const komentarInput = document.getElementById("komentar");
    const daftarKomentar = document.getElementById("daftarKomentar");

    komentarForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const transaksi = db.transaction(["komentar"], "readwrite");
      const objectStore = transaksi.objectStore("komentar");
      const nama = namaInput.value;
      const komentar = komentarInput.value;

      objectStore.add({ nama, komentar });
      transaksi.oncomplete = function () {
        namaInput.value = "";
        komentarInput.value = "";
        tampilkanKomentarTerakhir();
      };
    });

    // Menampilkan komentar terakhir
    function tampilkanKomentarTerakhir() {
      daftarKomentar.innerHTML = "";

      const transaksi = db.transaction(["komentar"], "readonly");
      const objectStore = transaksi.objectStore("komentar");
      const request = objectStore.openCursor(null, "prev");

      request.onsuccess = function (event) {
        const cursor = event.target.result;
        if (cursor) {
          const komentarItem = document.createElement("li");
          komentarItem.textContent = `${cursor.value.nama}: ${cursor.value.komentar}`;
          daftarKomentar.appendChild(komentarItem);
          cursor.continue();
        }
      };
    }

    tampilkanKomentarTerakhir();
