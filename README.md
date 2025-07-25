# API Pegawai - Employee Management System

API untuk sistem manajemen pegawai dan pensiun yang dibangun dengan Node.js, Express, dan Sequelize.

## 📋 Daftar Isi
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Authentication](#authentication)
- [Endpoints API](#endpoints-api)
- [Struktur Data](#struktur-data)
- [Contoh Response](#contoh-response)
- [Error Handling](#error-handling)

## 🚀 Instalasi

```bash
# Clone repository
git clone <repository-url>
cd api_pegawai

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file dengan konfigurasi database Anda

# Jalankan server
npm start
```

### Dependencies
```bash
npm install express sequelize mysql2 dotenv cors bcrypt jsonwebtoken multer
```

## ⚙️ Konfigurasi

Buat file `.env` dengan konfigurasi berikut:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your_jwt_secret_key
```

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk authentication. Beberapa endpoint memerlukan authentication.

### Headers yang diperlukan:
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Login untuk mendapatkan token:
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

## 📚 Endpoints API

### Base URL
```
http://localhost:3000/api
```

### 1. Authentication Endpoints

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Register User (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer <token>
```

### 2. Pegawai (Employee) Endpoints

#### Get All Employees
```http
GET /api/pegawai
```

**Response:**
```json
[
  {
    "nip": "123456789",
    "nama": "John Doe",
    "golongan": "III/a",
    "tmt_pensiun": "2025-12-31T00:00:00.000Z",
    "unit_kerja": "IT Department",
    "induk_unit": "Kantor Pusat",
    "jabatan": "Staff"
  }
]
```

#### Get Employee by NIP
```http
GET /api/pegawai/{nip}
```

#### Create New Employee
```http
POST /api/pegawai
Content-Type: application/json
```

**Request Body:**
```json
{
  "nip": "123456789",
  "nama": "John Doe",
  "golongan": "III/a",
  "tmt_pensiun": "2025-12-31",
  "unit_kerja": "IT Department",
  "induk_unit": "Kantor Pusat",
  "jabatan": "Staff"
}
```

#### Update Employee
```http
PUT /api/pegawai/{nip}
Content-Type: application/json
```

#### Delete Employee
```http
DELETE /api/pegawai/{nip}
```

#### Filter Employees
```http
GET /api/pegawai/filter?nama=John&golongan=III&unit_kerja=IT&isRetired=false
```

**Query Parameters:**
- `nama`: Filter by name (partial match)
- `golongan`: Filter by rank/grade (partial match)
- `unit_kerja`: Filter by work unit (partial match)
- `induk_unit`: Filter by parent unit (partial match)
- `jabatan`: Filter by position (partial match)
- `isRetired`: Filter by retirement status (`true`/`false`)

#### Get Workplace Information
```http
GET /api/pegawai/tempat-kerja
```

#### Get Retired Employees Count
```http
GET /api/pegawai/retired-count?induk_unit=Kantor&golongan=III
```

**Response:**
```json
{
  "retiredCount": 25
}
```

### 3. Pensiun (Pension) Endpoints

#### Get Pension by Employee NIP
```http
GET /api/pensiun/pegawai/{nip}
Authorization: Bearer <token>
```

#### Filter Pension Records
```http
GET /api/pensiun/filter?status=diajukan&jenis_pensiun_id=1
Authorization: Bearer <token>
```

#### Create Pension Record
```http
POST /api/pensiun
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `nip`: Employee NIP
- `jenis_pensiun_id`: Pension type ID
- `status`: Status (diajukan/diproses/selesai)
- `berkas`: File upload (optional)

### 4. Jenis Pensiun (Pension Types) Endpoints

#### Get All Pension Types
```http
GET /api/jenis-pensiun
```

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Atas Permintaan Sendiri (APS)"
  },
  {
    "id": 2,
    "nama": "Batas Usia Pensiun (BUP)"
  },
  {
    "id": 3,
    "nama": "Duda/Janda"
  }
]
```

// === Surat API ===

Endpoint manajemen surat umum:

- `POST /api/letters` — Simpan surat baru (beserta pegawai & tanda tangan)
- `GET /api/letters` — List/filter semua surat (bisa pakai query string: ?type=...&tanggal=...)
- `GET /api/letters/:id` — Detail surat (beserta pegawai & tanda tangan)
- `PUT /api/letters/:id` — Update surat (beserta pegawai & tanda tangan)
- `DELETE /api/letters/:id` — Hapus surat

**Catatan:**
- Filter surat cukup pakai query string di endpoint list, misal: `/api/letters?type=tugas`.
- Tidak perlu controller/filter khusus per jenis surat, kecuali ada kebutuhan logika/filter yang sangat spesifik.
- Field `content` pada surat bertipe JSON, sehingga bisa menampung data dinamis sesuai jenis surat.

// === End Surat API ===

## 📊 Struktur Data

### Employee (Pegawai)
```typescript
{
  nip: string (Primary Key),           // Employee ID Number
  nama: string,                        // Full Name
  golongan: string,                    // Rank/Grade
  tmt_pensiun: Date,                   // Retirement Date
  unit_kerja: string,                  // Work Unit
  induk_unit: string,                  // Parent Unit
  jabatan: string                      // Position/Job Title
}
```

### Pension (Pensiun)
```typescript
{
  id: number (Primary Key),
  nip: string (Foreign Key),           // Employee NIP
  jenis_pensiun_id: number (Foreign Key), // Pension Type ID
  status: enum('diajukan', 'diproses', 'selesai'), // Status
  berkas: string,                      // File path (optional)
  created_at: Date,
  updated_at: Date
}
```

### User
```typescript
{
  id: number (Primary Key),
  username: string,
  password: string (hashed),
  role: string,                        // 'admin' or 'user'
  name: string (optional)
}
```

## 📝 Contoh Response

### Success Response
```json
{
  "success": true,
  "data": {
    // response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## ❌ Error Handling

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Messages
- `"Username and password are required"` - Missing login credentials
- `"Invalid credentials"` - Wrong username/password
- `"Token expired"` - JWT token has expired
- `"No token provided"` - Missing Authorization header
- `"Pegawai not found"` - Employee with given NIP not found
- `"Failed to create pegawai"` - Error creating employee record

## 🔧 File Upload

Untuk endpoint yang mendukung file upload (seperti pension records), gunakan `multipart/form-data`:

**Supported file types:**
- PDF (.pdf)
- Word Documents (.doc, .docx)
- Images (.jpg, .jpeg, .png)

**File size limit:** 1.3MB

**Example using curl:**
```bash
curl -X POST \
  http://localhost:3000/api/pensiun \
  -H 'Authorization: Bearer <token>' \
  -F 'nip=123456789' \
  -F 'jenis_pensiun_id=1' \
  -F 'status=diajukan' \
  -F 'berkas=@/path/to/file.pdf'
```

## 🚀 Development

### Running the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

### Database Migration
Pastikan database sudah dibuat dan tabel-tabel sudah ter-setup sesuai dengan model yang didefinisikan.

## 📞 Support

Untuk pertanyaan atau bantuan, silakan hubungi tim development.
