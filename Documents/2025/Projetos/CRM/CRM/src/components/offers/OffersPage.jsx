import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductList } from './ProductList';
import { FlyerPreview } from './FlyerPreview';
import { SearchBar } from './SearchBar';
import { useProducts } from '../../hooks/useProducts';
import { offerService } from '../../services/offerService';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'selectedOfferProducts';

export function OffersPage() {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const { products, loading: productsLoading, error: productsError } = useProducts({ showOnlyTop20: true });
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(() => {
    // Inicializa o estado com os produtos salvos no localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    loadTopProducts();
  }, []);

  // Salva os produtos selecionados no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const loadTopProducts = async () => {
    try {
      const data = await offerService.listOffers();
      setTopProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error loading top products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
  };

  const handleSendToMarketo = async () => {
    if (selectedProducts.length < 6) {
      toast.error('Selecione 6 produtos para enviar ao Marketo');
      return;
    }

    try {
      // Marcar produtos selecionados como TOP 20
      await offerService.createOffer({
        productIds: selectedProducts.map(p => p.id)
      });

      toast.success('Produtos marcados como TOP 20 com sucesso!');
      setSelectedProducts([]); // Limpa produtos selecionados
      localStorage.removeItem(STORAGE_KEY); // Limpa o localStorage
      loadTopProducts(); // Recarrega a lista de produtos TOP 20
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Erro ao atualizar produtos: ' + error.message);
    }
  };

  if (productsLoading || loading) {
    return <div className="flex items-center justify-center h-full">Carregando...</div>;
  }

  if (productsError || error) {
    return <div className="text-red-500">Erro ao carregar dados: {productsError || error}</div>;
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
                    Mostrando TOP 20 produtos
                  </p>
                </div>
                <SearchBar onSearch={handleSearch} />
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
                  Marcar como TOP 20
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