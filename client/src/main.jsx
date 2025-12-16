import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../public/css/index.css';
// Import Bootstrap CSS, JS Bundle (for dropdowns/toggles), and Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.jsx';
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import Layout from './Layout.jsx';
import Landing from '../components/Landing.jsx';
import Home from '../components/Home.jsx'
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';
import NewCampForm from '../components/Newcamp.jsx';
import Campground from '../../server/models/campground.js';

const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    childern:[
      {
        path:'',
        element:<Landing/>
      }
    ]
  },
  {
    path:'/campgrounds',
    element:<Layout/>,
    children:[
      {
        path:'',
        element:<Home/>
      },
      {
        path:'/new',
        element:<NewCamp/>
      },
      {
        path:'/:id',
        element:<Campground/>
      }
    ]
  },
  {
    path:'/register',
    element:<Layout/>,
    children:[
      {
        path:'',
        element:<Register/>
      }
    ]
  },
  {
    path:'/login',
    element:<Layout/>,
    children:[
      {
        path:'',
        element:<Login/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
