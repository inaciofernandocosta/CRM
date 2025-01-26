import { useState, useEffect } from 'react';

export function useProducts({ showOnlyTop20 = true } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [showOnlyTop20]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5177/api/products?top20=${showOnlyTop20}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Formatar os produtos para o formato esperado pelo componente
      const formattedProducts = data.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image_url || 'https://placehold.co/200x200',
        description: product.description || '',
        isTop20: product.isTop20 || false
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}
