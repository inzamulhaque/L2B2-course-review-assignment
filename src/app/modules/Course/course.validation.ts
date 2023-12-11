import { z } from "zod";

const createCourseTagsValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseDetailsValidationSchema = z.object({
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  description: z.string(),
});

const createCourseValidationSchema = z.object({
  title: z.string(),
  instructor: z.string(),
  categoryId: z.string(),
  price: z.number().positive(),
  tags: z.array(createCourseTagsValidationSchema),
  startDate: z.string(),
  endDate: z.string(),
  language: z.string(),
  provider: z.string(),
  details: createCourseDetailsValidationSchema,
});

export {
  createCourseTagsValidationSchema,
  createCourseDetailsValidationSchema,
  createCourseValidationSchema,
};
