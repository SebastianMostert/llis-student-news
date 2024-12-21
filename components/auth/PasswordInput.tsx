"use client"
import React, { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

const PasswordInput = () => {
    const [showPassword, setShowPassword] = useState(false)

    // Show password when mouse or touch starts
    const handleShowPassword = () => {
        setShowPassword(true)
    }

    // Hide password when mouse or touch ends
    const handleHidePassword = () => {
        setShowPassword(false)
    }

    return (
        <label htmlFor="password" className="block text-sm font-medium">
            <div className="mb-1">
                Password
            </div>
            <div className="relative bg-primaryBg dark:bg-primaryBg-dark w-full rounded-md">
                <input
                    name="password"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 rounded-md bg-inherit text-white focus:outline-none focus:ring-2 placeholder:text-white"
                    placeholder="Enter your password"
                />
                <button
                    type="button"
                    onMouseDown={handleShowPassword} // Show password on mouse down
                    onMouseUp={handleHidePassword} // Hide password on mouse up
                    onMouseLeave={handleHidePassword} // Hide password if mouse leaves
                    onTouchStart={handleShowPassword} // Show password on touch start
                    onTouchEnd={handleHidePassword} // Hide password on touch end
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                        <EyeIcon className="h-5 w-5" />
                    )}
                </button>
            </div>
        </label>
    )
}

export default PasswordInput
