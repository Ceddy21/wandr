import React from 'react';
import { MapPin, DollarSign, MessageCircle, Users, Sparkles, Plane } from 'lucide-react';

const features = [
    {
        title: "Plan Together",
        description: "Collaborate with friends and family to plan your trips seamlessly.",
        icon: MapPin,
    },
    {
        title: "Split Expenses",
        description: "Track who paid what and simplify debts.",
        icon: DollarSign,
    },
    {
        title: "Chat in Real-Time",
        description: "Keep everyone in the loop with trip-specific real-time chat.",
        icon: MessageCircle,
    }
];

function Hero() {
    return (
        <div className="relative px-4 sm:px-6 md:px-10 lg:px-20 py-8 sm:py-12 lg:py-16 overflow-hidden">
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" aria-hidden="true">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle fill="#2D6A4F" cx="2" cy="2" r="1.5"></circle>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dots)"></rect>
                </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-8 lg:gap-16">
                
                <div className="w-full lg:w-[55%] text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 bg-terracotta-soft dark:bg-dark-terracotta-soft rounded-full px-4 py-1.5 mb-4">
                        <Sparkles className="w-4 h-4 text-terracotta dark:text-dark-terracotta" aria-hidden="true" />
                        <span className="text-sm font-medium text-terracotta dark:text-dark-terracotta">
                            Your Crew. Your Trip. Zero Stress.
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-deep-charcoal dark:text-dark-text leading-[1.1] text-balance">
                        Plan Trips with Friends.
                        <span className="text-terracotta dark:text-dark-terracotta block mt-1">Not Spreadsheets.</span>
                    </h1>

                    <p className="text-base sm:text-lg font-medium text-terracotta/80 dark:text-dark-terracotta/80 mt-3 max-w-lg mx-auto lg:mx-0">
                        The all-in-one group travel planner for your next adventure.
                    </p>

                    <p className="text-base sm:text-lg text-warm-grey dark:text-dark-text-secondary mt-2 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                        Wandr helps you plan trips, split expenses, and stay connected with your crew. 
                        No spreadsheets. No stress.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                        <a 
                            href="/login" 
                            className="touch-action-manipulation px-8 py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-105 text-sm sm:text-base text-center shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20"
                            aria-label="Start planning your trip"
                        >
                            Start Planning →
                        </a>
                        <a 
                            href="/login" 
                            className="touch-action-manipulation px-8 py-3 border border-[#e3e3dd] dark:border-dark-border text-deep-charcoal dark:text-dark-text font-medium rounded-lg hover:bg-off-white dark:hover:bg-dark-card transition-all duration-300 hover:scale-105 text-sm sm:text-base text-center"
                            aria-label="Explore Wanderly features"
                        >
                            Explore Features →
                        </a>
                    </div>

                    <div className="flex items-center gap-4 mt-8 justify-center lg:justify-start">
                        <div className="flex -space-x-2" aria-hidden="true">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft flex items-center justify-center border-2 border-warm-white dark:border-dark-bg">
                                    <Users className="w-4 h-4 text-deep-charcoal dark:text-dark-text" aria-hidden="true" />
                                </div>
                            ))}
                        </div>
                        <span className="text-sm text-warm-grey dark:text-dark-text-secondary">
                            <strong className="text-2xl sm:text-3xl font-bold text-deep-charcoal dark:text-dark-text">500+</strong>{' '}
                            travelers already planning
                        </span>
                    </div>
                </div>

                <div className="relative w-full lg:w-[45%]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-gradient-to-br from-[#2D6A4F]/10 to-[#E76F51]/10 rounded-full blur-3xl" aria-hidden="true"></div>
                    <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-[#2D6A4F]/20 dark:border-[#E76F51]/20 rounded-tl-xl z-10" aria-hidden="true"></div>
                    <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-[#2D6A4F]/20 dark:border-[#E76F51]/20 rounded-br-xl z-10" aria-hidden="true"></div>

                    <div className="absolute -top-4 -right-4 bg-white dark:bg-dark-card rounded-xl shadow-lg p-3 border border-[#e8eaed] dark:border-dark-border z-20">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-terracotta-soft dark:bg-dark-terracotta-soft" aria-hidden="true">
                                <Plane className="w-4 h-4 text-terracotta dark:text-dark-terracotta" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#1A1A1A] dark:text-dark-text">12 flights</p>
                                <p className="text-xs text-[#4A4A4A] dark:text-dark-text-secondary">3 hotels • 2 activities</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative rounded-xl overflow-hidden border border-[#e8eaed] dark:border-dark-border shadow-2xl shadow-[#2D6A4F]/10 dark:shadow-[#E76F51]/5 transition-all duration-500 hover:shadow-[#2D6A4F]/20 dark:hover:shadow-[#E76F51]/10 hover:scale-[1.02]">
                        <img 
                            src="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80" 
                            alt="Friends planning a trip together"
                            width="800"
                            height="500"
                            className="w-full object-cover max-h-[300px] sm:max-h-[400px] lg:max-h-[500px]"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1A1A1A]/30 to-transparent" aria-hidden="true"></div>
                        
                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="backdrop-blur-sm bg-white/20 dark:bg-dark-card/20 rounded-lg px-4 py-2 inline-block border border-white/20 dark:border-white/10">
                                <div className="flex items-center gap-2">
                                    <Plane className="w-4 h-4 text-white/90" aria-hidden="true" />
                                    <span className="text-xs font-medium text-white/90">12 flights • 3 hotels • 2 activities</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mt-16 sm:mt-20 md:mt-24">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        role="article"
                        className="bg-white dark:bg-dark-card border border-[#e3e3dd] dark:border-dark-border rounded-xl p-4 sm:p-6 hover:border-terracotta dark:hover:border-dark-terracotta hover:shadow-md transition-all duration-300 group"
                    >
                        <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-terracotta-soft dark:bg-dark-terracotta-soft group-hover:bg-terracotta dark:group-hover:bg-dark-terracotta transition-colors duration-300" aria-hidden="true">
                                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta dark:text-dark-terracotta group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-deep-charcoal dark:text-dark-text text-sm sm:text-base">
                                    {feature.title}
                                </h3>
                                <p className="mt-1 text-xs sm:text-sm text-warm-grey dark:text-dark-text-secondary leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Hero;