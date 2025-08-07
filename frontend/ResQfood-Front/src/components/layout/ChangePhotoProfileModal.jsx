import React, { useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { UploadCloud, X } from 'lucide-react';
import API_BASE_URL from '../../api/config';

const ChangePhotoProfileModal = ({ onClose, onUploadSuccess }) => {
  const { getToken } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Por favor, selecciona un archivo primero.");
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('avatar', selectedFile); 

    try {
      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/api/usuario/me/avatar`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData, 
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al subir la imagen.');
      }

      onUploadSuccess(data.user); 
      onClose(); 

    } catch (err) {
      console.error("Error al subir la foto:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Cambiar Foto de Perfil</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div 
            className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-primary hover:text-primary"
            onClick={() => fileInputRef.current.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Previsualización" className="w-full h-full object-contain" />
            ) : (
              <>
                <UploadCloud size={40} />
                <p className="mt-2 text-sm">Haz clic para seleccionar una imagen</p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP hasta 5MB</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/png, image/jpeg, image/webp" 
            className="hidden"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center px-6">{error}</p>}

        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50">Cancelar</button>
          <button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-brandPrimaryDarker disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Subiendo..." : "Guardar Foto"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePhotoProfileModal;