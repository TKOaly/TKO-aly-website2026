import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import fiLocale from '@fullcalendar/core/locales/fi'
import './Kalenteri.css'
import mockEvents from './testEvents.json'
import { useState } from 'react';

type Event = {
  id: string
  title: string
  user_id: string
  created: string
  start: string
  end: string
  registration_starts: string | null
  registration_ends: string | null
  cancellation_starts: string | null
  cancellation_ends: string | null
  location: string
  category: string
  description: string
  deleted: boolean
  organizer: string | null
  url: string
};

type EventWithColor = Event & {
  backgroundColor: string
};

export default function Calendar() {
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const toggleLegendVisibility = () => {
    setIsLegendVisible((prev) => !prev);
  };

  const colorcodedEvents: EventWithColor[] = colorcodeEvents(mockEvents as Event[]);

  return (
    <div id="calendar">
      <div id="calendar-title">
        <h1>Tapahtumakalenteri</h1>
      </div>
      <div id="calendar-control-bar">
        <div id="calendar-view-toggle">
          <button id="show-calendar-button" className={`view-toggle-button ${!isListView ? 'view-toggle-active' : ''}`} title="Kalenterinäkymä" aria-label="Näytä kalenterinäkymä"
            onClick={() => setIsListView(false)}>
            Kalenteri
          </button>
          <button id="show-list-button" className={`view-toggle-button ${isListView ? 'view-toggle-active' : ''}`} title="Listanäkymä" aria-label="Näytä listanäkymä"
            onClick={() => setIsListView(true)}>
            Lista
          </button>
        </div>
      </div>
      <FullCalendar
        plugins={[ dayGridPlugin, listPlugin ]}
        locale={fiLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listWeek'
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={true}
        eventDisplay="list-item"
        contentHeight={'60%'}
        events={colorcodedEvents}
      />
      <div id="calendar-instructions">
        {isLegendVisible && (
          <div id="legend">
            <p><span className="legend-color-ball" style={{backgroundColor: '#0066ff'}}></span> Tapahtumaan ei ilmoittautumista</p>
            <p><span className="legend-color-ball" style={{backgroundColor: '#ffff00'}}></span> Ilmoittautuminen ei ole alkanut</p>
            <p><span className="legend-color-ball" style={{backgroundColor: '#00ff00'}}></span> Ilmoittautuminen on auki</p>
            <p><span className="legend-color-ball" style={{backgroundColor: '#ff0000'}}></span> Ilmoittautuminen on päättynyt</p>
            <p><span className="legend-color-ball" style={{backgroundColor: '#6e6e6eff'}}></span> Tapahtuma on mennyt</p>
          </div>
        )}
        <button
          onClick={toggleLegendVisibility}
          title="Kalenterin selite"
          aria-label="Näytä selite kalenterin värikoodauksesta"
        >
          {isLegendVisible ? 'Piilota selite' : 'Näytä selite'}
        </button>
      </div>
    </div>
  )
}

function colorcodeEvents(eventsData: Event[]) {

  const now = new Date();
  const colorcodedEvents = [] as EventWithColor[];

  eventsData.map((event) => {
    const registrationStarts = event.registration_starts ? new Date(event.registration_starts) : null;
    const registrationEnds = event.registration_ends ? new Date(event.registration_ends) : null;
    const start = new Date(event.start);
    let backgroundColor: string;

    if (!registrationStarts || !registrationEnds) {
      backgroundColor = now < start ? '#0066ff' : '#6e6e6e';
    } else if (now >= registrationStarts && now <= registrationEnds) {
      backgroundColor = '#00ff00';
    } else if (now < registrationStarts) {
      backgroundColor = '#ffff00';
    } else if (now > start) {
      backgroundColor = '#6e6e6e';
    } else {
      backgroundColor = '#ff0000';
    }

    colorcodedEvents.push({ ...event, backgroundColor });
  });
  return colorcodedEvents;
}