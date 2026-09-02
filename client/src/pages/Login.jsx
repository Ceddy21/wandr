import React, { useState } from 'react';
import { Plane, Eye, EyeOff, ShipWheel } from 'lucide-react';

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='min-h-screen flex items-center justify-center bg-warm-white dark:bg-dark-bg px-4 transition-colors duration-200'>
            <div className='w-full max-w-md bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl border border-[#e8eaed] dark:border-dark-border shadow-xl p-8 transition-all duration-300'>
                <div className='flex items-center justify-center gap-2.5 mb-6'>
                    <div className='p-2 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#e76f51] text-white shadow-md'>
                        <Plane className='w-5 h-5' />
                    </div>
                    <span className='font-serif text-2xl font-bold text-[#1a1a1a] dark:text-dark-text'> Wandr</span>
                </div>

                <h2 className='text-2xl font-bold text-center text-deep-charcoal dark:text-dark-text'>Welcome Back</h2>
                <p className='text-center text-warm-grey dark:text-dark-text-secondary mt-1 mb-8'>
                    Log in to continue planning your trips
                </p>

                <form className='space-y-6'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5'>Email</label>
                        <input 
                            type="email"
                            id='email'
                            placeholder='you@example.com'
                            className='w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-[#2d6a4f] dark:focus:ring-[#e76f51] transition-all duration-200 '
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className='block text-sm font-medium text-deep-charcoal dark:text-dark-text mb-1.5'>Password</label>
                        <div className='relative'>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                placeholder='********'
                                className='w-full px-4 py-2.5 rounded-lg border border-[#e8eaed] dark:border-dark-border bg-white dark:bg-dark-card text-deep-charcoal dark:text-dark-text focus:out;ine-none focus:ring-2 focus:ring-[#2d6a4f] dark:focus:ring-[#e76f51] transition-all duration-200'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 text-warm-grey dark:text-dark-text-secondary hover:text-[#2d6a4f] dark:hover:text-[#e76f51] transition-colors'
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                            </button>
                        </div>
                    </div>

                    <button
                        type='submit'
                        className='w-full py-3 bg-terracotta dark:bg-dark-terracotta text-white font-medium rounded-lg hover:bg-terracotta-hover dark:hover:bg-[#c47050] transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-terracotta/20 dark:shadow-dark-terracotta/20 touch-action-manipulation'
                    >
                        Login
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-warm-grey dark:text-dark-text-secondary'>
                        Don't have an account? {' '}

                        <a href="/signup" className='text-terracotta dark:text-dark-terracotta font-medium hover:underline transition-colors'>
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;