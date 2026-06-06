const products = [
  { id: 1, name: 'Classic Men Jacket', category: 'men', price: 899, img: '/image/home/men jacket.png' },
  { id: 2, name: 'Men Dress', category: 'men', price: 749, img: '/image/home/men dress.png' },
  { id: 3, name: 'Men Casual', category: 'men', price: 599, img: '/image/home/men.png' },
  { id: 4, name: 'Women Outfit', category: 'women', price: 849, img: '/image/home/woman.png' },
  { id: 5, name: 'Kids Dress', category: 'kids', price: 499, img: '/image/home/kids 1.png' },
  { id: 6, name: 'Kids Collection', category: 'kids', price: 449, img: '/image/home/kids.png' },
  { id: 7, name: 'Baby Collection', category: 'baby', price: 349, img: '/image/home/baby.png' },
  { id: 8, name: 'Sale Special', category: 'sale', price: 299, img: '/image/home/sale.png' },
  {
    id: 9, name: 'T-Shirt for Men Zip Neck Texture', category: 'men', price: 649,
    img: '/image/md1/t shirt/front.png',
    frontImg: '/image/md1/t shirt/front.png',
    colours: [
      { name: 'Colour 1', img: '/image/md1/t shirt/t1.png' },
      { name: 'Colour 2', img: '/image/md1/t shirt/t2.png' },
      { name: 'Colour 3', img: '/image/md1/t shirt/t3.png' },
      { name: 'Colour 4', img: '/image/md1/t shirt/t4.png' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: 'A premium zip neck textured T-shirt crafted for modern men. Features a subtle raised texture fabric, paired with a sleek quarter-zip collar for a smart-casual look.',
    details: ['Material: 95% Cotton, 5% Elastane', 'Zip Neck collar with metal zipper', 'Textured knit fabric for premium feel', 'Regular fit — true to size', 'Machine washable at 30°C']
  },
  {
    id: 10, name: 'Kids Casual Dress', category: 'kids', price: 429,
    img: '/image/kd/d1/s1.png',
    colours: [
      { name: 'Colour 1', img: '/image/kd/d1/s1.png' },
      { name: 'Colour 2', img: '/image/kd/d1/s2.png' },
      { name: 'Colour 3', img: '/image/kd/d1/s3.png' },
      { name: 'Colour 4', img: '/image/kd/d1/s4.png' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A cute and comfortable casual dress for kids. Made with soft breathable fabric, perfect for everyday play and outings. Available in 4 beautiful colours.',
    details: ['Material: 100% Soft Cotton', 'Comfortable relaxed fit', 'Easy pull-on style', 'Machine washable', 'Available in 4 colours']
  },
  {
    id: 11, name: "Fashion Dream Girl's Rayon Floral Printed Dress", category: 'women', price: 799,
    img: '/image/wd/w1/g1.png',
    colours: [
      { name: 'Colour 1', img: '/image/wd/w1/g1.png' },
      { name: 'Colour 2', img: '/image/wd/w1/g2.png' },
      { name: 'Colour 3', img: '/image/wd/w1/g3.png' },
      { name: 'Colour 4', img: '/image/wd/w1/g4.png' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: "A beautiful floral printed Rayon dress for women. Lightweight, breathable and stylish — perfect for casual outings, parties or everyday wear. Available in 4 stunning colours.",
    details: ['Material: 100% Rayon', 'Floral printed design', 'Lightweight and breathable', 'Regular fit — true to size', 'Machine washable at 30°C', 'Available in 4 colours']
  }
]

export default products
