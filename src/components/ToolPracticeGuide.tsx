import React from "react";
import { Link } from "react-router-dom";

export interface OtherToolLink {
  path: string;
  name: string;
}

export interface ToolPracticeGuideProps {
  /** Section title, e.g. "Practice with the Guitar Triad Trainer" */
  title: string;
  /** Bullet list of tool features (optional). Shown first after the title. */
  features?: string[];
  /** Ordered steps for how to use the tool (e.g. 5 steps) */
  howToUseSteps: string[];
  /** Example practice routine content (React node for formatting/links) */
  exampleRoutine: React.ReactNode;
  /** Settings explained content */
  settingsExplained: React.ReactNode;
  /** Exactly 2 internal links to other tools users might find helpful */
  otherTools: [OtherToolLink, OtherToolLink];
}

const ToolPracticeGuide: React.FC<ToolPracticeGuideProps> = ({
  title,
  features,
  howToUseSteps,
  exampleRoutine,
  settingsExplained,
  otherTools,
}) => {
  return (
    <section className="text-left text-sm space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      {features && features.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Features</h3>
          <ul className="list-disc list-inside space-y-1 text-base-content/90">
            {features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">How to use</h3>
        <ol className="list-decimal list-inside space-y-1.5 text-base-content/90">
          {howToUseSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Example practice routine</h3>
        <div className="text-base-content/90 space-y-1.5">{exampleRoutine}</div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Settings explained</h3>
        <div className="text-base-content/90 space-y-1.5">{settingsExplained}</div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Other useful tools</h3>
        <ul className="list-none space-y-1 text-base-content/90">
          <li>
            <Link to={otherTools[0].path} className="link link-primary">
              {otherTools[0].name}
            </Link>
          </li>
          <li>
            <Link to={otherTools[1].path} className="link link-primary">
              {otherTools[1].name}
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ToolPracticeGuide;
