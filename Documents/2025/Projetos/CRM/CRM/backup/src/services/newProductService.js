import { supabase } from '../lib/supabaseClient';

export const productService = {
  async getProducts() {
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

  async createProduct(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select();

    if (error) throw error;
    return data[0];
  },

  async updateProduct(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
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
    const fileName = \`\${Math.random()}\${Date.now()}.\${fileExt}\`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  async toggleTop20(id, currentValue) {
    const { data, error } = await supabase
      .from('products')
      .update({ is_top_20: !currentValue })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  }
};
