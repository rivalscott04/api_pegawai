// Server sederhana yang hanya mengembalikan data jenis pensiun
const express = require('express');
const app = express();

// Aktifkan CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Data jenis pensiun statis
const jenisPensiunData = [
  { id: 1, nama: 'Atas Permintaan Sendiri (APS)' },
  { id: 2, nama: 'Batas Usia Pensiun (BUP)' },
  { id: 3, nama: 'Duda/Janda' }
];

// Endpoint untuk jenis pensiun
app.get('/api/jenis-pensiun', (req, res) => {
  console.log('GET /api/jenis-pensiun dipanggil');
  return res.status(200).json(jenisPensiunData);
});

// Jalankan server pada port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Jenis Pensiun server running on port ${PORT}`);
  console.log(`Access the endpoint at: http://localhost:${PORT}/api/jenis-pensiun`);
});
