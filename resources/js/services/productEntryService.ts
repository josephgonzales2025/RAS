import axios from 'axios';
import { ProductEntry, ProductEntryFormData } from '../types/merchandiseEntry';

const API_BASE_URL = '/api/product-entries';

export const productEntryService = {
  /**
   * Get all product entries
   */
  async getAll(): Promise<ProductEntry[]> {
    const response = await axios.get<ProductEntry[]>(API_BASE_URL);
    return response.data;
  },

  /**
   * Get product entries by merchandise entry ID
   */
  async getByMerchandiseEntryId(merchandiseEntryId: number): Promise<ProductEntry[]> {
    const response = await axios.get<ProductEntry[]>(`${API_BASE_URL}/${merchandiseEntryId}`);
    return response.data;
  },

  /**
   * Create a new product entry
   */
  async create(data: ProductEntryFormData & { merchandise_entry_id: number }): Promise<ProductEntry> {
    const response = await axios.post<{ productEntry: ProductEntry }>(API_BASE_URL, data);
    return response.data.productEntry;
  },

  /**
   * Update an existing product entry
   */
  async update(id: number, data: Partial<ProductEntryFormData>): Promise<ProductEntry> {
    const response = await axios.put<{ productEntry: ProductEntry }>(`${API_BASE_URL}/${id}`, data);
    return response.data.productEntry;
  },

  /**
   * Delete a product entry
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};