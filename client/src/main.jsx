import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/index.css';
// Import Bootstrap CSS, JS Bundle (for dropdowns/toggles), and Icons
import '../css/Root.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { RouterProvider,createBrowserRouter } from 'react-router-dom';
import Layout from './Layout.jsx';
import Landing from '../components/Landing.jsx';
import Home from '../components/Home.jsx'
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';
import NewCampForm from '../components/Newcamp.jsx';
import Campground from '../components/Campground.jsx';
import RequireAuth from '../components/RequireAuth.jsx';
import UpdateCamp from '../components/UpdateCamp.jsx';
import { Provider } from 'react-redux';
import { store } from '../redux/store.js';

const router=createBrowserRouter([
  {
    path:'/',
    element:<Layout/>,
    children:[
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
        //dont use / for nested routes
        path:'new',
        element:<RequireAuth><NewCampForm/></RequireAuth>
      },
      {
        path:'edit/:id',
        element:<RequireAuth><UpdateCamp/></RequireAuth>
      },
      {
        path:':id',
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
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
