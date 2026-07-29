import React, { useRef } from 'react';
import QRCode from "qrcode.react";
import { FaDownload } from "react-icons/fa";

const QRCodeGenerator = ({ data }) => {
  const qrRef = useRef();

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    downloadLink.click();
  };

  return (
    <div>
      <div ref={qrRef} className='text-center'>
        <QRCode value={data} size={300} />
        <div className="div">
        <button onClick={downloadQRCode} className='btn btn_primary fs-13 mt-4'><FaDownload className='ms-2 me-2'/>Download QR Code</button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
