import httpStatus from "http-status";
import Course from "./course.model";
import AppError from "../../error/AppError";
import { sortableFields } from "./course.constant";

const getAllCourseQuery = async (query: Record<string, unknown>) => {
  const page = Number(query?.page ?? 1);
  const limit = Number(query?.limit ?? 10);
  const skip = Number((page - 1) * limit);

  const sortBy = (query?.sortBy as string) ?? "startDate";
  const sortOrderString: string = (query?.sortOrder as string) ?? "desc";
  const minPrice = Number(query?.minPrice ?? 5);
  const maxPrice = Number(query?.maxPrice ?? 50);
  const tags = query?.maxPrice ?? "Programming";
  const language = query?.language ?? "English";
  const provider = query?.provider ?? "Tech Academy";
  const durationInWeeks = Number(query?.durationInWeeks ?? 8);
  const level = query?.level ?? "Intermediate";
  let sortOrder: number = -1;

  if (sortOrderString === "asc") {
    sortOrder = 1;
  } else if (sortOrderString === "desc") {
    sortOrder = -1;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "sort order must be acs or desc",
    );
  }

  if (!sortableFields.includes(sortBy)) {
    throw new AppError(httpStatus.BAD_REQUEST, "please sort by valid fields");
  }

  const sortMethod: Record<string, number> = {};
  sortMethod[sortBy] = sortOrder;

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

  const sortData = levelData.sort({ ...sortMethod });

  const pagination = await sortData
    .skip(skip)
    .limit(limit)
    .select("-__v -createdAt -updatedAt");

  const total = await Course.countDocuments();

  const meta: Record<string, number> = {
    page,
    limit,
    total,
  };

  return { meta, data: pagination };
};

export { getAllCourseQuery };
