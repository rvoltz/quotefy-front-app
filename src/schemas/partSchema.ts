import { z } from 'zod';

export const partSchema = z.object({
  description: z.string().min(3, { message: 'A descrição é obrigatória e deve ter no mínimo 3 caracteres.' }),
  vehicleId: z.string().min(1, { message: 'O veículo é obrigatório.' }), // ID do veículo para vincular
});

export type PartFormData = z.infer<typeof partSchema>;