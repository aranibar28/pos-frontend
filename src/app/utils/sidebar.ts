export const sidebar: any[] = [
  {
    title: 'Usuarios',
    path: 'users',
    icon: 'person',
  },
  {
    title: 'Permisos',
    path: 'roles',
    icon: 'security',
  },
  {
    title: 'Configuración',
    path: 'config',
    icon: 'build',
  },
  {
    title: 'Proveedores',
    path: 'suppliers',
    icon: 'local_shipping',
  },
  {
    title: 'Categorias',
    path: 'categories',
    icon: 'apps',
  },
  {
    title: 'Productos',
    path: 'products',
    icon: 'all_inbox',
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
  users: false,
  suppliers: false,
  categories: false,
  products: false,
  purchases: false,
  sales: false,
  roles: false,
  config: false,
};
