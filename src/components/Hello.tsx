import { useEffect, useState } from "react";
import { WithAuthenticatorProps } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { fetchUserAttributes  } from 'aws-amplify/auth';

export default function Hello({ user }: WithAuthenticatorProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
      const fetchData = async () => {
        try {
          // Using Auth from aws-amplify to fetch user attributes
          const attributes = await fetchUserAttributes();
          setUserEmail(attributes?.email ?? null);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
  }, [user]); // Dependency array ensures this runs once upon component mount or user change

  return (
    <>
      <h2>Hello {userEmail}</h2>
    </>
  );
}
