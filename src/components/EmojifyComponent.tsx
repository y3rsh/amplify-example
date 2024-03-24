import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Assuming generateClient is correctly typed and initialized as per your application setup
const client = generateClient<Schema>();

const EmojifyComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Update the state to hold objects containing both input and reply
  const [responsePairs, setResponsePairs] = useState<Array<{ input: string, reply: string }>>([]);

  const handleEmojifyClick = async () => {
    if (!input.trim()) return; // Avoid empty queries
    setLoading(true);

    try {
      const response = await client.queries.chat({ input });
      const reply = response?.data?.reply || 'No reply';
      setLoading(false);
      // Store both the input and the reply in the state
      setResponsePairs(prevPairs => [...prevPairs, { input, reply }]);
      setInput(''); // Optionally clear input for the next entry, or keep it
    } catch (error) {
      console.error('Error during the query:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        {responsePairs.map(({ input, reply }, index) => (
          // Render both input and reply
          <div key={index}>
            <p><strong>Input:</strong> {input}</p>
            <p><strong>Reply:</strong> {reply}</p>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text"
          disabled={loading}
        />
        <button onClick={handleEmojifyClick} disabled={loading}>
          Emojify
        </button>
        {loading && <div style={{ position: 'absolute', top: 0, left: 0 }}>Loading...</div>}
      </div>
    </div>
  );
};

export default EmojifyComponent;
