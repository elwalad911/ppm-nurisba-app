import { z } from "zod";

export const donationSchema = z.object({
  campaign_id: z.string().uuid({ message: "ID Campaign tidak valid" }),
  amount: z
    .number({ message: "Nominal harus berupa angka" })
    .min(10000, { message: "Minimum donasi adalah Rp 10.000" }),
  donor_name: z
    .string()
    .min(2, { message: "Nama minimal 2 karakter" })
    .default("Hamba Allah"),
  donor_email: z
    .string()
    .email({ message: "Format email tidak valid" })
    .optional()
    .or(z.literal("")),
  donor_phone: z.string().optional().or(z.literal("")),
  is_anonymous: z.boolean().default(false),
  message: z.string().optional().or(z.literal("")),
});

export type DonationInput = z.infer<typeof donationSchema>;
