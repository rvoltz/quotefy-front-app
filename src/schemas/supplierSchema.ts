import { z } from 'zod';

import { 
    CLASSIFICATION_VALUES_BACKEND} from '../constants/supplierConstants'; 

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const supplierSchema = z.object({
  name: z.string().min(3, { message: 'O nome é obrigatório e deve ter no mínimo 3 caracteres.' }),
  seller: z.string().min(3, { message: 'O nome do vendedor é obrigatório e deve ter no mínimo 3 caracteres.' }),
  
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  
  submissionMethods: z.array(z.enum(['whatsapp', 'email'])).min(1, { message: 'Selecione pelo menos um modo de envio.' }),
  classification: z.enum(CLASSIFICATION_VALUES_BACKEND, {
    message: 'A classificação é obrigatória.'
  }),
  isActive: z.boolean(),
}).refine((data) => {
  if (data.email && data.email.trim() !== '') {
    return isValidEmail(data.email.trim());
  }
  return true;
}, {
    message: 'E-mail inválido.',
    path: ['email'],
}).refine((data) => {
    if (data.whatsapp && data.whatsapp.trim() !== '') {
        return data.whatsapp.trim().length >= 8;
    }
    return true; // Passa se estiver vazio
}, {
    // Mensagem ajustada para ser mais clara de que é um erro de FORMATO/COMPRIMENTO do que de obrigatoriedade.
    message: 'O número de WhatsApp preenchido deve ter no mínimo 8 caracteres.',
    path: ['whatsapp'],
})
.refine((data) => {
    return !data.submissionMethods.includes('email') || (data.email && data.email.trim() !== '');
}, {
    message: 'O E-mail é obrigatório para o modo de envio "Email".',
    path: ['email'],
})
.refine((data) => {
    return !data.submissionMethods.includes('whatsapp') || (data.whatsapp && data.whatsapp.trim() !== '');
}, {
    message: 'O WhatsApp é obrigatório para o modo de envio "WhatsApp".',
    path: ['whatsapp'],
});

export type SupplierFormData = z.infer<typeof supplierSchema>;