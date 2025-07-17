// src/types/quotation.ts
import { z } from 'zod';
import { quotationSchema } from '../quotationSchema'; // Importe apenas o schema aqui

export type Quotation = z.infer<typeof quotationSchema>;