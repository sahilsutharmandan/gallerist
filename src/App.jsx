import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import MobileNav from './components/MobileNav'
import Footer from './components/Footer'
import Toasts from './components/Toasts'
import Lightbox from './components/Lightbox'
import AddToCollectionModal from './components/AddToCollectionModal'
import { useUi } from './store/ui'
import { useCollections } from './store/collections'
import { useCompare } from './store/compare'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ArtworkDetail from './pages/ArtworkDetail'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import Compare from './pages/Compare'
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
  const collections = useCollections((s) => s.collections)
  const compareCount = useCompare((s) => s.slots.filter(Boolean).length)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const badges = { '/collections': collections.length, '/compare': compareCount }

  return (
    <>
      <ScrollToTop />
      <Header badges={badges} />
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/artwork/:id" element={<ArtworkDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileNav badges={badges} />
      <Lightbox />
      <AddToCollectionModal />
      <Toasts />
    </>
  )
}
