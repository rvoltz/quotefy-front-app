import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório e deve ter no mínimo 3 caracteres.' }),
  seller: z.string().min(3, { message: 'O nome do vendedor é obrigatório e deve ter no mínimo 3 caracteres.' }),
  submissionMethods: z.array(z.enum(['whatsapp', 'email'])).min(1, { message: 'Selecione pelo menos um modo de envio.' }),
  isActive: z.boolean(),
});
export type SupplierFormData = z.infer<typeof supplierSchema>;