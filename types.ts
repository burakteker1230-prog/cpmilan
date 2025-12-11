export interface CarListing {
  id: string;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerName: string;
  createdAt: number;
}

export interface NewListingInput {
  title: string;
  price: string;
  description: string;
  sellerName: string;
  imageFile: File | null;
}
