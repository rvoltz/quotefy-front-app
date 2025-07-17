// src/schemas/quotationSchema.ts
import { z } from 'zod';

export const quotationItemSchema = z.object({
  partName: z.string().min(1, { message: 'Nome da peça é obrigatório.' }),
  vehicleModel: z.string().min(1, { message: 'Modelo do veículo é obrigatório.' }),
  vehicleYear: z.number().int().min(1900, { message: 'Ano do veículo inválido.' }).max(new Date().getFullYear() + 1, { message: 'Ano não pode ser futuro.' }),
  expectedQuotes: z.number().int().min(1, { message: 'Número de cotações esperadas deve ser positivo.' }),
  receivedQuotes: z.number().int().min(0, { message: 'Número de cotações recebidas não pode ser negativo.' }),
  status: z.enum(['pendente', 'em andamento', 'finalizada', 'cancelada']),
  price: z.number().optional(),
});

export const quotationSchema = z.object({
  id: z.string(),
  clientName: z.string().min(3, { message: 'Nome do cliente é obrigatório.' }),
  date: z.string(),
  items: z.array(quotationItemSchema).min(1, { message: 'Uma cotação deve ter pelo menos um item.' }),
});

export const newQuotationPartSchema = z.object({
  partId: z.string().min(1, { message: 'Selecione uma peça.' }),
  quantity: z.number().int().min(1, { message: 'A quantidade deve ser no mínimo 1.' }),
});

export const newQuotationSchema = z.object({
  vehicleId: z.string().min(1, { message: 'Selecione um veículo.' }),
  parts: z.array(newQuotationPartSchema).min(1, { message: 'Adicione pelo menos uma peça à cotação.' }),
  selectedSupplierIds: z.array(z.string()).min(1, { message: 'Selecione pelo menos um fornecedor.' }),
});


export type QuotationItem = z.infer<typeof quotationItemSchema>;