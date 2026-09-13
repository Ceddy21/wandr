import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  MapPin,
  MessageCircle,
  Sun,
  Moon,
  Users,
} from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=85';

const destinations = [
  {
    name: 'Boracay',
    region: 'Aklan, Philippines',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Boracay%20White%20Beach.png?width=1400',
    position: 'center',
    description:
      'White Beach, island days, and an itinerary your whole crew can actually follow.',
  },
  {
    name: 'El Nido',
    region: 'Palawan, Philippines',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/El_Nido_in_Palawan.jpg?width=1400',
    position: 'center',
    description:
      'Island-hopping plans become easier when destinations, activities, and people stay in one place.',
  },
  {
    name: 'Chocolate Hills',
    region: 'Bohol, Philippines',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/The_Bohol_Chocolate_Hills.jpg?width=1400',
    position: 'center',
    description:
      'Keep the route, activities, and shared costs organized before the road trip begins.',
  },
  {
    name: 'Coron',
    region: 'Palawan, Philippines',
    image:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Coron%2C%20Palawan.jpg?width=1400',
    position: 'center',
    description:
      'Bring the group together around one plan, from the first idea to the final day.',
  },
];

const features = [
  {
    title: 'Plan together',
    description:
      'Keep destinations, activities, dates, and trip decisions in one shared itinerary.',
    icon: CalendarDays,
  },
  {
    title: 'Share the cost',
    description:
      'Record group expenses so everyone can see what was paid and what still needs settling.',
    icon: DollarSign,
  },
  {
    title: 'Stay in sync',
    description:
      'Keep trip conversations close to the plans instead of scattered across group chats.',
    icon: MessageCircle,
  },
];

