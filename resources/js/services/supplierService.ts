import axios from 'axios';
import { Supplier, SupplierFormData } from '../types/supplier';

const API_BASE_URL = '/api/suppliers';

export const supplierService = {
  /**
   * Get all suppliers
   */
  async getAll(url: string | null = null): Promise<any> {
    const requestUrl = url || API_BASE_URL;
    const response = await axios.get(requestUrl);
    return response.data;
  },

  /**
   * Get a single supplier by ID
   */
  async getById(id: number): Promise<Supplier> {
    const response = await axios.get<Supplier>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new supplier
   */
  async create(data: SupplierFormData): Promise<Supplier> {
    const response = await axios.post<Supplier>(API_BASE_URL, data);
    return response.data;
  },

  /**
   * Update an existing supplier
   */
  async update(id: number, data: SupplierFormData): Promise<Supplier> {
    const response = await axios.put<Supplier>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a supplier
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};