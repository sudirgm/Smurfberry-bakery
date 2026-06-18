export interface BakeryItem {
  id: string;
  name: string;
  category: 'cakes' | 'brownies' | 'muffins' | 'cheesecakes' | 'specials' | 'treats';
  description: string;
  price: number;
  rating: number;
  image: string;
  tags: string[];
  isSmurfSpecial?: boolean;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
  date: string;
}

export interface CartItem {
  item: BakeryItem;
  quantity: number;
}
