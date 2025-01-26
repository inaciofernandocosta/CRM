import { supabase } from '../lib/supabaseClient';

export const offerService = {
  async listOffers() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_top_20', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createOffer({ title, description, startDate, endDate, productIds }) {
    // Atualizar os produtos selecionados para is_top_20 = true
    const { error } = await supabase
      .from('products')
      .update({ is_top_20: true })
      .in('id', productIds);

    if (error) {
      console.error('Erro ao atualizar produtos:', error);
      throw error;
    }

    // Buscar os produtos atualizados
    const { data: updatedProducts, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (fetchError) {
      console.error('Erro ao buscar produtos atualizados:', fetchError);
      throw fetchError;
    }

    return updatedProducts;
  }
};
