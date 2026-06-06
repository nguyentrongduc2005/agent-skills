import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine(
    (val) => Buffer.byteLength(val, "utf8") <= 72,
    "Password must not exceed 72 bytes",
  );

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address");

export const registerSchema = z.strictObject({
  email: emailSchema,
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  password: passwordSchema,
});

export const loginSchema = z.strictObject({
  email: emailSchema,
  password: passwordSchema,
});

export const refreshSchema = z.strictObject({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
