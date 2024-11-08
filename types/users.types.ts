import { z } from "zod";

export const UsersSchema = z.object({
  name: z.string({invalid_type_error: "Name must be a string"}),
  email: z.string().email({ message: "Invalid email address" }),
});

export type Users = z.infer<typeof UsersSchema>;