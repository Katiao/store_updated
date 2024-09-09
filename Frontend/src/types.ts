export type Category = "Women" | "Men" | "Children" | "Accessories";

export type Company = "Verdant" | "Ecoture" | "Gaia" | "Aether" | "Zephyr";

// if not used delete
export type ProductApiResponse = {
  data: Product[];
  meta: ProductsMeta;
};

// if not used delete
export type Product = {
  title: string;
  company: Company;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  category: Category;
  image: string;
  price: string;
  shipping?: "on";
  productID: number;
};

export type ProductsMeta = {
  pagination: Pagination;
  nbHits: number;
};

export type Products = Product[];

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type SearchAndFilterParams = Pick<
  Product,
  "company" | "category" | "shipping" | "price"
> & {
  search: string;
  order: "a-z" | "z-a" | "high" | "low";
};

export type CartProduct = {
  productID: number;
  image: string;
  title: string;
  price: string;
  amount: number;
  company: string;
};

type OrderAttributes = {
  address: string;
  cartItems: CartProduct[];
  createdAt: string;
  name: string;
  numItemsInCart: number;
  orderTotal: string;
  publishedAt: string;
  updatedAt: string;
};

export type OrderHistoryItem = {
  id: number;
  attributes: OrderAttributes;
};

export type OrderHistoryMeta = {
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
};

export type OrderHistoryApiResponse = {
  data: OrderHistoryItem[];
  meta: OrderHistoryMeta;
};

export type Theme = "lemonade" | "dim";

export type User = {
  name: string;
  token: string;
};
