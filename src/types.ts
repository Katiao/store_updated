// Possible change the category type to an enum

export type Product = {
  id: number;
  attributes: {
    title: string;
    company: string;
    description: string;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    category: string;
    image: string;
    price: string;
    shipping: boolean;
    colors: string[];
  };
};

export type Products = Product[];
