
export interface User {
  id: string;
  name: string;
  role: "shopkeeper" | "customer";
  shopId?: string;
  customerId?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  uniqueId: string;
  phone?: string;
  email?: string;
  shopId: string;
  createdAt: Date;
}

export interface Shop {
  id: string;
  name: string;
  ownerId: string;
  address?: string;
  upiId?: string;
  phone?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  customerId: string;
  shopId: string;
  amount: number;
  description: string;
  isPending: boolean;
  items?: string[];
  createdAt: Date;
  paidAt?: Date;
  dueDate?: Date;
  transactionId?: string;
}
