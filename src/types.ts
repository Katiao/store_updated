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

export type SearchAndFilterParams = Pick<
  ProductAttributes,
  "company" | "category" | "shipping" | "price"
> & {
  search: string;
  order: "a-z" | "z-a" | "high" | "low";
};

export type CartProduct = {
  // cart ID probably will not be needed anymore as I removed color
  cartID: number;
  productID: number;
  image: string;
  title: string;
  price: string;
  amount: number;
  company: string;
};
