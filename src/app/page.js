'use client';

import { useState } from 'react';
import FlowInterface from './components/FlowCanvas/FlowCanvas';

export default function Home() {
  return (
    <FlowInterface />
  );
};

// export default function Home() {
//   const [a, setA] = useState('');
//   const [b, setB] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch('/api/sum', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ a, b }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setResult(data.sum);
//         setError('');
//       } else {
//         setError(data.error);
//         setResult(null);
//       }
//     } catch (err) {
//       setError('Failed to fetch');
//       setResult(null);
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">Add Two Numbers</h1>
//       <form onSubmit={handleSubmit} className="space-y-2">
//         <input
//           type="number"
//           value={a}
//           onChange={(e) => setA(e.target.value)}
//           placeholder="First number"
//           className="border p-2 w-full"
//           required
//         />
//         <input
//           type="number"
//           value={b}
//           onChange={(e) => setB(e.target.value)}
//           placeholder="Second number"
//           className="border p-2 w-full"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Add
//         </button>
//       </form>

//       {result !== null && (
//         <p className="mt-4 text-green-700 font-semibold">Sum: {result}</p>
//       )}
//       {error && (
//         <p className="mt-4 text-red-600">{error}</p>
//       )}
//     </div>
//   );
// }
