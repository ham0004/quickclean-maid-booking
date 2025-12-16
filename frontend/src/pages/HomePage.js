import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const features = [
        {
            icon: '✨',
            title: 'Verified Professionals',
            description: 'All our maids are thoroughly vetted and background-checked for your peace of mind.'
        },
        {
            icon: '📅',
            title: 'Easy Booking',
            description: 'Book a cleaning service in just a few clicks. Choose your date, time, and service type.'
        },
        {
            icon: '💳',
            title: 'Secure Payments',
            description: 'Pay securely through our platform. No cash needed, with full transaction history.'
        },
        {
            icon: '⭐',
            title: 'Rated & Reviewed',
            description: 'Read reviews from other customers and choose the best maid for your needs.'
        },
        {
            icon: '🔄',
            title: 'Flexible Scheduling',
            description: 'Book one-time cleanings or schedule recurring services that fit your lifestyle.'
        },
        {
            icon: '🛡️',
            title: 'Satisfaction Guaranteed',
            description: "Not happy with the service? We'll make it right or give you a full refund."
        }
    ];

    const howItWorks = [
        {
            step: '01',
            title: 'Create Account',
            description: 'Sign up for free and tell us about your cleaning needs.'
        },
        {
            step: '02',
            title: 'Book a Service',
            description: 'Choose a maid, select date & time, and book your cleaning.'
        },
        {
            step: '03',
            title: 'Enjoy Clean Home',
            description: 'Relax while our professionals make your home sparkle.'
        }
    ];

    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative min-h-screen pt-20">
                {/* Background */}
                <div className="absolute inset-0 gradient-bg opacity-5"></div>
                <div className="absolute top-40 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>

                <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-12 pt-20 lg:flex-row lg:pt-32">
                        {/* Hero Content */}
                        <div className="max-w-2xl text-center lg:text-left fade-in">
                            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                Professional
                                <span className="block gradient-text">Home Cleaning</span>
                                Made Easy
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                                Book trusted, verified maids for your home in minutes.
                                Experience spotless living with QuickClean's professional cleaning services.
                            </p>
                            <div className="flex flex-col items-center gap-4 mt-10 sm:flex-row lg:justify-start">
                                <Link to="/register" className="w-full btn-primary sm:w-auto">
                                    Book Now — It's Free
                                </Link>
                                <Link to="/how-it-works" className="w-full btn-secondary sm:w-auto">
                                    Learn More
                                </Link>
                            </div>
                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 lg:justify-start">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <span className="text-2xl">🏆</span>
                                    <span className="text-sm font-medium">500+ Verified Maids</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <span className="text-2xl">⭐</span>
                                    <span className="text-sm font-medium">4.9/5 Rating</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <span className="text-2xl">✅</span>
                                    <span className="text-sm font-medium">10K+ Happy Homes</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="relative fade-in-delay-1">
                            <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[450px] lg:h-[450px]">
                                {/* Decorative circles */}
                                <div className="absolute inset-0 rounded-full gradient-bg opacity-20 animate-pulse-slow"></div>
                                <div className="absolute inset-4 bg-white rounded-full shadow-soft flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-8xl">🧹</span>
                                        <p className="mt-4 text-lg font-semibold text-gray-700">Sparkling Clean</p>
                                    </div>
                                </div>
                            </div>
                            {/* Floating badges */}
                            <div className="absolute -top-4 -left-4 glass-card !p-4 animate-float">
                                <span className="text-2xl">✨</span>
                                <p className="text-xs font-medium text-gray-700">100% Satisfaction</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 glass-card !p-4 animate-float" style={{ animationDelay: '2s' }}>
                                <span className="text-2xl">🏠</span>
                                <p className="text-xs font-medium text-gray-700">Same Day Service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white" id="features">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Why Choose <span className="gradient-text">QuickClean</span>?
                        </h2>
                        <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
                            We make home cleaning simple, reliable, and affordable.
                        </p>
                    </div>

                    <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="relative p-8 transition-all duration-300 bg-white border border-gray-100 group rounded-2xl hover:shadow-lg hover:border-primary-200"
                            >
                                <div className="flex items-center justify-center w-14 h-14 mb-6 text-2xl rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50" id="how-it-works">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
                            Getting your home cleaned has never been easier.
                        </p>
                    </div>

                    <div className="grid gap-8 mt-16 md:grid-cols-3">
                        {howItWorks.map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl gradient-bg text-white text-3xl font-bold">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="mt-3 text-gray-600">
                                    {item.description}
                                </p>
                                {/* Connector line */}
                                {index < howItWorks.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-secondary-300"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/register" className="btn-primary">
                            Get Started Now →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 gradient-bg">
                <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">
                        Ready for a Cleaner Home?
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-lg text-white/80">
                        Join thousands of happy homeowners who trust QuickClean for their cleaning needs.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-600 transition-all duration-300 bg-white rounded-full hover:shadow-lg hover:scale-105"
                        >
                            Create Free Account
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 border-2 border-white rounded-full hover:bg-white/10"
                        >
                            I Already Have an Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-900">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-bg">
                                <span className="text-xl">🧹</span>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Quick<span className="text-primary-400">Clean</span>
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                                About Us
                            </Link>
                            <Link to="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Services
                            </Link>
                            <Link to="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Contact
                            </Link>
                            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2024 QuickClean. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
