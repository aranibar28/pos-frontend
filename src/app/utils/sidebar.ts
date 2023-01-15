export const sidebar: any[] = [
  {
    title: 'Sistema',
    path: 'system',
    icon: 'computer',
    children: [
      {
        title: 'Configuración',
        path: 'config',
      },
      {
        title: 'Permisos',
        path: 'roles',
      },
    ],
  },
  {
    title: 'Usuarios',
    path: 'users',
    icon: 'person',
  },
  {
    title: 'Proveedores',
    path: 'suppliers',
    icon: 'local_shipping',
  },
  {
    title: 'Categorias',
    path: 'categories',
    icon: 'category',
  },
  {
    title: 'Productos',
    path: 'products',
    icon: 'liquor',
  },
  {
    title: 'Inventario',
    path: 'inventories',
    icon: 'apps',
    children: [
      {
        title: 'Lista de Entradas',
        path: 'inventories',
      },
      {
        title: 'Lista de Salidas',
        path: 'inventories/output',
      },
    ],
  },
  {
    title: 'Compras',
    path: 'purchases',
    icon: 'inventory',
    children: [
      {
        title: 'Lista de Compras',
        path: 'purchases',
      },
      {
        title: 'Realizar Compra',
        path: 'purchases/create',
      },
    ],
  },
  {
    title: 'Ventas',
    path: 'sales',
    icon: 'shopping_cart',
    children: [
      {
        title: 'Lista de Ventas',
        path: 'sales',
      },
      {
        title: 'Realizar Venta',
        path: 'sales/create',
      },
    ],
  },
];

export const modules: any = {
  system: false,
  users: false,
  suppliers: false,
  categories: false,
  products: false,
  inventories: false,
  purchases: false,
  sales: false,
};
