import z from "zod";

export const registerHandlerSchema = z
  .object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(1).max(255),
    confirmPassword: z.string().min(1).max(255),
    userAgent: z.string().optional(),
  })
  .refine(
    (data) => {
      return data.password.trim() === data.confirmPassword.trim();
    },
    {
      message: `Passwords do not match`,
      path: [`confirmPassword`],
    }
  );
