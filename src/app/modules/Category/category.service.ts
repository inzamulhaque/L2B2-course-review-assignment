import { TCategory } from "./category.interface";
import Category from "./category.model";

const createCategoryIntoDB = async (category: TCategory) => {
  const result = await Category.create(category);
  return result;
};

const getAllCategoriesFromDB = async () => {
  const result = await Category.find().select("name");
  return result;
};

export { createCategoryIntoDB, getAllCategoriesFromDB };
