import { useState, useEffect } from 'react';

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      setOffers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createOffer = async (offerData) => {
    try {
      const response = await fetch('http://localhost:3001/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create offer');
      }
      
      const newOffer = await response.json();
      setOffers(prev => [...prev, newOffer]);
      return newOffer;
    } catch (err) {
      console.error('Error creating offer:', err);
      throw err;
    }
  };

  const updateOffer = async (id, offerData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update offer');
      }
      
      const updatedOffer = await response.json();
      setOffers(prev => prev.map(offer => 
        offer.id === id ? updatedOffer : offer
      ));
      return updatedOffer;
    } catch (err) {
      console.error('Error updating offer:', err);
      throw err;
    }
  };

  const deleteOffer = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/offers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete offer');
      }
      
      setOffers(prev => prev.filter(offer => offer.id !== id));
    } catch (err) {
      console.error('Error deleting offer:', err);
      throw err;
    }
  };

  return {
    offers,
    loading,
    error,
    refetch: fetchOffers,
    createOffer,
    updateOffer,
    deleteOffer,
  };
}
