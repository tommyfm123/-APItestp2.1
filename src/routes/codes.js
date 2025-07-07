const express = require('express');
const router = express.Router();

function getCodeType(code) {
  if (/^\d{12}$/.test(code)) return 'UPC';
  if (/^\d{13}$/.test(code)) {
    if (code.startsWith('978') || code.startsWith('979')) return 'ISBN-13';
    return 'EAN-13';
  }
  if (/^\d{9}[\dXx]$/.test(code)) return 'ISBN-10';
  return 'Unknown';
}

router.get('/search/:code', async (req, res) => {
  const { code } = req.params;
  const type = getCodeType(code);
  try {
    let data = null;
    if (type.startsWith('ISBN')) {
      const resp = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${code}&format=json&jscmd=data`);
      data = await resp.json();
    } else if (type !== 'Unknown') {
      const resp = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      data = await resp.json();
    }
    res.json({ type, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
