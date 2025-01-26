import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductForm } from './ProductForm';
import { ProductTable } from './ProductTable';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.listProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Erro ao carregar produtos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      console.log('ProductData recebido:', productData);
      
      let imageUrl = productData.image;
      
      // Se a imagem for base64, faz o upload
      if (productData.image && productData.image.startsWith('data:')) {
        // Convert base64 to file
        const response = await fetch(productData.image);
        const blob = await response.blob();
        const file = new File([blob], 'product-image.jpg', { type: 'image/jpeg' });
        imageUrl = await productService.uploadImage(file);
      }
      // Se não for base64 e não for a URL existente, é uma nova imagem
      else if (productData.image && editingProduct && productData.image !== editingProduct.image_url) {
        imageUrl = await productService.uploadImage(productData.image);
      }

      const productToSave = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: imageUrl,
        is_top_20: productData.is_top_20 || false
      };

      console.log('Produto a ser salvo:', productToSave);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productToSave);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await productService.createProduct(productToSave);
        toast.success('Produto cadastrado com sucesso!');
      }
      
      loadProducts();
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await productService.deleteProduct(productId);
      toast.success('Produto removido com sucesso!');
      loadProducts();
    } catch (error) {
      toast.error('Erro ao remover produto: ' + error.message);
    }
  };

  const handleToggleTop20 = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const updatedProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        is_top_20: !product.is_top_20
      };

      await productService.updateProduct(productId, updatedProduct);
      toast.success('Produto atualizado com sucesso!');
      loadProducts();
    } catch (error) {
      toast.error('Erro ao atualizar produto: ' + error.message);
    }
  };

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Produtos</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            Cadastrar Produto
          </Button>
        </div>

        <div className="p-4">
          <Card>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <ProductTable
                products={products}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleTop20={handleToggleTop20}
              />
            )}
          </Card>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </main>
  );
}