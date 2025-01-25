import React from 'react';
import { Menu } from '@headlessui/react';
import clsx from 'clsx';

export function ProductTable({ products, onEdit, onDelete, onToggleTop20 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Produto</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Descrição</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Preço</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">TOP 20</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr 
              key={product.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.description}</p>
              </td>
              <td className="py-3 px-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  R${Number(product.price).toFixed(2)}
                </p>
              </td>
              <td className="py-3 px-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={product.is_top_20}
                    onChange={() => onToggleTop20(product.id)}
                    className="checkbox-custom"
                  />
                </label>
              </td>
              <td className="py-3 px-4 text-right">
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-hover rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M112,60a16,16,0,1,1,16,16A16,16,0,0,1,112,60Zm16,52a16,16,0,1,0,16,16A16,16,0,0,0,128,112Zm0,68a16,16,0,1,0,16,16A16,16,0,0,0,128,180Z" />
                    </svg>
                  </Menu.Button>

                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 focus:outline-none">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onEdit(product)}
                            className={clsx(
                              'flex w-full items-center px-3 py-2 text-sm rounded-md',
                              active ? 'bg-gray-100 dark:bg-dark-hover' : ''
                            )}
                          >
                            Editar Produto
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => onDelete(product.id)}
                            className={clsx(
                              'flex w-full items-center px-3 py-2 text-sm rounded-md text-red-600 dark:text-red-400',
                              active ? 'bg-gray-100 dark:bg-dark-hover' : ''
                            )}
                          >
                            Excluir Produto
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}