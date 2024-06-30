'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignUpForm: React.FC = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
     
      try {
        // Send a POST request to the API endpoint
        const response = await fetch('/api/signup', {  
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
          console.log('Signup successful!');
          router.push('/home')
        } else {
          alert('Signup failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 text-blue-500 font-bold">
             <div>
                <label htmlFor="username" className="block text-lg">Username</label>
                <input 
                type="text" 
                name="username" 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" 
                required
                className="mt-2 rounded-sm p-3 text-lg w-full max-w-xs text-black" 
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-lg">Email</label>
                <input 
                type="email" 
                name="email" 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email@example.com" 
                required
                className="mt-2 rounded-sm p-3 text-lg w-full max-w-xs text-black" 
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-lg">Password</label>
                <input 
                type="password" 
                name="password" 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="mt-2 rounded-sm p-3 text-lg w-full max-w-xs text-black" />
            </div>
            <button type="submit" className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded text-lg">Sign Up</button>
        </form>
    )
}
export default SignUpForm;