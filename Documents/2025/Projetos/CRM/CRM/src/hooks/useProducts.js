import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useProducts({ showOnlyTop20 = true } = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [showOnlyTop20]);

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          image_url,
          is_top_20,
          created_at,
          updated_at
        `)
        .order('name');

      if (showOnlyTop20) {
        query = query.eq('is_top_20', true);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      // Formatar os produtos
      const formattedProducts = data.map(product => ({
        ...product,
        price: Number(product.price || 0),
        image_url: product.image_url || '',
        description: product.description || '',
      }));

      setProducts(formattedProducts);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}
