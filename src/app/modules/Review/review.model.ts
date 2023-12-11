import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

const reviewSchema = new Schema<TReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      required: [true, "Course ID is required"],
      ref: "Course",
    },
    rating: {
      type: Number,
      min: [1, "Minimum rating value is 1"],
      max: [5, "Maximum rating value is 5"],
      required: [true, "Course rating is required"],
    },
    review: {
      type: String,
      required: [true, "Course review is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Review = model<TReview>("Review", reviewSchema);

export default Review;
