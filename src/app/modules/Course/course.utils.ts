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

  const priceRange = Course.find({
    price: { $lte: maxPrice, $gte: minPrice },
  });

  const tagsName = priceRange.find({ "tags.name": tags });

  const languageData = tagsName.find({
    language,
  });

  const providerData = languageData.find({
    provider,
  });

  const durationInWeeksData = providerData.find({
    durationInWeeks,
  });

  const levelData = durationInWeeksData.find({
    "details.level": level,
  });

  const pagination = await levelData
    .skip(skip)
    .limit(limit)
    .select("-__v -createdAt -updatedAt");

  const total = await Course.countDocuments();

  const meta: TMeta = {
    page,
    limit,
    total,
  };

  return { meta, data: pagination };
};

export { getAllCourseQuery };