function Hero({ theme, toggleTheme }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeDestination = destinations[activeIndex];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (isPaused || prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % destinations.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? destinations.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % destinations.length);
  };

  return (
    <main className="relative overflow-hidden bg-warm-white dark:bg-dark-bg">
      {/* ─── Theme toggle (floating top-right) ──────────────── */}
      {typeof toggleTheme === 'function' && (
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[#E3E3DD] bg-white/80 text-[#4A4A4A] shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#2D6A4F] active:scale-95 dark:border-dark-border dark:bg-dark-card/80 dark:text-dark-text-secondary dark:hover:bg-dark-card dark:hover:text-dark-terracotta sm:right-6 sm:top-6 sm:h-11 sm:w-11"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Moon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      )}

      <section className="relative isolate">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-[#2D6A4F]/10 blur-3xl" />
          <div className="absolute right-[-10rem] top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-[#E76F51]/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-16 lg:px-10 lg:pb-24 lg:pt-16 xl:gap-20">
          <div className="max-w-2xl lg:pb-10">
            <h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-deep-charcoal dark:text-dark-text sm:text-6xl lg:text-7xl xl:text-[5.3rem]">
              The trip is the fun part.
              <span className="mt-2 block text-terracotta dark:text-dark-terracotta">
                Planning it should be too.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-warm-grey dark:text-dark-text-secondary sm:text-lg sm:leading-8">
              Wandr gives your crew one place to build the itinerary, keep
              shared expenses clear, and stay in the loop. Less back-and-forth,
              more time getting ready to go.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#E76F51]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-terracotta-hover hover:shadow-xl hover:shadow-[#E76F51]/25 active:translate-y-0 dark:bg-dark-terracotta dark:hover:bg-[#c47050] sm:px-7"
              >
                Plan with your crew
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-[#D9DBD6] bg-transparent px-6 py-3.5 text-sm font-semibold text-deep-charcoal transition duration-200 hover:-translate-y-0.5 hover:border-[#2D6A4F]/30 hover:bg-white dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-card sm:px-7"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-warm-grey dark:text-dark-text-secondary">
              <div className="flex -space-x-2" aria-hidden="true">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-warm-white bg-[#DCE8E2] text-[#2D6A4F] dark:border-dark-bg">
                  <Users className="h-4 w-4" />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-warm-white bg-[#F6D8D0] text-terracotta dark:border-dark-bg">
                  <Users className="h-4 w-4" />
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-warm-white bg-[#E8E5D8] text-[#2D6A4F] dark:border-dark-bg">
                  <Users className="h-4 w-4" />
                </span>
              </div>
              <span>
                Designed around the way groups actually plan trips.
              </span>
            </div>
          </div>

          <div
            className="relative min-w-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <div className="absolute -left-5 top-10 h-20 w-20 border-l border-t border-[#2D6A4F]/25 dark:border-dark-terracotta/25 sm:-left-8 sm:h-28 sm:w-28" />
            <div className="absolute -bottom-5 right-4 h-20 w-20 border-b border-r border-[#E76F51]/25 sm:-bottom-8 sm:h-28 sm:w-28" />

            <div className="relative">
              <div
                className="relative aspect-[0.93] overflow-hidden rounded-[2rem] bg-[#D9DED8] shadow-[0_30px_80px_-28px_rgba(26,26,26,0.35)] sm:aspect-[1.03]"
                role="region"
                aria-roledescription="carousel"
                aria-label="Featured Philippine destinations"
              >
                <img
                  key={activeDestination.name}
                  src={activeDestination.image}
                  alt={`${activeDestination.name}, ${activeDestination.region}`}
                  className="absolute inset-0 h-full w-full scale-100 object-cover transition-opacity duration-500 motion-reduce:transition-none"
                  style={{ objectPosition: activeDestination.position }}
                  loading="eager"
                  decoding="async"
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_IMAGE) {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/0" />

                <div className="absolute left-5 right-5 top-5 flex items-start justify-between sm:left-7 sm:right-7 sm:top-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Philippines
                  </div>

                  <div className="rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md">
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(destinations.length).padStart(2, '0')}
                  </div>
                </div>

                <div
                  className="absolute bottom-0 left-0 right-0 p-5 sm:p-7"
                  aria-live="polite"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E76F51]" />
                    {activeDestination.region}
                  </div>

                  <h2 className="mt-2 max-w-lg font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {activeDestination.name}
                  </h2>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
                    {activeDestination.description}
                  </p>

                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {destinations.map((destination, index) => (
                        <button
                          key={destination.name}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          className={`h-1.5 rounded-full transition-[width,opacity] duration-300 motion-reduce:transition-none ${
                            index === activeIndex
                              ? 'w-8 bg-white'
                              : 'w-1.5 bg-white/45 hover:bg-white/75'
                          }`}
                          aria-label={`Show ${destination.name}`}
                          aria-current={
                            index === activeIndex ? 'true' : undefined
                          }
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={goToPrevious}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur-md transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                        aria-label="Previous destination"
                      >
                        <ChevronLeft
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur-md transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                        aria-label="Next destination"
                      >
                        <ChevronRight
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 sm:mt-5 sm:grid-cols-4">
                {destinations.map((destination, index) => (
                  <button
                    key={destination.name}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group relative overflow-hidden rounded-2xl text-left focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:ring-offset-2 dark:focus:ring-offset-dark-bg ${
                      index === activeIndex ? 'ring-2 ring-[#E76F51]' : ''
                    }`}
                    aria-label={`Select ${destination.name}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                  >
                    <img
                      src={destination.image}
                      alt=""
                      className="h-20 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-24"
                      style={{ objectPosition: destination.position }}
                      loading="lazy"
                      decoding="async"
                      onError={(event) => {
                        if (event.currentTarget.src !== FALLBACK_IMAGE) {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2 pt-5 text-[11px] font-semibold text-white sm:text-xs">
                      {destination.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-[#E3E3DD] bg-[#F4F5F1] dark:border-dark-border dark:bg-dark-card/30"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="max-w-md">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-terracotta dark:text-dark-terracotta">
                One trip. One place.
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-deep-charcoal dark:text-dark-text sm:text-4xl">
                The details stay organized, so the group can stay excited.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature, index) => (
                <article key={feature.title} className="relative">
                  {index > 0 && (
                    <div className="absolute -left-4 top-0 hidden h-full w-px bg-[#DCDDD8] sm:block" />
                  )}

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-terracotta shadow-sm dark:bg-dark-card dark:text-dark-terracotta">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-deep-charcoal dark:text-dark-text">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-warm-grey dark:text-dark-text-secondary">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Hero;