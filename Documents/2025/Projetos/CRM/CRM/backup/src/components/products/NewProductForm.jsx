import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';

export function NewProductForm({ isOpen, onClose, onSuccess, product = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    is_top_20: false,
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        is_top_20: product.is_top_20 || false,
        image: null
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = product?.image_url;

      // Upload da imagem se houver uma nova
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Math.random().toString().replace('.', '')}_${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        // Gerar URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Preparar dados do produto
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        is_top_20: formData.is_top_20,
        image_url: imageUrl
      };

      // Inserir ou atualizar produto
      const { data, error } = product
        ? await supabase
            .from('products')
            .update(productData)
            .eq('id', product.id)
            .select()
        : await supabase
            .from('products')
            .insert(productData)
            .select();

      if (error) throw error;

      toast.success(product ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
      onSuccess(data[0]);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => !isSubmitting && onClose()}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-lg bg-white dark:bg-gray-800 p-6 w-full">
          <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {product ? 'Editar Produto' : 'Novo Produto'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preço *
              </label>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Imagem do Produto
              </label>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:text-sm file:font-semibold
                         file:bg-primary-50 file:text-primary-700
                         hover:file:bg-primary-100
                         dark:file:bg-primary-900 dark:file:text-primary-300"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG ou GIF (máx. 5MB)
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_top_20"
                id="is_top_20"
                checked={formData.is_top_20}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_top_20" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Incluir nos TOP 20 produtos
              </label>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : product ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
