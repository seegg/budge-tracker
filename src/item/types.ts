export interface Item {
  name: string,
  description: string | null,
  user_id: string,
  tag_id: number,
  purchase_date: number,
  price: number
};

export interface ItemDBRow extends Item {
  id: number;
}

export interface PurchaseItem {
  id: number,
  price: number,
  purchaseDate: number,
  name: string,
  userID: string,
  tagName: string,
  description: string | null,
};