import Icon from './Icon'
import { useCollections } from '../store/collections'
import { toast, useUi } from '../store/ui'

export default function CardActions({ art }) {
  const favorite = useCollections((s) => s.favorites.some((a) => a.id === art.id))
  const toggleFavorite = useCollections((s) => s.toggleFavorite)
  const openCollectionModal = useUi((s) => s.openCollectionModal)

  return (
    <>
      <button
        type="button"
        className={`art-card__action${favorite ? ' is-active' : ''}`}
        onClick={() => {
          const added = toggleFavorite(art)
          toast(added ? 'Added to favorites' : 'Removed from favorites', { tone: added ? 'success' : 'default' })
        }}
        aria-pressed={favorite}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Icon name="heart" />
      </button>
      <button
        type="button"
        className="art-card__action"
        onClick={() => openCollectionModal(art)}
        aria-label="Save to collection"
      >
        <Icon name="plus" />
      </button>
    </>
  )
}
