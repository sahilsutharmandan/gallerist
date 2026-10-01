export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p>
          Images and data from the{' '}
          <a href="https://openaccess-api.clevelandart.org/" target="_blank" rel="noreferrer">
            Cleveland Museum of Art Open Access API
          </a>
          . Public-domain works are shared under CC0.
        </p>
        <p className="muted">Gallerist is an independent viewer and is not affiliated with the museum.</p>
      </div>
    </footer>
  )
}
