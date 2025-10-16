import { api } from './api'; 
import type { AxiosError } from 'axios';
import type { SupplierFormData } from '../schemas/supplierSchema';
import { CLASSIFICATION_VALUES_BACKEND } from '../constants/supplierConstants'; 
import type { ShippingModeValue } from '../constants/supplierConstants';

export type SupplierClassification= typeof CLASSIFICATION_VALUES_BACKEND[number];

export interface Supplier {
  id: number;
  name: string;
  sellerName: string;
  shippingModes: ShippingModeValue[];
  classification: string;
  email: string;
  whatsapp: string;
  active: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; 
  size: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

interface GetSuppliersParams {
  name?: string;
  page: number; // 0-based index
  size: number;
}

export interface SupplierCreationPayload {
    name: string;
    shippingModes: ShippingModeValue[]; 
    classification: string;       
    email?: string;
    whatsapp?: string;
    active: boolean;        
    sellerName?: string;  
}

export const getSuppliers = async (
  params: GetSuppliersParams
): Promise<PageableResponse<Supplier>> => {
  try {
    const response = await api.get<PageableResponse<Supplier>>('api/suppliers', {
      params: {
        name: params.name,
        page: params.page,
        size: params.size,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Erro ao buscar fornecedores:', axiosError.message);
    throw error;
  }
};


const mapFormDataToPayload = (data: SupplierFormData): SupplierCreationPayload => {
    const shippingModes = data.submissionMethods.map(mode => mode.toUpperCase()) as ShippingModeValue[];

    return {
        name: data.name,
        sellerName: data.seller,
        classification: data.classification,
        email: data.email || undefined,
        whatsapp: data.whatsapp || undefined,
        shippingModes: shippingModes,
        active: data.isActive,
    };
};

const mapSupplierToFormData = (supplier: Supplier): SupplierFormData => {
    const submissionMethods = supplier.shippingModes.map(mode => mode.toLowerCase()) as ('whatsapp' | 'email')[];
    
    return {
        name: supplier.name,
        seller: supplier.sellerName,
        classification: supplier.classification as SupplierClassification, 
        email: supplier.email || '',
        whatsapp: supplier.whatsapp || '',
        submissionMethods: submissionMethods,
        isActive: supplier.active,
    };
};

export async function fetchSupplier(id: number): Promise<SupplierFormData> {
    const response = await api.get<Supplier>(`api/suppliers/${id}`);
    return mapSupplierToFormData(response.data);
}


export async function createSupplier(data: SupplierFormData): Promise<void> {
    const payload = mapFormDataToPayload(data);
    await api.post('api/suppliers', payload);
}

export async function updateSupplier(id: number, data: SupplierFormData): Promise<void> {
    const payload = mapFormDataToPayload(data);
    await api.put(`api/suppliers/${id}`, payload);
}

export async function deleteSupplier(id: number): Promise<void> {
    await api.delete(`api/suppliers/${id}`);
}
