import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './roots/Home.jsx';
import { Directory } from './roots/Directory.jsx';
import { Dashboard } from './roots/Dashboard.jsx';
import { Class } from './roots/Class.jsx';
import { Calendar } from './roots/Calendar.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/student-directory',
    element: <Directory isTeacher={false} />,
  },
  {
    path: '/teacher-directory',
    element: <Directory isTeacher={true} />,
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
