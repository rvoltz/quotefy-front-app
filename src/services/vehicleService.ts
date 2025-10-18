import type { 
    Vehicle, 
    VehicleSearchParams 
} from '../schemas/vehicleSchema';
import { api } from './api'; 
import type { AxiosError } from 'axios';
import type { PageableResponse } from '../schemas/page';

const API_VEHICLES_URL = 'api/vehicles'; // Endpoint relativo

export const getVehicles = async (
    params: VehicleSearchParams
): Promise<PageableResponse<Vehicle>> => {
    
    try {     
        const response = await api.get<PageableResponse<Vehicle>>(API_VEHICLES_URL, {
            params: {
                model: params.model || undefined, 
                brand: params.brand || undefined,
                engine: params.engine || undefined,
                fuelType: params.fuelType || undefined,
                page: params.page, 
                size: params.size,
            },
        });
     
        return response.data;
        
    } catch (error) {
        const axiosError = error as AxiosError;      
        console.error('Erro ao buscar veículos:', axiosError.message);
        throw error;
    }
};

// Se você precisar de funções CRUD completas (similares ao supplierService):

/*
// [CRUD] Cria um novo veículo (POST /vehicles)
export async function createVehicle(data: VehicleFormData): Promise<void> {
    const payload = mapFormDataToPayload(data);
    await api.post(API_VEHICLES_URL, payload);
}

// [CRUD] Busca um veículo pelo ID (GET /vehicles/{id})
export async function fetchVehicle(id: number): Promise<VehicleFormData> {
    const response = await api.get<Vehicle>(`${API_VEHICLES_URL}/${id}`);
    return mapVehicleToFormData(response.data);
}

// [CRUD] Atualiza um veículo existente (PUT /vehicles/{id})
export async function updateVehicle(id: number, data: VehicleFormData): Promise<void> {
    const payload = mapFormDataToPayload(data);
    await api.put(`${API_VEHICLES_URL}/${id}`, payload);
}

// [CRUD] Deleta um veículo existente (DELETE /vehicles/{id})
export async function deleteVehicle(id: number): Promise<void> {
    await api.delete(`${API_VEHICLES_URL}/${id}`);
}
*/
