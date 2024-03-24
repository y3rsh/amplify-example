import React, { useState, useEffect } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

const EmojifyComponent: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [responsePairs, setResponsePairs] = useState<Array<{ input: string, reply: string }>>([]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const attributes = await fetchUserAttributes();
        setUserEmail(attributes?.email ?? null);
      } catch (error) {
        console.error('Error fetching user attributes:', error);
      }
    };

    fetchUserEmail();
  }, []); // Empty dependency array to run once on component mount

  const handleEmojifyClick = async () => {
    if (!input.trim() || !userEmail) return; // Avoid empty queries or missing email
    setLoading(true);

    try {
      // Step 1: Check for existing thread for user
      let threadId = 'FiRsT'; // Default value if no thread is found
      const userThreadResponse = await client.models.UserThread.get({ email: userEmail });
      if (userThreadResponse?.data.threadId) {
        threadId = userThreadResponse.data.threadId;
      }

      // Step 2: Call chat with threadId
      const response = await client.queries.chat({ input, threadId });
      const reply = response?.data?.reply || 'No reply';
      
      // Step 3: If threadId was 'FiRsT', handle pushing the new record
      if (threadId === 'FiRsT' && response?.data?.threadId) {
        // Example of handling a new thread ID, adjust based on actual API and requirements
        const saveThread = await client.models.UserThread.create({
          email: userEmail,
          threadId: response.data.threadId,
        });
        console.log('Saved new thread:', saveThread);
      }

      setLoading(false);
      // Store both the input and the reply in the state
      setResponsePairs(prevPairs => [...prevPairs, { input, reply }]);
      setInput(''); // Optionally clear input for the next entry
    } catch (error) {
      console.error('Error during the chat operation:', error);
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
        <button onClick={handleEmojifyClick} disabled={loading || !userEmail}>
          Emojify
        </button>
        {loading && <div style={{ position: 'absolute', top: 0, left: 0 }}>Loading...</div>}
      </div>
    </div>
  );
};

export default EmojifyComponent;
