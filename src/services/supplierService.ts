import { api } from './api'; 
import type { AxiosError } from 'axios';
import type { SupplierFormData, GetSuppliersParams, Supplier, SupplierCreationPayload, SelectorSupplier} from '../schemas/supplierSchema';
import type { ShippingModeValue } from '../constants/supplierConstants';
import type { PageableResponse} from '../schemas/page';
import { CLASSIFICATION_VALUES_BACKEND } from '../constants/supplierConstants'; 

const SUPPLIER_URL = 'api/suppliers'; 

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

export type SupplierClassification= typeof CLASSIFICATION_VALUES_BACKEND[number];

export const getSuppliers = async (
  params: GetSuppliersParams
): Promise<PageableResponse<Supplier>> => {
  try {
    const response = await api.get<PageableResponse<Supplier>>(SUPPLIER_URL, {
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

export const getSuppliersForSelector = async (): Promise<SelectorSupplier[]> => {
  try {

    const response = await api.get<Supplier[]>(`${SUPPLIER_URL}/actives`);

    return response.data.map(supplier => ({
      id: String(supplier.id),
      name: supplier.name,
    }));
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Erro ao buscar lista de fornecedores para o seletor:', axiosError.message);
    return []; 
  }
};

export async function fetchSupplier(id: number): Promise<SupplierFormData> {
    const response = await api.get<Supplier>(`${SUPPLIER_URL}/${id}`);
    return mapSupplierToFormData(response.data);
}

export async function createSupplier(data: SupplierFormData): Promise<void> {
    const payload = mapFormDataToPayload(data);
    await api.post(SUPPLIER_URL, payload);
}

export async function updateSupplier(id: number, data: SupplierFormData): Promise<void> {
    const payload = mapFormDataToPayload(data);
    await api.put(`${SUPPLIER_URL}/${id}`, payload);
}

export async function deleteSupplier(id: number): Promise<void> {
    await api.delete(`${SUPPLIER_URL}/${id}`);
}
