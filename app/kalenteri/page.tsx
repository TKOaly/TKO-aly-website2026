"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import listPlugin from "@fullcalendar/list";
import fiLocale from "@fullcalendar/core/locales/fi";
import styles from "./Kalenteri.module.css";
import mockEvents from "./testEvents.json";
import { useState } from "react";

type Event = {
  id: string;
  title: string;
  user_id: string;
  created: string;
  start: string;
  end: string;
  registration_starts: string | null;
  registration_ends: string | null;
  cancellation_starts: string | null;
  cancellation_ends: string | null;
  location: string;
  category: string;
  description: string;
  deleted: boolean;
  organizer: string | null;
  url: string;
};

type EventWithColor = Event & {
  backgroundColor: string;
};

export default function Calendar() {
  const [isLegendVisible, setIsLegendVisible] = useState(false);
  const [isListView, setIsListView] = useState(false);

  const toggleLegendVisibility = () => {
    setIsLegendVisible((prev) => !prev);
  };

  const colorcodedEvents: EventWithColor[] = colorcodeEvents(
    mockEvents as Event[],
  );

  function colorcodeEvents(eventsData: Event[]) {
    const now = new Date();
    const colorcodedEvents = [] as EventWithColor[];

    eventsData.map((event) => {
      const registrationStarts = event.registration_starts
        ? new Date(event.registration_starts)
        : null;
      const registrationEnds = event.registration_ends
        ? new Date(event.registration_ends)
        : null;
      const start = new Date(event.start);
      let backgroundColor: string;

      if (!registrationStarts || !registrationEnds) {
        backgroundColor = now < start ? "#0066ff" : "#6e6e6e";
      } else if (now >= registrationStarts && now <= registrationEnds) {
        backgroundColor = "#00ff00";
      } else if (now < registrationStarts) {
        backgroundColor = "#ffff00";
      } else if (now > start) {
        backgroundColor = "#6e6e6e";
      } else {
        backgroundColor = "#ff0000";
      }

      colorcodedEvents.push({ ...event, backgroundColor });
    });
    return colorcodedEvents;
  }

  function eventCalendarView() {
    return (
      <FullCalendar
        plugins={[dayGridPlugin, listPlugin]}
        locale={fiLocale}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listWeek",
        }}
        initialView="dayGridMonth"
        editable={false}
        selectable={true}
        eventDisplay="list-item"
        contentHeight={"60%"}
        events={colorcodedEvents}
      />
    );
  }

  function eventListView() {
    return (
      <div id={styles["events-list"]}>
        {colorcodedEvents.map((event) => (
          <a href={event.url}>
            <div
              key={event.id}
              className={styles["event-list-item"]}
              style={{ borderLeft: `4px solid ${event.backgroundColor}` }}
            >
              <h3>{event.title}</h3>
              <p>
                <strong>Alkaa:</strong>{" "}
                {new Date(event.start).toLocaleDateString("fi-FI")},
                {new Date(event.start).toLocaleTimeString("fi-FI", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>
                <strong>Sijainti:</strong> {event.location}
              </p>
              <p>{event.description}</p>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div id={styles.calendar}>
      <div id={styles["calendar-title"]}>
        <h1>Tapahtumakalenteri</h1>
      </div>
      <div id={styles["calendar-control-bar"]}>
        <div id={styles["calendar-view-toggle"]}>
          <button
            id={styles["show-calendar-button"]}
            className={`view-toggle-button ${!isListView ? "view-toggle-active" : ""}`}
            title="Kalenterinäkymä"
            aria-label="Näytä kalenterinäkymä"
            onClick={() => setIsListView(false)}
          >
            Kalenteri
          </button>
          <button
            id={styles["show-list-button"]}
            className={`view-toggle-button ${isListView ? "view-toggle-active" : ""}`}
            title="Listanäkymä"
            aria-label="Näytä listanäkymä"
            onClick={() => setIsListView(true)}
          >
            Lista
          </button>
        </div>
      </div>
      {isListView ? eventListView() : eventCalendarView()}
      <div id={styles["calendar-instructions"]}>
        {isLegendVisible && (
          <div id={styles.legend}>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#0066ff" }}
              ></span>{" "}
              Tapahtumaan ei ilmoittautumista
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#ffff00" }}
              ></span>{" "}
              Ilmoittautuminen ei ole alkanut
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#00ff00" }}
              ></span>{" "}
              Ilmoittautuminen on auki
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#ff0000" }}
              ></span>{" "}
              Ilmoittautuminen on päättynyt
            </p>
            <p>
              <span
                className={styles["legend-color-ball"]}
                style={{ backgroundColor: "#6e6e6eff" }}
              ></span>{" "}
              Tapahtuma on mennyt
            </p>
          </div>
        )}
        <button onClick={toggleLegendVisibility} title="Kalenterin selite">
          {isLegendVisible ? "Piilota selite" : "Näytä selite"}
        </button>
      </div>
    </div>
  );
}
