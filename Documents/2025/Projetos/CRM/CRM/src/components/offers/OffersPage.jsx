import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProductList } from './ProductList';
import { FlyerPreview } from './FlyerPreview';
import { SearchBar } from './SearchBar';
import toast from 'react-hot-toast';

const initialProducts = [
  {
    id: 1,
    name: 'Omo Lavagem Perfeita',
    price: 29.90,
    image: 'https://www.vilanova.com.br/caixa-de-bombom-lacta-favoritos-250-6g',
    description: 'Sabão em pó, 2kg'
  },
  {
    id: 2,
    name: 'Dove Original',
    price: 3.99,
    image: 'https://placehold.co/200x200',
    description: 'Sabonete, 90g'
  },
  {
    id: 3,
    name: 'Pantene Hidratação',
    price: 19.90,
    image: 'https://placehold.co/200x200',
    description: 'Shampoo, 400ml'
  },
  {
    id: 4,
    name: 'Veja Multiuso Original',
    price: 8.99,
    image: 'https://placehold.co/200x200',
    description: 'Limpador, 500ml'
  },
  {
    id: 5,
    name: 'Nivea Hidratante',
    price: 24.90,
    image: 'https://placehold.co/200x200',
    description: 'Creme corporal, 400ml'
  },
  {
    id: 6,
    name: 'Pinho Sol Original',
    price: 12.90,
    image: 'https://placehold.co/200x200',
    description: 'Desinfetante, 1L'
  },
  {
    id: 7,
    name: 'Colgate Total 12',
    price: 7.99,
    image: 'https://placehold.co/200x200',
    description: 'Creme dental, 90g'
  },
  {
    id: 8,
    name: 'Lysol Desinfetante',
    price: 15.90,
    image: 'https://placehold.co/200x200',
    description: 'Spray, 300ml'
  },
  {
    id: 9,
    name: 'Rexona Clinical',
    price: 18.90,
    image: 'https://placehold.co/200x200',
    description: 'Antitranspirante, 50ml'
  },
  {
    id: 10,
    name: 'Comfort Concentrado',
    price: 16.90,
    image: 'https://placehold.co/200x200',
    description: 'Amaciante, 1L'
  },
  {
    id: 11,
    name: 'Clear Anticaspa',
    price: 22.90,
    image: 'https://placehold.co/200x200',
    description: 'Shampoo, 400ml'
  },
  {
    id: 12,
    name: 'Vanish Power O2',
    price: 25.90,
    image: 'https://placehold.co/200x200',
    description: 'Alvejante, 1L'
  },
  {
    id: 13,
    name: 'Protex Antibacteriano',
    price: 4.50,
    image: 'https://placehold.co/200x200',
    description: 'Sabonete, 90g'
  },
  {
    id: 14,
    name: 'Gillette Prestobarba',
    price: 19.90,
    image: 'https://placehold.co/200x200',
    description: 'Aparelho + 2 cargas'
  },
  {
    id: 15,
    name: 'Seda Ceramidas',
    price: 11.90,
    image: 'https://placehold.co/200x200',
    description: 'Condicionador, 325ml'
  },
  {
    id: 16,
    name: 'Cif Cremoso',
    price: 9.90,
    image: 'https://placehold.co/200x200',
    description: 'Limpador, 250ml'
  },
  {
    id: 17,
    name: 'Oral-B Pro-Saúde',
    price: 8.90,
    image: 'https://placehold.co/200x200',
    description: 'Escova dental'
  },
  {
    id: 18,
    name: "Johnson\\'s Baby",
    price: 21.90,
    image: 'https://placehold.co/200x200',
    description: 'Shampoo, 400ml'
  },
  {
    id: 19,
    name: 'Listerine Cool Mint',
    price: 23.90,
    image: 'https://placehold.co/200x200',
    description: 'Enxaguante, 500ml'
  },
  {
    id: 20,
    name: 'Brilhante Multi Tecidos',
    price: 27.90,
    image: 'https://placehold.co/200x200',
    description: 'Sabão em pó, 2kg'
  }
];

export function OffersPage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProductSelect = (product) => {
    if (selectedProducts.length >= 6) {
      toast.error('Máximo de 6 produtos permitidos no folheto');
      return;
    }
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleProductRemove = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredProducts = initialProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendToMarketo = () => {
    if (selectedProducts.length < 6) {
      toast.error('Selecione 6 produtos para enviar ao Marketo');
      return;
    }
    // Lógica para enviar ao Marketo
    toast.success('Folheto enviado ao Marketo com sucesso!');
  };

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Ofertas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Produtos Disponíveis</h2>
              <SearchBar onSearch={handleSearch} />
            </CardHeader>
            <CardContent>
              <ProductList
                products={filteredProducts}
                onSelect={handleProductSelect}
                selectedIds={selectedProducts.map(p => p.id)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ofertas Especiais</h2>
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
                onRemove={handleProductRemove}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}