import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/blogs",
    element: <Blogs />,
  },
  {
    path: "/blog/*",
    element: <BlogPost />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
