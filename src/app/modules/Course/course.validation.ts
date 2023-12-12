import { z } from "zod";

const createCourseTagsValidationSchema = z.object({
  name: z.string(),
  isDeleted: z.boolean().optional(),
});

const createCourseDetailsValidationSchema = z.object({
  level: z
    .string()
    .transform((val) => {
      const lowerVal = val.toLowerCase();
      if (["beginner", "intermediate", "advanced"].includes(lowerVal)) {
        return lowerVal.charAt(0).toUpperCase() + lowerVal.slice(1);
      }
      return val;
    })
    .refine((val) => ["Beginner", "Intermediate", "Advanced"].includes(val)),
  description: z.string(),
});

const createCourseValidationSchema = z.object({
  body: z.object({
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
  }),
});

export { createCourseValidationSchema };
