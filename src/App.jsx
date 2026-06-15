import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";

function App() {
const [profile, setProfile] = useState(null);
useEffect(() => {
    fetch("/config.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch configuration blueprint");
        }
        return response.json();
      })
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error loading config:", error));
  }, []);

  return (
    <div>
      {/* Pass the profile down to components */}
      <Header profile={profile} />
      <Hero profile={profile} />
    </div>
  );
}

export default App;