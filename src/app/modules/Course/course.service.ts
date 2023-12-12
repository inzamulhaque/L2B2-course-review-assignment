import mongoose from "mongoose";
import { TCourse, TDetails } from "./course.interface";
import Course from "./course.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import Review from "../Review/review.model";

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

      // course level capitalize
      if (updateObject["details.level"]) {
        let level: string = updateObject["details.level"] as string;
        level = (level as string).charAt(0).toUpperCase() + level.slice(1);
        updateObject["details.level"] = level;
      }

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

const getCourseWithReviewFromDB = async (courseId: string) => {
  const id = new mongoose.Types.ObjectId(courseId);

  const result = await Course.aggregate([
    { $match: { _id: id } },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "courseId",
        as: "reviews",
      },
    },
    {
      $project: {
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        reviews: {
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    },
  ]);

  const resultObj = {
    course: result[0],
  };

  return resultObj;
};

const getBestRatedCourseFromDB = async () => {
  const result = await Review.aggregate([
    {
      $group: {
        _id: "$courseId",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
    {
      $sort: { averageRating: -1 },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $project: {
        _id: 0,
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        course: {
          // _id: 1,
          // title: 1,
          // instructor: 1,
          // categoryId: 1,
          // price: 1,
          // tags: 1,
          // startDate: 1,
          // endDate: 1,
          // language: 1,
          // provider: 1,
          // durationInWeeks: 1,
          // details: 1,
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    },
  ]);

  const course = result[0].course[0];

  return {
    course: { ...course },
    averageRating: result[0].averageRating,
    reviewCount: result[0].reviewCount,
  };
};

export {
  createCourseIntoDB,
  updateCourseIntoDB,
  getCourseWithReviewFromDB,
  getBestRatedCourseFromDB,
};
