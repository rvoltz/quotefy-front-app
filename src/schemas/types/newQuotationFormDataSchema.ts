import { z } from 'zod';
import { newQuotationSchema } from '../quotationSchema'; // Importe apenas o schema aqui

export type NewQuotationFormData = z.infer<typeof newQuotationSchema>;