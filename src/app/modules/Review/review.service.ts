import { TReview } from "./review.interface";
import Review from "./review.model";

const createReviewIntoDB = async (review: TReview) => {
  const result = await Review.create(review);
  return result;
};

export { createReviewIntoDB };
