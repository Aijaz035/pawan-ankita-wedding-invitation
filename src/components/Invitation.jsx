import { forwardRef } from 'react';
import { MapPin } from 'lucide-react';
import gatebg from '../assets/gatebg.webp';
import canopy from '../assets/canopy.webp';
import bed from '../assets/bed.webp';
import corner from '../assets/corner.webp';
import spray from '../assets/spray.webp';
import { groom, bride, groomSide, wedding, mapUrl } from '../data/wedding';
import { Monogram, Divider, Petals } from './Ornaments';
import { Rings, Diya, Lotus, BanquetHall, Drapery } from './Sketches';

const SKETCH = { rings: Rings, diya: Diya };

function MapLink({ q }) {
  return (
    <a className="map-link reveal" href={mapUrl(q)} target="_blank" rel="noopener noreferrer">
      <MapPin size={14} strokeWidth={1.5} aria-hidden="true" />
      <span>View location</span>
    </a>
  );
}

function Page({ children, className = '', corners = true }) {
  return (
    <section className={`page ${className}`}>
      {corners && (
        <>
          <img className="corner tl" src={corner} alt="" loading="lazy" />
          <img className="corner br" src={corner} alt="" loading="lazy" />
        </>
      )}
      <div className="page-inner">{children}</div>
    </section>
  );
}

const Invitation = forwardRef(function Invitation({ onReplay }, ref) {
  return (
    <div className="invitation" ref={ref}>
      {/* PAGE 2 — Introduction card */}
      <section className="hero">
        <img className="hero-bg" src={gatebg} alt="" />
        <div className="hero-veil" />
        <img className="hero-canopy" src={canopy} alt="" />
        <div className="hero-content">
          <div className="hero-item"><Monogram size={84} /></div>
          <p className="hero-item script together">Together with their families</p>
          <h1 className="hero-item hero-names script">
            <span>{groom.firstName}</span>
            <span className="amp amp-serif">&amp;</span>
            <span>{bride.firstName}</span>
          </h1>
          <p className="hero-item caps small lead">We request the pleasure<br />of your company<br />to celebrate our wedding on</p>
          <div className="hero-item date-block">
            <span className="caps month">{wedding.month}</span>
            <div className="date-row">
              <span className="rule" />
              <span className="day">{wedding.day}</span>
              <span className="rule" />
            </div>
          </div>
          <p className="hero-item caps small">To be held at</p>
          <p className="hero-item script venue-script">{wedding.venue.name}</p>
          <p className="hero-item caps small address">{wedding.venue.lines.join(' ')}</p>
        </div>
        <img className="hero-bed" src={bed} alt="" />
        <div className="scroll-cue hero-item" aria-hidden="true"><span /></div>
      </section>

      {/* PAGE 3 — Groom */}
      <Page className="groom">
        <p className="caps tiny gold reveal">The Groom</p>
        <h2 className="script name reveal">{groom.name}</h2>
        <p className="serif-italic reveal">Son of</p>
        <p className="caps parent reveal">{groom.father}</p>
        <p className="amp-serif amp-sm reveal">&amp;</p>
        <p className="caps parent reveal">{groom.mother}</p>
        <Divider className="reveal" />
        <p className="caps tiny reveal">Celebrations on</p>
        <p className="big-date reveal">{groomSide.date}</p>
        <div className="events">
          {groomSide.events.map((e) => {
            const S = SKETCH[e.sketch];
            return (
              <div className="event reveal" key={e.name}>
                <S />
                <p className="script event-name">{e.name}</p>
                <p className="caps event-time">{e.time}</p>
              </div>
            );
          })}
        </div>
        <p className="caps tiny reveal">Venue</p>
        <p className="script venue-script reveal">{groomSide.venue.name}</p>
        {groomSide.venue.lines.map((l) => <p className="caps small reveal" key={l}>{l}</p>)}
        <MapLink q={groomSide.venue.mapQuery} />
      </Page>

      <img className="spray-divider reveal" src={spray} alt="" loading="lazy" />

      {/* PAGE 4 — Bride */}
      <Page className="bride">
        <p className="caps tiny gold reveal">The Bride</p>
        <h2 className="script name reveal">{bride.name}</h2>
        <p className="serif-italic reveal">Daughter of</p>
        <p className="caps parent reveal">{bride.father}</p>
        <p className="amp-serif amp-sm reveal">&amp;</p>
        <p className="caps parent reveal">{bride.mother}</p>
        <div className="reveal sketch-wrap"><Lotus /></div>
        <p className="caps tiny reveal">Residence</p>
        <p className="script venue-script reveal">{bride.address}</p>
      </Page>

      {/* PAGE 5 — Wedding Ceremony */}
      <section className="page wedding">
        <div className="reveal drapery-wrap"><Drapery /></div>
        <div className="page-inner">
          <p className="caps tiny gold reveal">Join us for</p>
          <h2 className="script name reveal">The Wedding Ceremony</h2>
          <div className="date-block reveal">
            <span className="caps month">{wedding.month}</span>
            <div className="date-row">
              <span className="rule" />
              <span className="day">{wedding.day}</span>
              <span className="rule" />
            </div>
          </div>
          <div className="reveal sketch-wrap wide"><BanquetHall /></div>
          <p className="caps tiny reveal">Venue</p>
          <p className="script venue-script reveal">{wedding.venue.name}</p>
          {wedding.venue.lines.map((l) => <p className="caps small reveal" key={l}>{l}</p>)}
          <MapLink q={wedding.venue.mapQuery} />
        </div>
      </section>

      {/* PAGE 6 — Closing */}
      <section className="closing">
        <img className="closing-canopy" src={canopy} alt="" loading="lazy" />
        <Petals count={16} />
        <div className="closing-content">
          <Monogram size={70} className="reveal" />
          <p className="serif-italic closing-msg reveal">
            Your presence and blessings would mean the world to us as we begin this beautiful journey together.
          </p>
          <p className="caps tiny reveal">With love</p>
          <p className="script closing-names reveal">{groom.firstName} <span className="amp-serif">&amp;</span> {bride.firstName}</p>
          <Divider className="reveal" />
          <button className="replay reveal" onClick={onReplay}>Open the envelope again</button>
        </div>
        <img className="closing-bed" src={bed} alt="" loading="lazy" />
      </section>
    </div>
  );
});

export default Invitation;
