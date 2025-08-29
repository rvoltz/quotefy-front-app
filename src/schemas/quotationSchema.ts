// src/schemas/quotationSchema.ts
import { z } from 'zod';

// Schema para um item individual da cotação
// Contém campos para a descrição da peça, marca, quantidade,
// e campos opcionais para o status da cotação e preço (que são preenchidos após o processo de cotação).
export const quotationItemSchema = z.object({
  partName: z.string().min(1, { message: 'Descrição da peça é obrigatória.' }),
  vehicleModel: z.string().min(1, { message: 'Modelo do veículo é obrigatório.' }),
  vehicleYear: z.number().int().min(1900, { message: 'Ano do veículo inválido.' }).max(new Date().getFullYear() + 1, { message: 'Ano não pode ser futuro.' }),
  partBrand: z.string().optional(), // Marca da peça (opcional)
  quantity: z.number().int().min(1, { message: 'A quantidade deve ser no mínimo 1.' }),
  // Campos específicos para o status e resultado da cotação (usados na tela de listagem)
  expectedQuotes: z.number().int().min(0, { message: 'Número de cotações esperadas deve ser positivo.' }).optional().default(0),
  receivedQuotes: z.number().int().min(0, { message: 'Número de cotações recebidas não pode ser negativo.' }).optional().default(0),
  status: z.enum(['pendente', 'em andamento', 'finalizada', 'cancelada']).optional(), // Status da cotação em inglês
  price: z.number().optional(), // Preço total para este item, opcional
});

// Schema para a cotação completa
// Inclui os detalhes do veículo no nível superior (placa, modelo, marca, ano, motor)
// e o array de itens da cotação.
export const quotationSchema = z.object({
  id: z.string(), 
  date: z.string(),
  licensePlate: z.string().min(1, 'A placa é obrigatória.'),
  model: z.string().optional(),
  brand: z.string(),
  year: z.number().optional(),
  engine: z.string().optional(),
  items: z.array(quotationItemSchema).min(1, { message: 'Uma cotação deve ter pelo menos um item.' }),
  selectedVendorIds: z.array(z.string()).min(1, { message: 'Selecione pelo menos um fornecedor.' }).optional(), 
  user: z.object({
    id: z.string(),
    name: z.string(),
  }).optional(),
});

// Schema específico para o formulário de criação de nova cotação
// Este schema define as validações para os campos que o usuário irá preencher
// na tela de "Criar Nova Cotação".
export const newQuotationFormSchema = z.object({  
  licensePlate: z.string().min(1, 'A placa é obrigatória.'),
  model: z.string().optional(),
  brand: z.string(),
  year: z.number().optional(),
  engine: z.string().optional(),
  items: z.array(
    z.object({
      itemDescription: z.string().min(1, 'A descrição da peça é obrigatória.'),
      itemBrand: z.string().optional(),
      quantity: z.number().min(1, 'A quantidade deve ser pelo menos 1.'),
    })
  ).min(1, 'Adicione pelo menos uma peça.'),
  selectedVendorIds: z.array(z.string()).min(1, 'Selecione pelo menos um fornecedor.'),
});

export type Quotation = z.infer<typeof quotationSchema>;
export type QuotationItem = z.infer<typeof quotationItemSchema>;
export type NewQuotationFormData = z.infer<typeof newQuotationFormSchema>;