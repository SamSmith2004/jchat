'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const SignUpForm: React.FC = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      if (password !== confirmPassword) {
        setIsLoading(false);
        alert('Passwords do not match. Please try again.');
        return;
      }

      try {
        const response = await fetch('/api/signup', {  
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (!response.ok){
          setIsLoading(false);
          alert(data.message || 'Signup failed. Please try again.');
          return;
        }

        console.log('Signup successful!');
        
        // Sign in after signing up
        const result = await signIn('credentials', {
          email: email,
          password: password,
          redirect: false,
        });

        if (result?.error) {
          console.error('Error signing in after signup:', result.error);
          setIsLoading(false);
          alert('Signup successful, but there was an error signing in. Please try logging in.');
        } else {
          router.push('/home');
        }
       
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
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
            <div>
                <label htmlFor="password" className="block text-lg">Confirm password</label>
                <input 
                type="password" 
                name="confirmPassword" 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                className="mt-2 rounded-sm p-3 text-lg w-full max-w-xs text-black" />
            </div>
            <button type="submit" className="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded text-lg">
            {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
    )
}
export default SignUpForm;