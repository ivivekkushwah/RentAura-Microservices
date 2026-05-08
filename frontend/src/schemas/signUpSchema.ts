import * as z from "zod";

export const signUpSchema = z.object({
  fullname: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.enum(["user", "owner"]),
});