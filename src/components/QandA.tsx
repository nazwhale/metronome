import React from "react";

export interface QAItem {
  question: string;
  answer: React.ReactNode;
}

interface QandAProps {
  items: QAItem[];
  title?: string;
}

const QandA: React.FC<QandAProps> = ({ items, title = "Frequently Asked Questions" }) => {
  return (
    <div className="text-sm">
      {title && <h3 className="font-semibold mb-3">{title}</h3>}
      <div className="space-y-3">
        {items.map((item, index) => (
          <details key={index} className="collapse collapse-arrow bg-base-200">
            <summary className="collapse-title font-medium text-sm pr-8">
              {item.question}
            </summary>
            <div className="collapse-content text-base-content/80">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default QandA;
