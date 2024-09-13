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

export type OrderData = {
  name: string;
  address: string;
  chargeTotal: number;
  orderTotal: string;
  numItemsInCart: number;
  cartItems: CartProduct[];
};

export type OrderHistoryItem = {
  _id: string; // Using the MongoDB _id as the id
  data: OrderData;
  createdAt: string;
  updatedAt: string;
};

export type OrderHistoryMeta = {
  nbHits: number;
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
