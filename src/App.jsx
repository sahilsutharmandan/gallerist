import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'
import Toasts from './components/Toasts'
import Lightbox from './components/Lightbox'
import { useUi } from './store/ui'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ArtworkDetail from './pages/ArtworkDetail'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const theme = useUi((s) => s.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const badges = {}

  return (
    <>
      <ScrollToTop />
      <Header badges={badges} />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav badges={badges} />
      <Lightbox />
      <Toasts />
    </>
  )
}
