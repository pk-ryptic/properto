import z from "zod";

const emailSchema = z.string().email().min(1).max(255);
const passwordSchema = z.string().min(6).max(255);

export const loginHandlerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerHandlerSchema = loginHandlerSchema
  .extend({
    confirmPassword: passwordSchema,
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
