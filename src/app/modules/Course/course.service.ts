import mongoose from "mongoose";
import { TCourse, TDetails } from "./course.interface";
import Course from "./course.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

// make course type Partial TCourse for durationInWeeks
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

const updateCourseIntoDB = async (id: string, course: Partial<TCourse>) => {
  const { tags, details, ...courseRemainingData } = course;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // for calculate course duration
    if (
      courseRemainingData &&
      !courseRemainingData.durationInWeeks &&
      (courseRemainingData?.startDate || courseRemainingData.endDate)
    ) {
      const oldData = await Course.findById(id);
      const startDate = courseRemainingData?.startDate ?? oldData?.startDate;
      const endDate = courseRemainingData?.endDate ?? oldData?.endDate;

      //   calculate course duration
      const newStartDate = new Date(startDate as string);
      const newEndDate = new Date(endDate as string);
      const durationInTime = newEndDate.getTime() - newStartDate.getTime();
      //   calculate course duration in days
      const durationInDays = Math.round(durationInTime / (1000 * 3600 * 24));
      //  calculate course duration in weeks
      const durationInWeeks = Math.ceil(durationInDays / 7);

      const updateRemainingCourseInfo = await Course.findByIdAndUpdate(
        id,
        { ...courseRemainingData, durationInWeeks },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!updateRemainingCourseInfo) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }
    }

    // course remaning data update without calculate duration
    const updateRemainingCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateRemainingCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
    }

    // updating course details
    if (details && Object.keys(details).length > 0) {
      const updateObject: Record<string, string> = {};
      (Object.keys(details) as (keyof TDetails)[])?.forEach((prop) => {
        const value = details[prop] as string;
        updateObject[`details.${prop}` as string] = value;
      });

      const updateCourseDetailsInfo = await Course.findByIdAndUpdate(
        id,
        updateObject,
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!updateCourseDetailsInfo) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }
    }

    if (tags && tags.length > 0) {
      const deleteTags = tags
        .filter((element) => element?.name && element?.isDeleted)
        .map((el) => el?.name);

      const deletedTagsFromDB = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            tags: { name: { $in: deleteTags } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedTagsFromDB) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }

      const newTags = tags?.filter((el) => el.name && !el.isDeleted);

      const addNewTagsIntoDB = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { tags: { $each: newTags } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!addNewTagsIntoDB) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const result = await Course.findById(id).select(
      "-__v -createdAt -updatedAt",
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to update course");
  }
};

export { createCourseIntoDB, updateCourseIntoDB };
