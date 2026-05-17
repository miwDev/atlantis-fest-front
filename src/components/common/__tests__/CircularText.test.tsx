import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CircularText from "../CircularText";

describe("CircularText Component", () => {
  it("renders the provided text", () => {
    const testText = "ATLANTIS FEST";
    render(<CircularText text={testText} />);
    
    const letters = testText.split("").filter(l => l !== " ");
    letters.forEach((letter) => {
      const elements = screen.getAllByText(letter);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it("applies the custom className", () => {
    const customClass = "custom-test-class";
    const { container } = render(<CircularText text="TEST" className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });
});
