import { z } from 'zod';

export const classificationValues = ['PNEUS', 'PECAS', 'LUBRIFICANTES'] as const;
export type SupplierClassification = typeof classificationValues[number];

export const supplierSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório e deve ter no mínimo 3 caracteres.' }),
  seller: z.string().min(3, { message: 'O nome do vendedor é obrigatório e deve ter no mínimo 3 caracteres.' }),
  
  whatsapp: z.string().min(8, { message: 'O telefone é obrigatório e deve ter no mínimo 8 caracteres.' }).optional(),
  email: z.string().email({ message: 'E-mail inválido.' }).optional(),
  
  submissionMethods: z.array(z.enum(['whatsapp', 'email'])).min(1, { message: 'Selecione pelo menos um modo de envio.' }),
  classification: z.enum(classificationValues, {
    message: 'A classificação é obrigatória e deve ser PNEUS, PECAS ou LUBRIFICANTES.'
  }),
  isActive: z.boolean(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;