import { TCourse } from "./course.interface";
import Course from "./course.model";

const createCourseIntoDB = async (course: Partial<TCourse>) => {
  const { startDate, endDate, details } = course;

  //   calculate course duration
  const newStartDate = new Date(startDate as string);
  const newEndDate = new Date(endDate as string);
  const durationInTime = newEndDate.getTime() - newStartDate.getTime();
  //   calculate course duration in days
  const durationInDays = Math.round(durationInTime / (1000 * 3600 * 24));
  //  calculate course duration in weeks
  const durationInWeeks = Math.ceil(durationInDays / 7);

  // course level capitalize
  let level: string = details?.level as string;
  level = (level as string).charAt(0).toUpperCase() + level.slice(1);

  // insert data into database
  const newCourse = await Course.create({
    ...course,
    durationInWeeks,
    details: { ...details, level },
  });

  const result = await Course.findById(newCourse._id).select(
    "-__v -createdAt -updatedAt",
  );
  return result;
};

export { createCourseIntoDB };
