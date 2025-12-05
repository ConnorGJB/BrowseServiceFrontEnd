import type { CatalogueItem } from '../app/catalogue-service';

export const seedCatalogueItems: CatalogueItem[] = [
  {
    id: 'fet-laptop-001',
    name: 'Laptop Computer',
    category: 'Electronics',
    totalQuantity: 50,
  },
  {
    id: 'fet-mouse-001',
    name: 'Wireless Mouse',
    category: 'Accessories',
    totalQuantity: 200,
  },
  {
    id: 'fet-cable-001',
    name: 'USB-C Cable',
    category: 'Cables',
    totalQuantity: 500,
  },
  {
    id: 'fet-keyboard-002',
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    totalQuantity: 75,
  },
  {
    id: 'fet-monitor-002',
    name: '4K Monitor',
    category: 'Electronics',
    totalQuantity: 30,
  },
];
