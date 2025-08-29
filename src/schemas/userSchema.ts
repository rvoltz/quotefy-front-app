export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  password: z.string(),
});