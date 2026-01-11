import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import fiLocale from '@fullcalendar/core/locales/fi'
import './Kalenteri.css'
import mockEvents from './testEvents.json'

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
  
  const colorcodedEvents: EventWithColor[] = colorcodeEvents(mockEvents as Event[]);

  return (
    <div id="calendar">
      <h1>Tapahtumakalenteri</h1>
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
      backgroundColor = now < start ? '#00ff00' : '#6e6e6eff';
    } else if (now >= registrationStarts && now <= registrationEnds) {
      backgroundColor = '#00ff00';
    } else if (now < registrationStarts) {
      backgroundColor = '#0066ffff';
    } else if (now > start) {
      backgroundColor = '#6e6e6eff';
    } else {
      backgroundColor = '#ff0000';
    }

    colorcodedEvents.push({ ...event, backgroundColor });
  });
  return colorcodedEvents;
}