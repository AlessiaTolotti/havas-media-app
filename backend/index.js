const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Setup multer per upload file in cartella uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Rotta test semplice
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend attivo!' });
});

// Rotta upload file
app.post('/api/upload', upload.fields([{ name: 'file_lavoro' }, { name: 'file_dizionario' }]), (req, res) => {
  res.json({ files: req.files });
});

app.listen(PORT, () => {
  console.log(`Backend avviato su http://localhost:${PORT}`);
});
