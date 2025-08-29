import { z } from 'zod';

export const supplierGroupSchema = z.object({
  description: z.string().min(3, { message: 'A descrição é obrigatória e deve ter no mínimo 3 caracteres.' }),
  suppliers: z.array(z.string()).min(1, { message: 'Selecione pelo menos um fornecedor para o grupo.' }),
  isActive: z.boolean(),
});

export type SupplierGroupFormData = z.infer<typeof supplierGroupSchema>;