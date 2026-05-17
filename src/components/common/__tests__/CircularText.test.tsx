import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CircularText from "../CircularText";

describe("CircularText Component", () => {
  it("renders the provided text", () => {
    const testText = "ATLANTIS FEST";
    render(<CircularText text={testText} />);
    
    // Cada letra se renderiza en un span, ignoramos espacios para el test
    const letters = testText.split("").filter(l => l !== " ");
    letters.forEach((letter) => {
      // Usamos getAllByText porque algunas letras pueden repetirse
      const elements = screen.getAllByText(letter);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("applies the custom className", () => {
    const customClass = "custom-test-class";
    const { container } = render(<CircularText text="TEST" className={customClass} />);
    
    // motion.div es el primer hijo del contenedor de render
    expect(container.firstChild).toHaveClass(customClass);
  });
});
