export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[];
  tags: string[];
  category: string;
  isOffSale?: boolean;
  isComingSoon?: boolean;
}

export interface Review {
  id: string;
  product_id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}
