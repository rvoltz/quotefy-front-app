import { z } from 'zod';

export const vehicleSchema = z.object({
  modelo: z.string().min(2, { message: 'Modelo é obrigatório e deve ter no mínimo 2 caracteres.' }),
  marca: z.enum([
    'Toyota', 'Volkswagen', 'Chevrolet', 'Fiat', 'Hyundai', 'Honda', 'Ford',
    'Renault', 'Jeep', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo', 'Outra'
  ], { message: 'Marca é obrigatória e deve ser uma das opções válidas.' }),
  ano: z.number().int().min(1900, { message: 'Ano inválido.' }).max(new Date().getFullYear() + 1, { message: 'Ano não pode ser futuro.' }),
  motor: z.string().min(2, { message: 'Motor é obrigatório e deve ter no mínimo 2 caracteres.' }),
  combustivel: z.enum(['gasolina', 'alcool', 'flex', 'diesel'], { message: 'Tipo de combustível inválido.' }),
  placa: z.string()
    .min(7, { message: 'Placa é obrigatória e deve ter 7 caracteres.' })
    .max(7, { message: 'Placa deve ter 7 caracteres.' })
    .regex(/^[A-Z]{3}\d[A-Z]\d{2}$|^[A-Z]{3}\d{4}$/, { message: 'Formato de placa inválido (ex: ABC1D23 ou ABC1234).' }),
  observacoes: z.string().max(500, { message: 'Observações não podem exceder 500 caracteres.' }).optional(),
  chassi: z.string().max(17, { message: 'Chassi não pode exceder 17 caracteres.' }).optional()
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;