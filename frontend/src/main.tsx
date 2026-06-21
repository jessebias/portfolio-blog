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

// Localized route tree. Defined as relative children so the exact same set can
// be mounted at the root (English) and under a `/ja` prefix (Japanese).
// A fresh array is generated per mount to avoid sharing route node identity.
const makeAppRoutes = () => [
  { index: true, element: <Home /> },
  { path: "works", element: <Home /> },
  { path: "about", element: <Home /> },
  { path: "contact", element: <Home /> },
  { path: "blogs", element: <Blogs /> },
  { path: "blogs/:id", element: <BlogPost /> },
  { path: "login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "profile", element: <Profile /> }],
  },
  {
    element: <PrivateRoute />,
    children: [{ path: "admin", element: <AdminDashboard /> }],
  },
  { path: "*", element: <NotFound /> },
];

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      ...makeAppRoutes(),
      { path: "ja", children: makeAppRoutes() },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
