import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Loader,
  Calendar as CalendarIcon,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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

const CustomToolbar = ({ label, onNavigate, onView, view, views }) => {
  const viewLabels = {
    [Views.MONTH]: 'Month',
    [Views.WEEK]: 'Week',
    [Views.DAY]: 'Day',
  };

  return (
    <div className="flex flex-col gap-3 mb-3 sm:mb-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate('PREV')}
          className="p-2 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors flex-shrink-0"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm sm:text-base font-semibold text-deep-charcoal dark:text-dark-text text-center truncate px-2">
          {label}
        </span>

        <button
          type="button"
          onClick={() => onNavigate('NEXT')}
          className="p-2 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60 transition-colors flex-shrink-0"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text hover:border-terracotta dark:hover:border-dark-terracotta hover:text-terracotta dark:hover:text-dark-terracotta transition-colors"
        >
          Today
        </button>

        <div className="flex items-center gap-1 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card p-1">
          {views.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onView(v)}
              className={`px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all ${
                view === v
                  ? 'bg-terracotta dark:bg-dark-terracotta text-white shadow-sm'
                  : 'text-warm-grey dark:text-dark-text-secondary hover:bg-[#F0F2F5] dark:hover:bg-dark-card/60'
              }`}
            >
              {viewLabels[v] || v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
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
      padding: '2px 4px',
      fontSize: '0.7rem',
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-12">
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-3xl font-serif font-bold text-deep-charcoal dark:text-dark-text flex items-center gap-2 sm:gap-3 min-w-0">
          <CalendarIcon className="w-5 h-5 sm:w-7 sm:h-7 text-terracotta dark:text-dark-terracotta flex-shrink-0" />
          <span className="truncate">Trip Calendar</span>
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs sm:text-sm text-terracotta dark:text-dark-terracotta hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl border border-[#e8eaed] dark:border-dark-border p-3 sm:p-4 shadow-sm calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'clamp(420px, 70vh, 700px)' }}
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
            toolbar: CustomToolbar,
            event: ({ event }) => (
              <div className="flex items-center gap-1 text-xs truncate">
                <MapPin className="w-3 h-3 flex-shrink-0 hidden sm:inline" />
                <span className="truncate">{event.title}</span>
              </div>
            ),
            month: {
              dateHeader: ({ date }) => (
                <span className="text-[10px] sm:text-xs">{date.getDate()}</span>
              ),
            },
          }}
        />
      </div>

      <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS.upcoming }} />
          Upcoming
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS.ongoing }} />
          Ongoing
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS.completed }} />
          Completed
        </span>
        <span className="text-xs text-warm-grey dark:text-dark-text-secondary ml-auto">
          {events.length} trip{events.length !== 1 ? 's' : ''} planned
        </span>
      </div>

      <style>{`
        .calendar-wrapper .rbc-toolbar {
          display: none;
        }
        .calendar-wrapper .rbc-month-view,
        .calendar-wrapper .rbc-time-view {
          border: 1px solid #e8eaed;
          border-radius: 8px;
          overflow: hidden;
        }
        .dark .calendar-wrapper .rbc-month-view,
        .dark .calendar-wrapper .rbc-time-view {
          border-color: #2a2a2a;
        }
        .calendar-wrapper .rbc-header {
          padding: 6px 2px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #6B7280;
          border-bottom: 1px solid #e8eaed;
        }
        .dark .calendar-wrapper .rbc-header {
          color: #9CA3AF;
          border-bottom-color: #2a2a2a;
        }
        .calendar-wrapper .rbc-date-cell {
          padding: 2px 4px;
          font-size: 11px;
          text-align: left;
        }
        .calendar-wrapper .rbc-button-link {
          font-size: 11px;
        }
        .calendar-wrapper .rbc-off-range-bg {
          background: rgba(0,0,0,0.02);
        }
        .dark .calendar-wrapper .rbc-off-range-bg {
          background: rgba(255,255,255,0.02);
        }
        .calendar-wrapper .rbc-row-segment {
          padding: 0 2px;
        }
        .calendar-wrapper .rbc-event {
          padding: 2px 4px;
          font-size: 10px;
        }
        .calendar-wrapper .rbc-show-more {
          font-size: 10px;
          color: #E76F51;
          font-weight: 500;
          padding: 2px 4px;
        }
        .calendar-wrapper .rbc-today {
          background-color: rgba(231, 111, 81, 0.08) !important;
        }
        @media (max-width: 640px) {
          .calendar-wrapper {
            padding: 8px !important;
          }
          .calendar-wrapper .rbc-month-row {
            min-height: 52px;
          }
          .calendar-wrapper .rbc-header {
            font-size: 9px;
            padding: 4px 1px;
          }
          .calendar-wrapper .rbc-date-cell {
            font-size: 10px;
            padding: 1px 3px;
          }
          .calendar-wrapper .rbc-event {
            font-size: 9px;
            padding: 1px 3px;
            border-radius: 3px;
          }
          .calendar-wrapper .rbc-event-content {
            font-size: 9px;
          }
          .calendar-wrapper .rbc-show-more {
            font-size: 9px;
          }
          .calendar-wrapper .rbc-time-header-content {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default CalendarPage;