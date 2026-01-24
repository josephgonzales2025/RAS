import axios from 'axios';
import { MerchandiseEntry, MerchandiseEntryFormData } from '../types/merchandiseEntry';

const API_BASE_URL = '/api/merchandise-entries';

export const merchandiseEntryService = {
  /**
   * Get all merchandise entries
   */
  async getAll(): Promise<MerchandiseEntry[]> {
    const response = await axios.get<MerchandiseEntry[]>(API_BASE_URL);
    return response.data;
  },

  /**
   * Get a single merchandise entry by ID
   */
  async getById(id: number): Promise<MerchandiseEntry> {
    const response = await axios.get<MerchandiseEntry>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new merchandise entry
   */
  async create(data: MerchandiseEntryFormData): Promise<MerchandiseEntry> {
    const response = await axios.post<MerchandiseEntry>(API_BASE_URL, data);
    return response.data;
  },

  /**
   * Update an existing merchandise entry
   */
  async update(id: number, data: Partial<MerchandiseEntryFormData>): Promise<MerchandiseEntry> {
    const response = await axios.put<MerchandiseEntry>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a merchandise entry
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  /**
   * Get zones from client addresses
   */
  async getZones(): Promise<string[]> {
    const response = await axios.get<string[]>('/api/merchandise-entries/zones');
    return response.data;
  },
};