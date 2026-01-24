export interface Dispatch {
  id: number;
  dispatch_date: string;
  driver_name: string;
  driver_license: string;
  transport_company_name: string;
  transport_company_ruc: string;
  merchandiseEntries?: MerchandiseEntryInDispatch[];
  created_at?: string;
  updated_at?: string;
}

export interface MerchandiseEntryInDispatch {
  id: number;
  reception_date: string;
  guide_number: string;
  supplier_id: number;
  client_id: number;
  client_address_id: number;
  total_weight: number;
  total_freight: number;
  status: 'Pending' | 'Dispatched';
  dispatch_id: number | null;
  supplier?: {
    id: number;
    ruc_dni: string;
    business_name: string;
  };
  client?: {
    id: number;
    ruc_dni: string;
    business_name: string;
  };
  clientAddress?: {
    id: number;
    address: string;
    zone: string;
  };
}

export interface DispatchFormData {
  dispatch_date: string;
  driver_name: string;
  driver_license: string;
  transport_company_name: string;
  transport_company_ruc: string;
}

export interface DispatchTotals {
  total_weight: number;
  total_freight: number;
}

export interface DispatchClient {
  client_id: number;
  business_name: string;
}