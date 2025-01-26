import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductList } from './ProductList';
import { FlyerPreview } from './FlyerPreview';
import { SearchBar } from './SearchBar';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';

export function OffersPage() {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { products, loading, error } = useProducts({ showOnlyTop20: !showAllProducts });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product) => {
    if (selectedProducts.length >= 6) {
      toast.error('Máximo de 6 produtos permitidos no folheto');
      return;
    }
    setSelectedProducts(prev => [...prev, product]);
    toast.success('Produto adicionado ao folheto');
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Produto removido do folheto');
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Se o usuário começar a buscar, mostrar todos os produtos
    if (term && !showAllProducts) {
      setShowAllProducts(true);
    }
  };

  const handleSendToMarketo = () => {
    if (selectedProducts.length < 6) {
      toast.error('Selecione 6 produtos para enviar ao Marketo');
      return;
    }
    // Implementar integração com Marketo
    toast.success('Folheto enviado para o Marketo');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro ao carregar produtos: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ofertas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl">Produtos Disponíveis</h2>
                  <p className="text-sm text-gray-500">
                    {showAllProducts ? 'Mostrando todos os produtos' : 'Mostrando TOP 20 produtos'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                  <SearchBar onSearch={handleSearch} />
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAllProducts(!showAllProducts)}
                  >
                    {showAllProducts ? 'Mostrar TOP 20' : 'Mostrar Todos'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ProductList
                products={filteredProducts}
                onSelect={handleProductSelect}
                selectedIds={selectedProducts.map(p => p.id)}
              />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl">Ofertas Especiais</h2>
                  <p className="text-sm text-gray-500">
                    {selectedProducts.length}/6 produtos selecionados
                  </p>
                </div>
                <Button 
                  onClick={handleSendToMarketo}
                  disabled={selectedProducts.length < 6}
                >
                  Enviar ao Marketo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <FlyerPreview
                products={selectedProducts}
                onRemove={handleRemoveProduct}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}