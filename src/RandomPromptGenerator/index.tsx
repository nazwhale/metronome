// random prompt generator
// activate from list of random prompts
// everytime you click the button, a new prompt is generated

import { useEffect, useState } from "react";
import { prompts } from "./prompts";

const RandomPromptGenerator = () => {
  const [activePromptIndex, setActivePromptIndex] = useState<number | null>(
    null,
  );

  // on mount, generate a random prompt
  useEffect(() => {
    generateRandomPrompt();
  }, []);

  const generateRandomPrompt = () => {
    let randomIndex = Math.floor(Math.random() * prompts.length);

    // If randomIndex is the same as the current activePromptIndex, try again
    if (randomIndex === activePromptIndex) {
      randomIndex = Math.floor(Math.random() * prompts.length);
    }

    setActivePromptIndex(randomIndex);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="min-h-[8rem] flex items-center justify-center card shadow bg-base-100 bg-neutral-content">
        {activePromptIndex != null && (
          <p className="text-xl font-semibold">{prompts[activePromptIndex]}</p>
        )}
      </div>
      <div className="my-6">
        <button className="btn btn-primary" onClick={generateRandomPrompt}>
          Random prompt
        </button>
      </div>

      <div className="divider my-8" />

      <div className="mt-6 font-color-gray">
        <h3 className="text-md mb-2">Prompts:</h3>
        <ul className="list-none pl-5 text-sm font-color-gray">
          {prompts.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RandomPromptGenerator;
