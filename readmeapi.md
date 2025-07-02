-- SQL Table: letters
CREATE TABLE letters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  letter_type VARCHAR(50) NOT NULL,
  nomor_surat VARCHAR(100) NOT NULL,
  tanggal_surat DATE NOT NULL,
  perihal VARCHAR(255) NOT NULL,
  content JSON NOT NULL,
  created_by INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SQL Table: letter_employees
CREATE TABLE letter_employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  letter_id INT NOT NULL,
  nip VARCHAR(30) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE
);

-- SQL Table: letter_signatures
CREATE TABLE letter_signatures (
  id INT PRIMARY KEY AUTO_INCREMENT,
  letter_id INT NOT NULL,
  nip VARCHAR(30) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  urutan INT NOT NULL,
  FOREIGN KEY (letter_id) REFERENCES letters(id) ON DELETE CASCADE
);

# Surat API - General Letter Management

API ini digunakan untuk manajemen berbagai jenis surat (Surat Tugas, Nota Dinas, Surat Keputusan, dll) secara terpusat dan fleksibel.

## 📦 Struktur Database

### Tabel Utama: `letters`
| Field         | Tipe Data   | Keterangan                                 |
|---------------|-------------|--------------------------------------------|
| id            | INT, PK, AI | ID surat                                   |
| letter_type   | VARCHAR     | Jenis surat (tugas, nota, sk, dll)         |
| nomor_surat   | VARCHAR     | Nomor surat                                |
| tanggal_surat | DATE        | Tanggal surat                              |
| perihal       | VARCHAR     | Perihal/subject                            |
| content       | JSON/TEXT   | Isi surat dinamis (format JSON)            |
| created_by    | INT         | User pembuat                               |
| created_at    | DATETIME    |                                            |
| updated_at    | DATETIME    |                                            |

### Tabel Relasi: `letter_employees`
| Field      | Tipe Data   | Keterangan                |
|------------|-------------|---------------------------|
| id         | INT, PK, AI |                           |
| letter_id  | INT         | FK ke tabel `letters`     |
| nip        | VARCHAR     | NIP pegawai               |
| nama       | VARCHAR     | Nama pegawai              |
| jabatan    | VARCHAR     | Jabatan pegawai           |

### Tabel Relasi: `letter_signatures`
| Field      | Tipe Data   | Keterangan                |
|------------|-------------|---------------------------|
| id         | INT, PK, AI |                           |
| letter_id  | INT         | FK ke tabel `letters`     |
| nip        | VARCHAR     | NIP penandatangan         |
| nama       | VARCHAR     | Nama penandatangan        |
| jabatan    | VARCHAR     | Jabatan penandatangan     |
| urutan     | INT         | Urutan tanda tangan       |

---

## 🛠️ Catatan Implementasi (Model-Controller)

- **Model:**  
  - `Letter` (tabel `letters`)
  - `LetterEmployee` (tabel `letter_employees`)
  - `LetterSignature` (tabel `letter_signatures`)
- **Controller:**  
  - `LetterController` untuk handle create, read, update, delete surat.
  - Pastikan saat create/update, data relasi (employees, signatures) juga di-handle (bulk insert/update).

---

## 💡 Tips

- Field `content` gunakan tipe JSON agar fleksibel untuk berbagai jenis surat.
- Untuk validasi, cek field wajib sesuai jenis surat di controller.
- Endpoint bisa dikembangkan untuk export PDF, approval, dsb.

---

## 📞 Support

Jika ada pertanyaan terkait struktur atau integrasi, silakan hubungi tim FE.

# Endpoint Surat

## POST /api/letters

### Request Body
- `letter_type` (**string, required**): Jenis surat, contoh: `SURAT_TUGAS`, `SURAT_KEPUTUSAN`, `NOTA_DINAS`, dll. Field ini digunakan untuk membedakan format dan field input surat.
- `nomor_surat` (string, required): Nomor surat.
- `tanggal_surat` (string, required): Tanggal surat (format YYYY-MM-DD).
- `perihal` (string, required): Perihal surat.
- `content` (object, required): Data dinamis sesuai kebutuhan jenis surat.
- `created_by` (integer, required): ID user pembuat surat.
- (opsional) `employees`, `signatures`: Data pegawai dan tanda tangan jika diperlukan.

### Contoh Request
```json
{
  "letter_type": "SURAT_KEPUTUSAN",
  "nomor_surat": "123",
  "tanggal_surat": "2025-07-01",
  "perihal": "Penetapan Gelar",
  "content": { /* data dinamis */ },
  "created_by": 1
}
```

### Penjelasan
- Field `letter_type` WAJIB diisi dan digunakan backend untuk membedakan logika, format, dan field input surat.
- Setiap jenis surat dapat memiliki struktur `content` yang berbeda sesuai kebutuhan. 