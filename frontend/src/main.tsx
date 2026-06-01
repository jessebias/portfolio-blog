import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'
import Login from './pages/Login.tsx'
import Profile from './pages/Profile.tsx'
import Layout from './components/Layout.tsx'
import { AuthProvider } from './context/AuthProvider.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'

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
        path: "/login",
        element: <Login />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/profile",
            element: <Profile />,
          }
        ]
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/admin",
            element: <AdminDashboard />,
          }
        ]
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
