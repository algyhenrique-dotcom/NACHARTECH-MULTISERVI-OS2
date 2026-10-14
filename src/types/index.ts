export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  isPromo?: boolean;
  image: string;
  images?: string[];
  description: string;
  specs: { [key: string]: string };
  inStock: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  image: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  titleEn: string;
  icon: string;
  image: string;
  description: string;
  descriptionEn: string;
  items: string[];
  itemsEn: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  titleEn: string;
  category: string;
  image: string;
  aspect?: string;
}

export interface AssistanceRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  description: string;
  date: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'mpesa' | 'emola' | 'cash';
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  date: string;
  status: 'pending' | 'confirmed' | 'delivered';
}
