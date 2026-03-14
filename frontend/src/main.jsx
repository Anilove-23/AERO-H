import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "leaflet/dist/leaflet.css";

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

// Components Import
import Home from './components/Home.jsx';
import Dashboard from './components/DashBoard.jsx';
import LiveUpdates from './components/LiveUpdates.jsx';
import BloodDonor from './components/BloodDonor.jsx';
import Emergency from './components/EmergencyReports.jsx';
import Pharmacy from './components/Pharmacy.jsx';
import Doctordetail from './components/Doctordetail.jsx';
import PredictiveDemand from './components/PredictiveDEmand.jsx';
import Login from './components/Login.jsx';
import Pagenotfound from './components/Pagenotfound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // Ye check karega user logged in hai ya nahi
    children: [
      {
        index: true, 
        element: <Home />, // Home tabhi dikhega jab ProtectedRoute allow karega
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "blood-donor",
        element: <BloodDonor />,
      },
      {
        path: "emergency",
        element: <Emergency />,
      },
      {
        path: "pharmacies",
        element: <Pharmacy />,
      },
      {
        path: "doctor",
        element: <Doctordetail />,
      },
      {
        path: "predictive-demand",
        element: <PredictiveDemand />,
      },
      {
        path: "liveupdates",
        element: <LiveUpdates />,
      },
    ],
  },
  {
    path: "*",
    element: <Pagenotfound />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);