'use client'

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { verifyEmailService } from "@/services/user-service";
import ReactLoading from 'react-loading';

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
};

const cardStyle = {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    textAlign: 'center' as const,
    maxWidth: '400px',
    width: '90%'
};

function VerifyEmailComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');
    const userId = searchParams.get('userId');

    useEffect(() => {
        // if (!token || !userId) {
        //     router.push('/signup');
        // }
    }, [router, searchParams, token, userId]);

    const { isLoading, error } = useSWR(`/user/verify-email/${userId}`, verifyEmailService);

    if (error && token && userId) return (
        <div style={containerStyle}>
            <div style={{ ...cardStyle, border: '1px solid #ff4444' }}>
                <h2 style={{ color: '#ff4444', marginBottom: '1rem' }}>Verification Failed</h2>
                <p style={{ color: '#666' }}>Sorry, we couldnt verify your email. Please try again.</p>
            </div>
        </div>
    );

    if (isLoading) return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: '#e87223', marginBottom: '1rem' }}>Verifying Email</h2>
                <ReactLoading type='bars' color='#e87223' height={40} width={40} />
            </div>
        </div>
    );

    return (
        <div style={containerStyle}>
            {(userId || token) ? < div style={{ ...cardStyle, border: '1px solid #4CAF50' }}>
                <h1 className="font-bold">Maity Pro Account 🚀</h1>
                <p style={{ color: '#666' }}>Your email has been successfully verified.</p>
                <p className="p-2">Click here to go to login</p>
                <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded" onClick={() => router.push('/login')}>Login</button>
            </div>
                :
                <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center border-[1px]-[#4CAF50]' ">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-600 mb-2">
                        We&rsquo;ve sent a verification link to your email address.
                    </p>
                    <p className="text-gray-600">
                        Please check your inbox or spam folder to verify your email.
                    </p>
                </div>
            }


        </div >

    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div style={containerStyle}>
                <div style={cardStyle}>
                    <ReactLoading type='bars' color='#e87223' height={40} width={40} />
                </div>
            </div>
        }>
            <VerifyEmailComponent />
        </Suspense>
    );
}