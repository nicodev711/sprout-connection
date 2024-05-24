import React from 'react';
import Image from 'next/image';

export default function ComingSoon() {
    return (
        <section className="flex flex-col items-center justify-center min-h-96 text-center p-4">
            <div className="w-full p-8 rounded-lg max-w-4xl mx-auto">
                <div className="relative w-full" style={{ paddingBottom: '75%' }}> {/* This maintains a 4:3 aspect ratio */}
                    <Image
                        src="/comingSoon2.png" // Ensure this path matches where you saved the image
                        alt="Coming Soon"
                        layout="fill"
                        objectFit="cover" // This ensures the image covers the entire container
                        className="rounded-lg shadow-md"
                    />
                </div>
            </div>
        </section>
    );
}
