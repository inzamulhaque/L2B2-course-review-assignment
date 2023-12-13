import mongoose from "mongoose";
import { TCourse, TDetails } from "./course.interface";
import Course from "./course.model";
import AppError from "../../error/AppError";
import httpStatus from "http-status";
import Review from "../Review/review.model";
import { getAllCourseQuery } from "./course.utils";
import { NextFunction } from "express";

// make course type Partial TCourse for durationInWeeks
const createCourseIntoDB = async (course: Partial<TCourse>) => {
  const { startDate, endDate, details } = course;
  // handling duration
  if (course?.durationInWeeks) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "you can't set the duration manually",
    );
  }

  //   calculate course duration
  const newStartDate = new Date(startDate as string);
  const newEndDate = new Date(endDate as string);
  const durationInTime = newEndDate.getTime() - newStartDate.getTime();
  //   calculate course duration in days
  const durationInDays = Math.round(durationInTime / (1000 * 3600 * 24));

  // handle negative duration
  if (!(durationInTime > 0)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Course starting date can't be greater than the course ending date",
    );
  }

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

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const result = await getAllCourseQuery(query);

  return result;
};

const updateCourseIntoDB = async (
  id: string,
  course: Partial<TCourse>,
  next: NextFunction,
) => {
  const { tags, details, ...courseRemainingData } = course;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // handling updating duration
    if (courseRemainingData && courseRemainingData.durationInWeeks) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "you can't set the duration manually",
      );
    }

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

      // handle negative duration
      if (!(durationInTime > 0)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "Course starting date can't be greater than the course ending date",
        );
      }

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
    next(error);
  }
};

const getCourseWithReviewFromDB = async (
  courseId: string,
  next: NextFunction,
) => {
  try {
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
  } catch (error) {
    next(error);
  }
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
          __v: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
    },
  ]);

  const course = result[0].course[0];

  const resultObje = {
    course: { ...course },
    averageRating: result[0].averageRating,
    reviewCount: result[0].reviewCount,
  };

  return resultObje;
};

export {
  createCourseIntoDB,
  getAllCourseFromDB,
  updateCourseIntoDB,
  getCourseWithReviewFromDB,
  getBestRatedCourseFromDB,
};
