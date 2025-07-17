import { z } from 'zod';

export const supplierSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório e deve ter no mínimo 3 caracteres.' }),
  street: z.string().min(3, { message: 'A rua é obrigatória.' }),
  number: z.string().min(1, { message: 'O número é obrigatório.' }),
  neighborhood: z.string().min(3, { message: 'O bairro é obrigatório.' }),
  cityState: z.string().min(3, { message: 'A cidade/estado é obrigatória.' }),
  submissionMethods: z.array(z.enum(['whatsapp', 'email'])).min(1, { message: 'Selecione pelo menos um modo de envio.' }),
  isActive: z.boolean(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;