import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import fiLocale from '@fullcalendar/core/locales/fi'
import './Kalenteri.css'
import mockEvents from './testEvents.json'

export default function Calendar() {
  
  const colorcodedEvents = colorcodeEvents(mockEvents);

  return (
    <div id="calendar">
      <h1>Tapahtumakalenteri</h1>
      <FullCalendar
        plugins={[ dayGridPlugin, listPlugin ]}
        locale={fiLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listYear'
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={true}
        contentHeight={'60%'}
        events={colorcodedEvents}
      />
    </div>
  )
}

function colorcodeEvents(eventsData: any[]) {

  const now = new Date();
  const colorcodedEvents = [] as any[];

  eventsData.map((event) => {
    const registrationStarts = event.registration_starts ? new Date(event.registration_starts) : null;
    const registrationEnds = event.registration_ends ? new Date(event.registration_ends) : null;
    const start = new Date(event.start);
    let backgroundColor: string;

    if (registrationStarts == null || registrationEnds == null || 
      now >= registrationStarts && now <= registrationEnds) {
      backgroundColor = '#00ff00'; // light green
    } 
    else if (now < registrationStarts) {
      backgroundColor = '#add8e6'; // light blue
    } else if (now > start) {
      backgroundColor = '#d3d3d3'; // light gray
    }else {
      backgroundColor = '#ff0000'; // light coral
    }

    colorcodedEvents.push({ ...event, backgroundColor });
  });
  return colorcodedEvents;
}