import React from 'react';
import clsx from 'clsx';

export function ProductList({ products, onSelect, selectedIds }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-gray-100 dark:border-gray-800 rounded-lg p-4"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.description}</p>
          <p className="text-lg font-bold text-primary mb-4">R${product.price.toFixed(2)}</p>
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