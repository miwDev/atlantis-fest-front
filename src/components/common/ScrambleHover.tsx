import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface ScrambleHoverProps {
  text: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  scrambledClassName?: string;
  scrambleOnMount?: boolean;
}

const ScrambleHover = ({
  text,
  scrambleSpeed = 100,
  maxIterations = 10,
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  scrambledClassName = "",
  sequential = false,
  revealDirection = "start",
  scrambleOnMount = true,
  ...props
}: ScrambleHoverProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const revealedIndices = useRef(new Set<number>());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(""))).filter((char) => char !== " ")
    : characters.split("");

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    revealedIndices.current.clear();
    setIsScrambling(true);

    let currentIteration = 0;

    const getNextIndex = () => {
      const size = revealedIndices.current.size;
      const length = text.length;
      switch (revealDirection) {
        case "start": return size;
        case "end": return length - 1 - size;
        case "center": {
          const middle = Math.floor(length / 2);
          const offset = Math.floor(size / 2);
          const nextIndex = size % 2 === 0 ? middle + offset : middle - offset - 1;
          if (nextIndex >= 0 && nextIndex < length && !revealedIndices.current.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < length; i++) {
            if (!revealedIndices.current.has(i)) return i;
          }
          return 0;
        }
        default: return size;
      }
    };

    const shuffleText = () => {
      if (useOriginalCharsOnly) {
        const positions = text.split("").map((char, i) => ({
          char,
          isSpace: char === " ",
          index: i,
          isRevealed: revealedIndices.current.has(i),
        }));

        const nonSpaceChars = positions
          .filter((p) => !(p.isSpace || p.isRevealed))
          .map((p) => p.char);

        for (let i = nonSpaceChars.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
        }

        let charIndex = 0;
        return positions
          .map((p) => {
            if (p.isSpace) return " ";
            if (p.isRevealed) return text[p.index];
            return nonSpaceChars[charIndex++];
          })
          .join("");
      }
      return text.split("").map((char, i) => {
        if (char === " ") return " ";
        if (revealedIndices.current.has(i)) return text[i];
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      }).join("");
    };

    intervalRef.current = setInterval(() => {
      if (sequential) {
        currentIteration++;
        const iterationsPerChar = Math.max(1, Math.floor(maxIterations / text.length));

        if (currentIteration % iterationsPerChar === 0 && revealedIndices.current.size < text.length) {
          revealedIndices.current.add(getNextIndex());
        }

        if (revealedIndices.current.size < text.length) {
          setDisplayText(shuffleText());
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsScrambling(false);
          setDisplayText(text);
        }
      } else {
        setDisplayText(shuffleText());
        currentIteration++;
        if (currentIteration >= maxIterations) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsScrambling(false);
          setDisplayText(text);
        }
      }
    }, scrambleSpeed);
  };

  useEffect(() => {
    if (scrambleOnMount) {
      startScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrambleOnMount]);

  return (
    <motion.span
      onHoverStart={() => {
        if (!isScrambling) startScramble();
      }}
      className={`inline-block whitespace-pre-wrap ${className}`}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const isRevealedOrDone = revealedIndices.current.has(index) || !isScrambling;
          return (
            <span
              key={`${index}-${char}`}
              className={isRevealedOrDone ? "" : scrambledClassName}
            >
              {char}
            </span>
          );
        })}
      </span>
    </motion.span>
  );
};

export default ScrambleHover;

