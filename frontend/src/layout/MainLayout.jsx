import { Outlet } from "react-router"
import Navbar from "../components/headers/Navbar"

const MainLayout = () => {
  return (
    <main className="dark:bg-black overflow-hidden">
        <Navbar/>
        <Outlet/>
        <footer>Footer</footer>
    </main>
  )
}

export default MainLayout
