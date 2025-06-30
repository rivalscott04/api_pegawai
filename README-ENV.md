# Pegawai API

## Langkah Awal
```
npm init -y
npm install express sequelize mysql2 dotenv
npm install cors
npm install
```

## Environment Setup

Aplikasi ini mendukung mode development dan production.

### Initial Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Install cross-env (untuk switching environment):
   ```
   npm install --save-dev cross-env
   ```
   Atau jalankan file `install-cross-env.bat`.

3. Buat file `.env` berdasarkan `.env.example` dan konfigurasi pengaturan Anda:
   ```
   # Environment
   NODE_ENV=development # atau production

   # Server Configuration
   PORT=3000

   # Frontend Domains
   DEV_DOMAINS=http://localhost:5173,http://localhost:8081
   PROD_PEGAWAI_DOMAIN=https://sdm.rivaldev.site

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=sdm
   ```

### Menjalankan Aplikasi

#### Mode Development
```
npm run dev
```

#### Mode Production
```
npm run prod
```

#### Mode Default (menggunakan NODE_ENV dari file .env)
```
npm start
```

## Environment Variables

- `NODE_ENV`: Set ke `development` atau `production`
- `PORT`: Port server akan berjalan
- `DEV_DOMAINS`: Daftar domain frontend untuk development (dipisahkan dengan koma, untuk CORS)
- `PROD_PEGAWAI_DOMAIN`: Domain frontend untuk pegawai di production (untuk CORS)
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Konfigurasi database pegawai
