import { z } from "zod";
import { asMultilineText, asPlainText, isSafeUploadPath } from "@/lib/sanitize";

export const CATEGORIES = ["Law News", "Case Notes", "The Journey", "Commentary"] as const;
export type Category = (typeof CATEGORIES)[number];

const imagePath = z
  .string()
  .nullable()
  .refine((value) => value === null || isSafeUploadPath(value), "Invalid image path");

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    content: z.string().transform((v) => asPlainText(v)).pipe(z.string().min(1, "Fill in this heading, or remove it.")),
    imagePath: z.null().optional(),
  }),
  z.object({
    type: z.literal("paragraph"),
    content: z
      .string()
      .transform((v) => asMultilineText(v))
      .pipe(z.string().min(1, "Fill in this text section, or remove it.")),
    imagePath: z.null().optional(),
  }),
  z.object({
    type: z.literal("quote"),
    content: z.string().transform((v) => asMultilineText(v)).pipe(z.string().min(1, "Fill in this quote, or remove it.")),
    imagePath: z.null().optional(),
  }),
  z.object({
    type: z.literal("image"),
    content: z.string().transform((v) => asPlainText(v)),
    imagePath: z.string().refine(isSafeUploadPath, "Invalid image path"),
  }),
]);

export const postInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().transform((v) => asPlainText(v)).pipe(z.string().min(1, "Add a title.")),
  excerpt: z.string().transform((v) => asPlainText(v)),
  category: z.enum(CATEGORIES),
  coverPath: imagePath,
  published: z.boolean(),
  sections: z.array(sectionSchema).min(1, "Add at least one section (text or photo).").max(40),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(120),
  password: z.string().min(8).max(128),
});

export const profileSchema = z.object({
  displayName: z.string().transform((v) => asPlainText(v)).pipe(z.string().min(1, "Add a name.")),
  tagline: z.string().transform((v) => asPlainText(v)),
  bio: z.string().transform((v) => asMultilineText(v)),
  portraitPath: imagePath,
  welcomeLine: z.string().transform((v) => asPlainText(v)),
  titleLine: z.string().transform((v) => asPlainText(v)),
  accentWord: z.string().transform((v) => asPlainText(v)),
  closingNote: z.string().transform((v) => asMultilineText(v)),
});

export const heroCopySchema = profileSchema.pick({
  welcomeLine: true,
  titleLine: true,
  accentWord: true,
  tagline: true,
});

export const footerCopySchema = profileSchema.pick({
  closingNote: true,
});

export type PostInput = z.infer<typeof postInputSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
