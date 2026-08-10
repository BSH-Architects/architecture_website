export function HomepageHeroGuide() {
  return (
    <section className="homepage-hero-guide" aria-labelledby="homepage-hero-guide-title">
      <div className="homepage-hero-guide__content">
        <h3 id="homepage-hero-guide-title">Where this content appears</h3>
        <p>
          The Hero is the first screen visitors see. The selected image fills the browser while the
          studio name and three-part information rail remain anchored above it.
        </p>
        <dl className="homepage-hero-guide__key">
          <div>
            <dt>Main heading</dt>
            <dd>Large studio name</dd>
          </div>
          <div>
            <dt>Summary</dt>
            <dd>Bottom-left statement</dd>
          </div>
          <div>
            <dt>Practice descriptor</dt>
            <dd>Bottom-center description</dd>
          </div>
          <div>
            <dt>Image</dt>
            <dd>Full-screen background</dd>
          </div>
        </dl>
      </div>

      <div
        aria-label="Diagram showing the main heading over a full-screen image, with the summary and practice descriptor along the bottom"
        className="homepage-hero-guide__diagram"
        role="img"
      >
        <span className="homepage-hero-guide__image-label">Hero image</span>
        <strong>Main heading</strong>
        <span className="homepage-hero-guide__summary-label">Introductory summary</span>
        <span className="homepage-hero-guide__descriptor-label">Practice descriptor</span>
        <span className="homepage-hero-guide__enter-label">Enter</span>
      </div>
    </section>
  )
}
