import '../css/App.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Landing from '../components/Landing'
import Login from '../components/Login'
import Register from '../components/Register'
import NewCampForm from '../components/Newcamp'
import Home from '../components/Landing'

function App() {
  return (
    <>
      <Navbar />
      <Home/>
      <Footer />
    </>
  )
}

export default App
