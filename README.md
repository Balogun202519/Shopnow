# ShopNow — E-commerce App

## 📁 Folder Structure

```
ecommerce/
├── index.html        ← Main app (open this in browser)
├── style.css         ← All styles
├── app.js            ← App logic (cart, routing, filtering)
├── products.js       ← Product data — EDIT THIS to manage products
├── images/           ← ADD YOUR IMAGES HERE
│   ├── hero.jpg          ← Hero banner image (top of home page)
│   ├── product1.jpg      ← Wireless Headphones
│   ├── product2.jpg      ← Classic White Tee
│   ├── product3.jpg      ← Leather Watch
│   ├── product4.jpg      ← Ceramic Desk Lamp
│   ├── product5.jpg      ← Running Sneakers
│   ├── product6.jpg      ← Portable Speaker
│   ├── product7.jpg      ← Canvas Tote Bag
│   └── product8.jpg      ← Scented Candle Set
└── README.md
```

## 🖼️ Adding Images

1. Open the `/images/` folder
2. Drop in your image files (JPG, PNG, WebP all work)
3. Name them to match what's listed in `products.js`

If an image is missing, the app shows a placeholder — the store still works fine.

## ✏️ Adding / Editing Products

Open `products.js` and edit the `PRODUCTS` array. Each product looks like this:

```js
{
  id: 9,                          // unique number
  name: "My New Product",
  price: 49.99,
  originalPrice: 69.99,          // set to null if no sale
  category: "electronics",       // electronics | clothing | accessories | home
  image: "images/product9.jpg",  // filename in /images/
  badge: "New",                  // "New", "Sale", or null
  rating: 4.5,                   // 0–5
  reviews: 100,
  description: "Product description here.",
  featured: true                 // shows on home page if true
}
```

## 🚀 Running the App

Just open `index.html` in any browser — no server needed!

> For best results, use a local server (e.g. VS Code Live Server extension)
> so images load correctly.
