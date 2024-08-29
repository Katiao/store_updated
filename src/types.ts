// if not used delete
export type ProductApiResponse = {
  data: Product[];
  meta: ProductsMeta;
};

export type Product = {
  id: number;
  attributes: ProductAttributes;
};

// if not used delete
type ProductAttributes = {
  title: string;
  company: string;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category: string;
  image: string;
  price: string;
  shipping: boolean;
  colors: string[];
};

// possibly enum for categories and companies
export type ProductsMeta = {
  pagination: Pagination;
  categories: string[];
  companies: string[];
};

export type Products = Product[];

// if not used delete
type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};
