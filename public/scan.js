function getCodeType(code){
  if(/^\d{12}$/.test(code)) return 'UPC';
  if(/^\d{13}$/.test(code)){
    if(code.startsWith('978') || code.startsWith('979')) return 'ISBN-13';
    return 'EAN-13';
  }
  if(/^\d{9}[\dXx]$/.test(code)) return 'ISBN-10';
  return 'Unknown';
}

async function search(code){
  const type = getCodeType(code);
  const resultEl = document.getElementById('result');
  try{
    const resp = await fetch(`/api/search/${code}`);
    const data = await resp.json();
    resultEl.textContent = JSON.stringify({type, data}, null, 2);
  }catch(e){
    resultEl.textContent = 'Error al buscar el código';
  }
}

const input = document.getElementById('code-input');
input.addEventListener('change', () => {
  const code = input.value.trim();
  if(code) search(code);
});

document.getElementById('scan-button').addEventListener('click', () => {
  const container = document.getElementById('scanner-container');
  container.style.display = 'block';
  Quagga.init({
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: container
    },
    decoder: {
      readers: ['ean_reader','ean_13_reader','upc_reader','upc_e_reader']
    }
  }, (err) => {
    if(err){
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    input.value = code;
    Quagga.stop();
    container.innerHTML = '';
    container.style.display = 'none';
    search(code);
  });
});
