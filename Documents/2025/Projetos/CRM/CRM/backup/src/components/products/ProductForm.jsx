import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export function ProductForm({ product, onSave, onClose }) {
  const [formData, setFormData] = useState(product ? {
    name: product.name || '',
    description: product.description || '',
    price: product.price || '',
    image: product.image_url || null,
    is_top_20: product.is_top_20 || false
  } : {
    name: '',
    description: '',
    price: '',
    image: null,
    is_top_20: false
  });
  
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || (!formData.image && !product?.image_url)) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Convert price to number
    const numericPrice = typeof formData.price === 'string' 
      ? parseFloat(formData.price.replace(',', '.'))
      : parseFloat(formData.price);

    if (isNaN(numericPrice)) {
      toast.error('Preço inválido');
      return;
    }

    // Se estamos editando e a imagem não mudou, mantemos a URL original
    const imageToSave = formData.image === product?.image_url ? product.image_url : formData.image;

    console.log('FormData antes de salvar:', formData);
    
    onSave({
      name: formData.name,
      description: formData.description,
      price: numericPrice,
      image: imageToSave,
      is_top_20: formData.is_top_20 || false
    });
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                {product ? 'Editar Produto' : 'Novo Produto'}
              </Dialog.Title>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Preço *
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Imagem do Produto *
                </label>
                <div className="mt-1 flex items-center gap-4">
                  {formData.image ? (
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: null })}
                        className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Selecionar Imagem
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleImageChange}
                    accept="image/png,image/jpeg,image/gif"
                    className="hidden"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  PNG, JPG ou GIF (máx. 5MB)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTop20"
                  checked={formData.is_top_20}
                  onChange={(e) => setFormData({ ...formData, is_top_20: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isTop20" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Incluir nos TOP 20 produtos
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {product ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </Card>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}