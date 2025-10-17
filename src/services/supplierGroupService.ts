import { api } from './api'; 
import type { AxiosError } from 'axios';
import type { SupplierGroup, SupplierGroupApiData } from '../schemas/supplierGroupSchema';
import type { SupplierGroupFormData, GetSupplierGroupsParams } from '../schemas/supplierGroupSchema';
import type { PageableResponse} from '../schemas/page';

const SUPPLIER_GROUPS_URL = 'api/supplier-groups'; 

const mapFormDataToApiData = (data: SupplierGroupFormData): SupplierGroupApiData => {
    const supplierIds = data.suppliers.map(id => parseInt(id, 10));

    return {
        description: data.description,
        supplierIds: supplierIds,
        active: data.isActive,
    };
};

export const mapApiDataToFormData = (group: SupplierGroup): SupplierGroupFormData => {
    const supplierIdsFromObjects = (group.suppliers || []).map(s => String(s.id));

    return {
        description: group.description,
        suppliers: supplierIdsFromObjects,
        isActive: group.active,
    };
};

export const getSupplierGroupById = async (id: number): Promise<SupplierGroupFormData> => {
    try {
        const response = await api.get<SupplierGroup>(`${SUPPLIER_GROUPS_URL}/${id}`);
        return mapApiDataToFormData(response.data);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Erro ao buscar Grupo de Fornecedor:', axiosError.message);
        throw error;
    }
};

export const updateSupplierGroup = async (id: number, data: SupplierGroupFormData): Promise<SupplierGroup> => {
    const payload = mapFormDataToApiData(data);
    try {
        const response = await api.put<SupplierGroup>(`${SUPPLIER_GROUPS_URL}/${id}`, payload);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error(`Erro ao atualizar Grupo de Fornecedor ID ${id}:`, axiosError.message);
        throw error;
    }
};


export const createSupplierGroup = async (data: SupplierGroupFormData): Promise<void> => {
    const payload = mapFormDataToApiData(data);
    try {
        await api.post(`${SUPPLIER_GROUPS_URL}`, payload);
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Erro ao criar Grupo de Fornecedor:', axiosError.message);
        throw error;
    }
};

export const getSupplierGroups = async (
    params: GetSupplierGroupsParams
): Promise<PageableResponse<SupplierGroup>> => {
    try {
        const response = await api.get<PageableResponse<SupplierGroup>>(`${SUPPLIER_GROUPS_URL}`, {
            params: {
                description: params.description,
                page: params.page,
                size: params.size,
            },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Erro ao buscar Grupos de Fornecedores:', axiosError.message);
        throw error;
    }
};

export async function deleteSupplierGroup(id: number): Promise<void> {
    await api.delete(`${SUPPLIER_GROUPS_URL}/${id}`);
}
