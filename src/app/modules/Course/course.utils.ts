import { TMeta } from "../../interface/meta";
import Course from "./course.model";

const getAllCourseQuery = async (query: Record<string, unknown>) => {
  const page = Number(query?.page ?? 1);
  const limit = Number(query?.limit ?? 10);
  const skip = Number((page - 1) * limit);
  const minPrice = Number(query?.minPrice ?? 5);
  const maxPrice = Number(query?.maxPrice ?? 50);
  const tags = query?.maxPrice ?? "Programming";
  const language = query?.language ?? "English";
  const provider = query?.provider ?? "Tech Academy";
  const durationInWeeks = Number(query?.durationInWeeks ?? 8);
  const level = query?.level ?? "Intermediate";

  const data = await Course.aggregate([
    {
      $match: {
        price: { $lte: maxPrice, $gte: minPrice },
        "tags.name": tags,
        language,
        provider,
        durationInWeeks,
        "details.level": level,
      },
    },
    {
      $project: {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await Course.countDocuments();

  const meta: TMeta = {
    page,
    limit,
    total,
  };

  return { meta, data };
};

export { getAllCourseQuery };
