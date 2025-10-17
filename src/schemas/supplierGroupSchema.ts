import { z } from 'zod';
import type { Supplier } from './supplierSchema.ts';

export const supplierGroupSchema = z.object({
  description: z.string().min(3, { message: 'A descrição é obrigatória e deve ter no mínimo 3 caracteres.' }),
  suppliers: z.array(z.string()).min(1, { message: 'Selecione pelo menos um fornecedor para o grupo.' }),
  isActive: z.boolean(),
});

export type SupplierGroupFormData = z.infer<typeof supplierGroupSchema>;

export interface SupplierGroup {
    id: number;
    description: string;
    suppliers: Supplier[];
    active: boolean;
}

export interface SupplierGroupApiData {
    description: string;
    supplierIds: number[]; // Usamos IDs numéricos na API
    active: boolean;
}

export interface GetSupplierGroupsParams {
    description?: string; // O filtro de descrição é opcional
    page: number;        // Índice da página (0-based)
    size: number;        // Tamanho da página
}