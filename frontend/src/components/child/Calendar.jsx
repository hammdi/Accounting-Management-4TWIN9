import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar({ events }) {
    return (
        <div className="demo-app">
            <div className="demo-app-main">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    events={events} // Injecter les événements ici
                    eventContent={renderEventContent} // Personnaliser l'affichage des événements
                />
            </div>
        </div>
    );
}

// Fonction pour personnaliser l'affichage des événements
function renderEventContent(eventInfo) {
    const bgColor = eventInfo.event.backgroundColor;
    const style = bgColor ? { backgroundColor: bgColor, color: eventInfo.event.textColor || 'white', padding: '2px 4px', borderRadius: '4px' } : {};

    return (
        <div style={style}>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </div>
    );
}