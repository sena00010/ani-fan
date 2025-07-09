import React from "react";

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            {/*<h1 className="text-6xl font-bold text-indigo-600 mb-4">C</h1>*/}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
Coming Soon...
            </h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                The page you are looking for is Coming Soon.
                Thank you for your understanding
            </p>
            <a
                href="/"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                Back to Home Page
            </a>
        </div>
    );
}
