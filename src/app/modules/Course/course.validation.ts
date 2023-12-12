import { z } from "zod";

const createCourseTagsValidationSchema = z.array(
  z.object({
    name: z.string(),
    isDeleted: z.boolean().optional(),
  }),
);

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
    tags: createCourseTagsValidationSchema,
    startDate: z.string(),
    endDate: z.string(),
    language: z.string(),
    provider: z.string(),
    details: createCourseDetailsValidationSchema,
  }),
});

const updateCourseTagsValidationSchema = z.array(
  z.object({
    name: z.string().optional(),
    isDeleted: z.boolean().optional(),
  }),
);

const updateCourseDetailsValidationSchema = z.object({
  level: z
    .string()
    .transform((val) => {
      const lowerVal = val.toLowerCase();
      if (["beginner", "intermediate", "advanced"].includes(lowerVal)) {
        return lowerVal.charAt(0).toUpperCase() + lowerVal.slice(1);
      }
      return val;
    })
    .refine((val) => ["Beginner", "Intermediate", "Advanced"].includes(val))
    .optional(),
  description: z.string().optional(),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    instructor: z.string().optional(),
    categoryId: z.string().optional(),
    price: z.number().positive().optional(),
    tags: updateCourseTagsValidationSchema.optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    language: z.string().optional(),
    provider: z.string().optional(),
    details: updateCourseDetailsValidationSchema.optional(),
  }),
});

export { createCourseValidationSchema, updateCourseValidationSchema };
