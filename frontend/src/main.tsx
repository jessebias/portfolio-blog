import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/works",
        element: <Home />,
      },
      {
        path: "/about",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Home />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blogs/:id",
        element: <BlogPost />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ]
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
