import React from 'react';
import clsx from 'clsx';
import { supabase } from '../../lib/supabaseClient';

export function ProductList({ products, onSelect, selectedIds }) {
  const getImageUrl = (image_url) => {
    if (!image_url) return '';
    
    // Se a URL já for completa (começa com http ou https), use-a diretamente
    if (image_url.startsWith('http')) {
      return image_url;
    }
    
    // Caso contrário, construa a URL do Storage do Supabase
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(image_url);
      
    return data?.publicUrl || '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-100 dark:border-gray-800 rounded-lg p-4"
        >
          <div className="relative w-full h-48 mb-4">
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.png'; // Imagem de fallback
              }}
            />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.description}</p>
          <p className="text-lg font-bold text-primary mb-4">R${Number(product.price).toFixed(2)}</p>
          <button
            onClick={() => onSelect(product)}
            disabled={selectedIds.includes(product.id)}
            className={clsx(
              'w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedIds.includes(product.id)
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-light'
            )}
          >
            {selectedIds.includes(product.id) ? 'Adicionado ao Folheto' : 'Adicionar ao Folheto'}
          </button>
        </div>
      ))}
    </div>
  );
}