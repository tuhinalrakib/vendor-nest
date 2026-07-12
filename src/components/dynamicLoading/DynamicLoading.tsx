import Image from 'next/image';
import React from 'react';

interface DynamicLoadingProps {
    loadingText: string;
}

const DynamicLoading = ({ loadingText }: DynamicLoadingProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-44 bg-white border border-zinc-200 rounded-3xl shadow-xs space-y-4">
            <div className="relative flex items-center justify-center w-14 h-14">
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 animate-ping duration-1500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-linear-to-tr from-indigo-500 via-violet-500 to-pink-500 mask-[linear-gradient(white,transparent)] animate-spin"></div>
                <div className="absolute inset-1 rounded-full border border-dashed border-zinc-300 animate-spin [animation-direction:reverse] duration-6000"></div>
                <div className="absolute inset-1.5 rounded-full bg-white flex items-center justify-center">
                    {/* <svg className="w-4 h-4 text-indigo-650 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg> */}
                    <Image 
                     src="/logo.png"
                     alt='Logo'
                     fill
                     sizes="(max-width: 768px) 120px, 180px"
                     className='w-4 h-4 rounded-full text-indigo-650 animate-pulse'
                    />
                </div>
            </div>
            <p
                className="text-xs font-bold text-zinc-400 animate-pulse"
            >
                {loadingText}
            </p>
        </div>
    );
};

export default DynamicLoading;