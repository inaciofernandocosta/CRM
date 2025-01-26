import { supabase } from '../lib/supabaseClient';

export const productService = {
  async listProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getProduct(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createProduct({ name, description, price, image_url, is_top_20 }) {
    console.log('Criando produto:', { name, description, price, image_url, is_top_20 });
    
    const { error } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        price,
        image_url,
        is_top_20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }

    // Buscar o produto recém-criado
    const { data: newProduct, error: fetchError } = await supabase
      .from('products')
      .select()
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar produto criado:', fetchError);
      throw fetchError;
    }

    return newProduct;
  },

  async updateProduct(id, { name, description, price, image_url, isTop20 }) {
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        image_url,
        is_top_20: isTop20,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }
};
