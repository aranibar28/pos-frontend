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
    title: 'Categorias',
    path: 'categories',
    icon: 'apps',
  },
  {
    title: 'Productos',
    path: 'products',
    icon: 'liquor',
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
      {
        title: 'Proveedores',
        path: 'suppliers',
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
  categories: false,
  products: false,
  purchases: false,
  sales: false,
};
