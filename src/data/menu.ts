export interface PizzaSizeInfo {
  name: string;
  slices: number;
  priceFrom: number;
}

export interface PizzaItem {
  id: number;
  name: string;
  description: string;
  prices: {
    pequena: number;
    media: number;
    grande: number;
    extraGrande: number;
  };
}

export interface DrinkItem {
  name: string;
  price: number;
}

export interface DrinksCategory {
  category: string;
  items: DrinkItem[];
}

export const pizzaSizes: PizzaSizeInfo[] = [
  { name: 'Pizza Pequena', slices: 4, priceFrom: 39.90 },
  { name: 'Pizza Média', slices: 8, priceFrom: 54.90 },
  { name: 'Pizza Grande', slices: 12, priceFrom: 69.90 },
  { name: 'Pizza Extra Grande', slices: 24, priceFrom: 99.90 },
];

export const pizzasSalgadas: PizzaItem[] = [
  {
    id: 1,
    name: 'Tradicional',
    description: 'Molho especial, mussarela, tomate e orégano',
    prices: { pequena: 39.90, media: 54.90, grande: 69.90, extraGrande: 99.90 }
  },
  {
    id: 2,
    name: 'Calabresa Especial',
    description: 'Calabresa, cebola, mussarela e orégano',
    prices: { pequena: 44.90, media: 59.90, grande: 74.90, extraGrande: 104.90 }
  },
  {
    id: 3,
    name: 'Frango com Catupiry',
    description: 'Frango desfiado, catupiry e mussarela',
    prices: { pequena: 46.90, media: 62.90, grande: 77.90, extraGrande: 109.90 }
  },
  {
    id: 4,
    name: 'Portuguesa',
    description: 'Presunto, ovos, cebola, ervilha, mussarela e azeitona',
    prices: { pequena: 46.90, media: 62.90, grande: 77.90, extraGrande: 109.90 }
  },
  {
    id: 5,
    name: 'Quatro Queijos',
    description: 'Mussarela, provolone, parmesão e gorgonzola',
    prices: { pequena: 49.90, media: 66.90, grande: 82.90, extraGrande: 114.90 }
  },
  {
    id: 6,
    name: 'Pepperoni Premium',
    description: 'Pepperoni e mussarela',
    prices: { pequena: 52.90, media: 69.90, grande: 85.90, extraGrande: 119.90 }
  },
  {
    id: 7,
    name: 'Bacon Supreme',
    description: 'Bacon crocante, cebola e mussarela',
    prices: { pequena: 49.90, media: 66.90, grande: 82.90, extraGrande: 114.90 }
  },
  {
    id: 8,
    name: 'Carne Seca',
    description: 'Carne seca, queijo e cebola roxa',
    prices: { pequena: 54.90, media: 72.90, grande: 89.90, extraGrande: 124.90 }
  },
  {
    id: 9,
    name: 'Napolitana',
    description: 'Mussarela, tomate, alho e manjericão',
    prices: { pequena: 44.90, media: 59.90, grande: 74.90, extraGrande: 104.90 }
  },
  {
    id: 10,
    name: 'Camarão Especial',
    description: 'Camarão, queijo e molho cremoso',
    prices: { pequena: 64.90, media: 84.90, grande: 104.90, extraGrande: 144.90 }
  },
  {
    id: 11,
    name: 'Vegetariana',
    description: 'Palmito, milho, champignon, tomate e queijo',
    prices: { pequena: 46.90, media: 62.90, grande: 77.90, extraGrande: 109.90 }
  },
  {
    id: 12,
    name: 'Lombo Canadense',
    description: 'Lombo, queijo e cebola',
    prices: { pequena: 49.90, media: 66.90, grande: 82.90, extraGrande: 114.90 }
  },
  {
    id: 13,
    name: 'Moda da Casa',
    description: 'Calabresa, bacon, frango e queijo',
    prices: { pequena: 54.90, media: 72.90, grande: 89.90, extraGrande: 124.90 }
  },
  {
    id: 14,
    name: 'Mexicana',
    description: 'Carne temperada, pimenta, cebola e queijo',
    prices: { pequena: 49.90, media: 66.90, grande: 82.90, extraGrande: 114.90 }
  },
  {
    id: 15,
    name: 'Toscana',
    description: 'Linguiça artesanal, cebola e mussarela',
    prices: { pequena: 46.90, media: 62.90, grande: 77.90, extraGrande: 109.90 }
  }
];

export const pizzasDoces: PizzaItem[] = [
  {
    id: 101,
    name: 'Chocolate Tradicional',
    description: 'Chocolate e granulado',
    prices: { pequena: 44.90, media: 59.90, grande: 74.90, extraGrande: 104.90 }
  },
  {
    id: 102,
    name: 'Chocolate com Morango',
    description: 'Chocolate e morangos',
    prices: { pequena: 49.90, media: 66.90, grande: 82.90, extraGrande: 114.90 }
  },
  {
    id: 103,
    name: 'Prestígio',
    description: 'Chocolate e coco',
    prices: { pequena: 46.90, media: 62.90, grande: 77.90, extraGrande: 109.90 }
  },
  {
    id: 104,
    name: 'Nutella com Banana',
    description: 'Nutella e banana',
    prices: { pequena: 54.90, media: 72.90, grande: 89.90, extraGrande: 124.90 }
  },
  {
    id: 105,
    name: 'Romeu e Julieta',
    description: 'Queijo e goiabada',
    prices: { pequena: 44.90, media: 59.90, grande: 74.90, extraGrande: 104.90 }
  }
];

export const bebidasCategories: DrinksCategory[] = [
  {
    category: 'Refrigerantes',
    items: [
      { name: 'Coca-Cola 350ml', price: 6.00 },
      { name: 'Coca-Cola 2L', price: 13.00 },
      { name: 'Coca-Cola Zero 2L', price: 13.00 },
      { name: 'Guaraná Antarctica 350ml', price: 5.00 },
      { name: 'Guaraná Antarctica 2L', price: 11.00 },
      { name: 'Fanta Laranja 2L', price: 11.00 },
      { name: 'Sprite 2L', price: 11.00 }
    ]
  },
  {
    category: 'Águas',
    items: [
      { name: 'Água mineral sem gás 500ml', price: 3.00 },
      { name: 'Água mineral com gás 500ml', price: 4.00 }
    ]
  },
  {
    category: 'Sucos',
    items: [
      { name: 'Suco de Laranja natural 500ml', price: 8.00 },
      { name: 'Suco de Maracujá 500ml', price: 8.00 },
      { name: 'Suco de Morango 500ml', price: 9.00 }
    ]
  },
  {
    category: 'Cervejas',
    items: [
      { name: 'Heineken 600ml', price: 12.00 },
      { name: 'Brahma 600ml', price: 8.00 },
      { name: 'Stella Artois 600ml', price: 10.00 }
    ]
  }
];
