import axios from 'axios';
import { Dispatch, DispatchFormData, DispatchTotals, DispatchClient } from '../types/dispatch';

const API_BASE_URL = '/api/dispatches';

export const dispatchService = {
  /**
   * Get all dispatches
   */
  async getAll(): Promise<Dispatch[]> {
    const response = await axios.get<Dispatch[]>(API_BASE_URL);
    return response.data;
  },

  /**
   * Get a single dispatch by ID with merchandise entries
   */
  async getById(id: number): Promise<Dispatch> {
    const response = await axios.get<Dispatch>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new dispatch
   */
  async create(data: DispatchFormData): Promise<Dispatch> {
    const response = await axios.post<{ dispatch: Dispatch }>(API_BASE_URL, data);
    return response.data.dispatch;
  },

  /**
   * Update an existing dispatch
   */
  async update(id: number, data: Partial<DispatchFormData>): Promise<Dispatch> {
    const response = await axios.put<{ dispatch: Dispatch }>(`${API_BASE_URL}/${id}`, data);
    return response.data.dispatch;
  },

  /**
   * Delete a dispatch
   */
  async delete(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  /**
   * Assign a merchandise entry to a dispatch
   */
  async assignMerchandiseEntry(dispatchId: number, merchandiseEntryId: number): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/${dispatchId}/assign`, {
      merchandise_entry_id: merchandiseEntryId,
    });
    return response.data;
  },

  /**
   * Remove a merchandise entry from a dispatch
   */
  async removeMerchandiseEntry(dispatchId: number, merchandiseEntryId: number): Promise<any> {
    const response = await axios.delete(`${API_BASE_URL}/${dispatchId}/remove/${merchandiseEntryId}`);
    return response.data;
  },

  /**
   * Assign multiple merchandise entries to a dispatch (bulk)
   */
  async assignBulk(dispatchId: number, merchandiseEntryIds: number[]): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/${dispatchId}/assign-bulk`, {
      merchandise_entry_ids: merchandiseEntryIds,
    });
    return response.data;
  },

  /**
   * Get totals (weight and freight) for a dispatch
   */
  async getTotals(dispatchId: number, clientId?: number): Promise<DispatchTotals> {
    const params = clientId ? { client_id: clientId } : {};
    const response = await axios.get<DispatchTotals>(`${API_BASE_URL}/${dispatchId}/totals`, { params });
    return response.data;
  },

  /**
   * Get clients associated with a dispatch
   */
  async getClients(dispatchId: number): Promise<DispatchClient[]> {
    const response = await axios.get<DispatchClient[]>(`${API_BASE_URL}/${dispatchId}/clients`);
    return response.data;
  },
};