import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Loader, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError('');

      // TODO: Uncomment when backend is ready
      // try {
      //   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      //   const response = await fetch(`${API_BASE_URL}/api/trips`);
      //   if (!response.ok) throw new Error('Failed to fetch trips');
      //   const data = await response.json();
      //   setTrips(data);
      // } catch (err) {
      //   setError(err.message);
      //   toast.error('Could not load trips. Please try again.');
      // } finally {
      //   setLoading(false);
      // }

      setTrips([]);
      setLoading(false);
    };

    fetchTrips();
  }, []);

  const events = trips.map((trip) => ({
    id: trip.id,
    title: trip.destination,
    start: new Date(trip.startDate),
    end: new Date(trip.endDate),
    allDay: true,
    resource: trip,
    color: trip.status === 'upcoming' ? '#2563eb' :
           trip.status === 'ongoing' ? '#16a34a' :
           '#6b7280',
  }));

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '0.8rem',
      border: 'none',
      color: 'white',
    },
  });

  const dayPropGetter = (date) => {
    return {};
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <Loader className="w-8 h-8 animate-spin text-terracotta dark:text-dark-terracotta" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text flex items-center gap-3">
          <CalendarIcon className="w-7 h-7 text-terracotta dark:text-dark-terracotta" />
          Trip Calendar
        </h1>
        <a
          href="/dashboard"
          className="text-sm text-terracotta dark:text-dark-terracotta hover:underline"
        >
          ← Back to Dashboard
        </a>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-[#e8eaed] dark:border-dark-border p-4 shadow-sm">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          formats={{
            eventTimeRangeFormat: () => 'All day',
          }}
          components={{
            event: ({ event }) => (
              <div className="flex items-center gap-1 text-xs truncate">
                <MapPin className="w-3 h-3 inline-block" />
                <span>{event.title}</span>
              </div>
            ),
          }}
          onSelectEvent={(event) => {
            window.location.href = `/trip/${event.id}`;
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-warm-grey dark:text-dark-text-secondary">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span> Upcoming
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-600"></span> Ongoing
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-500"></span> Completed
        </span>
        <span className="text-xs text-warm-grey dark:text-dark-text-secondary ml-auto">
          {events.length} trip{events.length !== 1 ? 's' : ''} planned
        </span>
      </div>
    </div>
  );
}

export default CalendarPage;