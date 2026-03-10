export type Product = {
  id: number;
  title: string;
  category: string;
  price: string;
  ctaLabel: string;
};

const makeProduct = (
  id: number,
  title: string,
  category: string,
  price: string,
  ctaLabel: string
): Product => ({
  id,
  title,
  category,
  price,
  ctaLabel,
});

export const bestSellers: Product[] = [
  makeProduct(
    1,
    "Women Hair Pin – Light, Floral | Elegant Styling for Daily Looks",
    "Accessory",
    "₹400",
    "Select options"
  ),
  makeProduct(
    2,
    "Women Hair Pin – Cute, Floral | Premium Finish",
    "Accessory",
    "₹400",
    "Select options"
  ),
  makeProduct(
    3,
    "Women Scarf – Spain, Silk | Floral",
    "Accessory",
    "₹400",
    "Select options"
  ),
  makeProduct(
    4,
    "Women Scarf – Muslim, Floral | Silk",
    "Accessory",
    "₹400",
    "Select options"
  ),
];

export const newProducts: Product[] = [
  makeProduct(
    5,
    "Women Pants – Wide, Denim | High Waist, Wide Leg",
    "New",
    "₹1,000",
    "Read more"
  ),
  makeProduct(
    6,
    "Women Pants – Drawstring, Comfort Fit | Elastic Waist",
    "New",
    "₹940",
    "Read more"
  ),
  makeProduct(
    7,
    "Women Product – Digital, Plus Size | Printed",
    "New",
    "₹1,000",
    "Read more"
  ),
  makeProduct(
    8,
    "Women Pants – Plus-size, Comfort Fit | Premium Fabric",
    "New",
    "₹1,000",
    "Read more"
  ),
];

export const hotProducts: Product[] = [
  makeProduct(
    9,
    "Women Shirt – Ruffle, Casual Wear | Plus Size",
    "Hot",
    "₹599",
    "Read more"
  ),
  makeProduct(
    10,
    "Women Product – Flared, Plus Size | Premium Quality",
    "Hot",
    "₹500",
    "Read more"
  ),
  makeProduct(
    11,
    "Women Shirt – V-neck, Plus Size | Printed",
    "Hot",
    "₹1,000",
    "Read more"
  ),
  makeProduct(
    12,
    "Women Pants – Stretch, Plus Size | Lightweight",
    "Hot",
    "₹1,000",
    "Read more"
  ),
];

export const accessoryProducts: Product[] = [
  ...bestSellers,
];

export const allProducts: Product[] = [
  ...bestSellers,
  ...newProducts,
  ...hotProducts,
];

