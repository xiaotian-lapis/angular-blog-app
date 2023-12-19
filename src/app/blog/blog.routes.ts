export const BLOG_ROUTES = [
  {
    path: '',
    children: [
      {
        path: 'view',
        loadChildren: () =>
          import('./blog-content/blog-content.routes').then(
            (m) => m.BLOG_CONTENT_ROUTES,
          ),
      },
      {
        path: 'edit',
        loadChildren: () =>
          import('./blog-edit/blog-edit.routes').then(
            (m) => m.BLOG_EDIT_ROUTES,
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./blog-edit/blog-edit.routes').then(
            (m) => m.BLOG_EDIT_ROUTES,
          ),
      },
    ],
  },
];
