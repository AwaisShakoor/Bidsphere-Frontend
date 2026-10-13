export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type CategoriesResponse = {
  message?: string;
  categories: Category[];
};
