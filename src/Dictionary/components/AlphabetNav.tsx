interface AlphabetNavProps {
  availableLetters: string[];
  onLetterClick?: (letter: string) => void;
}

const AlphabetNav: React.FC<AlphabetNavProps> = ({
  availableLetters,
  onLetterClick,
}) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleClick = (letter: string) => {
    if (availableLetters.includes(letter)) {
      const element = document.getElementById(`letter-${letter}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      onLetterClick?.(letter);
    }
  };

  return (
    <nav className="flex flex-wrap justify-center gap-1 mb-8 p-4 bg-base-200 rounded-box">
      {alphabet.map((letter) => {
        const isAvailable = availableLetters.includes(letter);
        return (
          <button
            key={letter}
            onClick={() => handleClick(letter)}
            disabled={!isAvailable}
            className={`
              w-8 h-8 rounded font-semibold text-sm transition-colors
              ${
                isAvailable
                  ? "bg-base-100 hover:bg-primary hover:text-primary-content cursor-pointer"
                  : "bg-base-300 text-base-content/30 cursor-not-allowed"
              }
            `}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
};

export default AlphabetNav;
