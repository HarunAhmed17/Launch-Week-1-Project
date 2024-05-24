import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './roots/Home.jsx';
import { Directory } from './roots/Directory.jsx';
import { NonAdminDirectory } from './roots/NonAdminDirectory.jsx';
import { Dashboard } from './roots/Dashboard.jsx';
import { Class } from './roots/Class.jsx';
import { Calendar } from './roots/Calendar.jsx';
import { GlobalStateProvider } from './roots/GlobalStateContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/student-directory-admin',
    element: <Directory isTeacher={false} />,
  },
  {
    path: '/teacher-directory-admin',
    element: <Directory isTeacher={true} />,
  },
  {
    path: '/student-directory',
    element: <NonAdminDirectory isTeacher={false} />,
  },
  {
    path: '/teacher-directory',
    element: <NonAdminDirectory isTeacher={true} />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/class/:classId',
    element: <Class />,
  },
  {
    path: '/calendar',
    element: <Calendar />,
  },
]);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  </React.StrictMode>,
);