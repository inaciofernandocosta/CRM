import React from 'react';

export function FlyerPreview({ products, onRemove }) {
  return (
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
                  <button
                    onClick={() => onRemove(product.id)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                    </svg>
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary">
                    R${product.price.toFixed(2)}
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
}