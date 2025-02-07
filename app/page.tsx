'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (city.trim() === '') return;
    router.push(`/weather/${city}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Dashboard</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
    </div>
  );
}
