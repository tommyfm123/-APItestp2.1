import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Quagga = dynamic(() => import('quagga'), { ssr: false });

function getCodeType(code: string) {
  if (/^\d{12}$/.test(code)) return 'UPC';
  if (/^\d{13}$/.test(code)) {
    if (code.startsWith('978') || code.startsWith('979')) return 'ISBN-13';
    return 'EAN-13';
  }
  if (/^\d{9}[\dXx]$/.test(code)) return 'ISBN-10';
  return 'Unknown';
}

export default function Page() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  async function search(code: string) {
    const type = getCodeType(code);
    try {
      const resp = await fetch(`/api/search/${code}`);
      const data = await resp.json();
      setResult({ type, data });
    } catch (e: any) {
      setResult({ error: e.message });
    }
  }

  function startScanner() {
    if (!scannerRef.current) return;
    setScanning(true);
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: scannerRef.current
      },
      decoder: {
        readers: ['ean_reader', 'ean_13_reader', 'upc_reader', 'upc_e_reader']
      }
    }, (err: any) => {
      if (err) { console.error(err); return; }
      Quagga.start();
    });

    Quagga.onDetected(data => {
      const c = data.codeResult.code;
      setCode(c);
      stopScanner();
      search(c);
    });
  }

  function stopScanner() {
    Quagga.stop();
    setScanning(false);
    if (scannerRef.current) scannerRef.current.innerHTML = '';
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Buscar producto</h2>
      <Input
        placeholder="Ingresa o escanea un código"
        value={code}
        onChange={e => setCode(e.target.value)}
        onBlur={() => code && search(code)}
      />
      <Button onClick={scanning ? stopScanner : startScanner}>
        {scanning ? 'Detener' : 'Escanear con cámara'}
      </Button>
      <div ref={scannerRef} className="w-full max-w-xs mx-auto" />
      {result && (
        <pre className="whitespace-pre-wrap break-all text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
