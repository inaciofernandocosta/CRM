import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../../lib/supabaseClient';

const getImageUrl = (image_url) => {
  if (!image_url) return '';
  
  if (image_url.startsWith('http')) {
    return image_url;
  }
  
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(image_url);
    
  return data?.publicUrl || '';
};

function PreviewModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-dark-card rounded-lg shadow-xl max-w-4xl w-full">
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => {
                // Aqui você pode implementar a lógica de copiar para WhatsApp
                // Por exemplo, gerar uma versão otimizada para WhatsApp e copiar para a área de transferência
                alert('Em breve: Copiar para WhatsApp');
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Copiar para WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M187.58,144.84l-32-16a8,8,0,0,0-7.16,0l-32,16a8,8,0,0,0-4.42,7.16v48a8,8,0,0,0,4.42,7.16l32,16a8,8,0,0,0,7.16,0l32-16a8,8,0,0,0,4.42-7.16V152A8,8,0,0,0,187.58,144.84ZM176,196.94l-24,12-24-12V156.94l24-12,24,12ZM248,128a120,120,0,0,1-240,0c0-24.4,7.24-47.76,21.17-68.06L8,16.69A8,8,0,0,1,19.31,8l43.25,21.17A119.87,119.87,0,0,1,128,8,120,120,0,0,1,248,128Zm-16,0A104,104,0,1,0,128,232,104.11,104.11,0,0,0,232,128Z"/>
              </svg>
            </button>
            <button
              onClick={() => {
                // Aqui você pode implementar a lógica de copiar para Email
                // Por exemplo, gerar uma versão HTML do folheto e copiar para a área de transferência
                alert('Em breve: Copiar para Email');
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Copiar para Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Fechar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function FlyerPreview({ products, onRemove }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const FlyerContent = () => (
    <div className="bg-white dark:bg-dark-hover rounded-lg border border-gray-100 dark:border-gray-800">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 text-center">
        <h2 className="text-2xl font-bold text-primary">Ofertas Especiais</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Válido até [Data]</p>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        {[...Array(6)].map((_, index) => {
          const product = products[index];
          
          return (
            <div
              key={index}
              className="border border-gray-100 dark:border-gray-800 rounded-lg p-2 relative"
            >
              {product ? (
                <>
                  {!isPreviewOpen && (
                    <button
                      onClick={() => onRemove(product.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                      </svg>
                    </button>
                  )}
                  <div className="relative w-full h-24 mb-2">
                    <img
                      src={getImageUrl(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-product.png';
                      }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    R${Number(product.price).toFixed(2)}
                  </p>
                </>
              ) : (
                <div className="w-full h-full min-h-[120px] flex items-center justify-center text-gray-400 border-2 border-dashed">
                  Espaço Vazio
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Termos e condições se aplicam. Preços sujeitos a alteração sem aviso prévio.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-white dark:bg-dark-card rounded-lg shadow-sm hover:shadow transition-all"
          title="Visualizar em tela cheia"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,48V96a8,8,0,0,1-16,0V67.31L156.28,119a8,8,0,0,1-11.31-11.31L196.69,56H168a8,8,0,0,1,0-16h48A8,8,0,0,1,224,48ZM99.72,137a8,8,0,0,0-11.31,0L36.69,188.69,32,184V156a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H43.31L95,144.28A8,8,0,0,0,99.72,137Z"/>
          </svg>
        </button>
        <FlyerContent />
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      >
        <FlyerContent />
      </PreviewModal>
    </>
  );
}