export interface MerchandiseEntry {
  id: number;
  reception_date: string;
  guide_number: string;
  supplier_id: number;
  client_id: number;
  client_address_id: number;
  total_weight: number;
  total_freight: number;
  status: 'Pending' | 'Dispatched';
  dispatch_id?: number | null;
  supplier?: Supplier;
  client?: Client;
  clientAddress?: ClientAddress;
  products?: ProductEntry[];
}

export interface ProductEntry {
  id: number;
  merchandise_entry_id: number;
  product_name: string;
  quantity: number;
  type?: string | null;
}

export interface Supplier {
  id: number;
  ruc_dni: string;
  business_name: string;
}

export interface Client {
  id: number;
  ruc_dni: string;
  business_name: string;
  email?: string;
  phone?: string;
}

export interface ClientAddress {
  id: number;
  client_id: number;
  address: string;
  zone: string;
}

export interface MerchandiseEntryFormData {
  reception_date: string;
  guide_number: string;
  supplier_id: number | string;
  client_id: number | string;
  client_address_id: number | string;
  total_weight: number | string;
  total_freight: number | string;
  products: ProductEntryFormData[];
}

export interface ProductEntryFormData {
  product_name: string;
  quantity: number | string;
  type?: string;
  isNew?: boolean;
  id?: number;
}