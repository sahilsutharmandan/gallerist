import { Link } from 'react-router-dom'
import { EmptyState } from '../components/PageState'

export default function NotFound() {
  return (
    <div className="container page">
      <EmptyState
        icon="compass"
        title="This room is closed"
        action={
          <Link to="/explore" className="btn btn--primary">
            Explore the collection
          </Link>
        }
      >
        The page you were looking for doesn’t exist or has moved.
      </EmptyState>
    </div>
  )
}
