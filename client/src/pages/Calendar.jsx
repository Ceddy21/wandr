import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Loader, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const STATUS_COLORS = {
  upcoming:  '#2D6A4F',
  ongoing:   '#E76F51',
  completed: '#6B7280',
  archived:  '#9CA3AF',
};

function CalendarPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/api/trips`, {
          credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to fetch trips');
        const data = await response.json();
        setTrips(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Calendar fetch error:', err);
        setError(err.message || 'Failed to load trips');
        toast.error('Could not load trips. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const events = useMemo(() => {
    return trips
      .filter((trip) => trip.startDate && trip.endDate && trip.status !== 'archived')
      .map((trip) => ({
        id: trip._id,
        title: trip.name || trip.destination,
        start: new Date(trip.startDate),
        end: new Date(new Date(trip.endDate).getTime() + 24 * 60 * 60 * 1000),
        allDay: true,
        resource: trip,
        color: STATUS_COLORS[trip.status] || STATUS_COLORS.completed,
      }));
  }, [trips]);

  const tripsOnDay = useCallback(
    (day) => {
      return events.filter((evt) => {
        const start = new Date(evt.start);
        const end = new Date(evt.end);
        const d = new Date(day);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return d >= start && d < end;
      });
    },
    [events]
  );

  const handleSelectSlot = useCallback(
    ({ start }) => {
      const matching = tripsOnDay(start);
      if (matching.length === 0) return;
      navigate(`/trip/${matching[0].id}`);
    },
    [navigate, tripsOnDay]
  );

  const handleSelectEvent = useCallback(
    (event) => {
      navigate(`/trip/${event.id}`);
    },
    [navigate]
  );

  const eventPropGetter = useCallback((event) => ({
    style: {
      backgroundColor: event.color,
      borderRadius: '6px',
      padding: '2px 6px',
      fontSize: '0.75rem',
      fontWeight: 500,
      border: 'none',
      color: 'white',
      cursor: 'pointer',
    },
  }), []);

  const dayPropGetter = useCallback(
    (date) => {
      const matching = tripsOnDay(date);
      const today = isSameDay(date, new Date());

      let backgroundColor = 'transparent';
      if (matching.length > 0) {
        backgroundColor = 'rgba(45, 106, 79, 0.10)';      
      } else if (today) {
        backgroundColor = 'rgba(231, 111, 81, 0.10)';    
      }

      return {
        style: {
          backgroundColor,
          cursor: matching.length > 0 ? 'pointer' : 'default',
          transition: 'background-color 0.15s ease',
        },
        className: matching.length > 0 ? 'has-trips-day' : '',
        title: matching.length > 0
          ? matching.map((t) => t.title).join(', ')
          : undefined,
      };
    },
    [tripsOnDay]
  );

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
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-terracotta dark:text-dark-terracotta hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-[#e8eaed] dark:border-dark-border p-4 shadow-sm calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          date={currentDate}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          view={currentView}
          onView={(newView) => setCurrentView(newView)}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          popup
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          tooltipAccessor={(event) => {
            const t = event.resource;
            const s = new Date(t.startDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric',
            });
            const e = new Date(t.endDate).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric',
            });
            return `${t.name || t.destination}\n${t.destination}\n${s} – ${e}`;
          }}
          formats={{
            eventTimeRangeFormat: () => 'All day',
          }}
          components={{
            event: ({ event }) => (
              <div className="flex items-center gap-1 text-xs truncate">
                <MapPin className="w-3 h-3 inline-block flex-shrink-0" />
                <span className="truncate">{event.title}</span>
              </div>
            ),
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-warm-grey dark:text-dark-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.upcoming }} />
          Upcoming
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.ongoing }} />
          Ongoing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS.completed }} />
          Completed
        </span>
        <span className="text-xs text-warm-grey dark:text-dark-text-secondary ml-auto">
          {events.length} trip{events.length !== 1 ? 's' : ''} planned
        </span>
      </div>
    </div>
  );
}

export default CalendarPage;