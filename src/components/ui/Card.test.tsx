import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "./Card";

describe("Card Component", () => {
  describe("Rendering", () => {
    it("should render with children content", () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("should apply default variant by default", () => {
      render(<Card data-testid="card">Default Card</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-[var(--color-background-secondary)]", "border-slate-700");
    });

    it("should apply village variant when specified", () => {
      render(<Card variant="village" data-testid="card">Village Card</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-blue-900/20", "border-blue-700/50");
    });

    it("should apply werewolf variant when specified", () => {
      render(<Card variant="werewolf" data-testid="card">Werewolf Card</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-red-900/20", "border-red-700/50");
    });

    it("should apply solo variant when specified", () => {
      render(<Card variant="solo" data-testid="card">Solo Card</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-purple-900/20", "border-purple-700/50");
    });

    it("should apply glass variant when specified", () => {
      render(<Card variant="glass" data-testid="card">Glass Card</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-white/5", "backdrop-blur-sm", "border-white/10");
    });
  });

  describe("Padding", () => {
    it("should apply medium padding by default", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("p-4");
    });

    it("should apply no padding when specified", () => {
      render(<Card padding="none" data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).not.toHaveClass("p-4", "p-3", "p-6");
    });

    it("should apply small padding when specified", () => {
      render(<Card padding="sm" data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("p-3");
    });

    it("should apply large padding when specified", () => {
      render(<Card padding="lg" data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("p-6");
    });
  });

  describe("Hover Effects", () => {
    it("should not have hover styles by default", () => {
      render(<Card data-testid="card">No Hover</Card>);
      const card = screen.getByTestId("card");
      expect(card).not.toHaveClass("cursor-pointer");
    });

    it("should apply hover styles when hover is true", () => {
      render(<Card hover data-testid="card">Hoverable</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("hover:shadow-xl", "hover:border-opacity-80", "cursor-pointer");
    });

    it("should have translate effect on hover", () => {
      render(<Card hover data-testid="card">Hoverable</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("hover:-translate-y-0.5");
    });
  });

  describe("Custom Props", () => {
    it("should apply custom className", () => {
      render(<Card className="custom-class" data-testid="card">Custom</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("custom-class");
    });

    it("should forward HTML div attributes", () => {
      render(
        <Card id="test-card" data-custom="value" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("id", "test-card");
      expect(card).toHaveAttribute("data-custom", "value");
    });

    it("should support ref forwarding", () => {
      const ref = { current: null };
      render(<Card ref={ref}>Ref Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("should support onClick handler", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Card onClick={handleClick} data-testid="card">Clickable</Card>);
      const card = screen.getByTestId("card");

      await user.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Base Styles", () => {
    it("should have rounded corners", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("rounded-xl");
    });

    it("should have border", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("border");
    });

    it("should have transition animation", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("transition-all", "duration-250");
    });
  });

  describe("Team-Specific Styling", () => {
    it("should have shadow effect for village variant", () => {
      render(<Card variant="village" data-testid="card">Village</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("shadow-lg", "shadow-blue-900/20");
    });

    it("should have shadow effect for werewolf variant", () => {
      render(<Card variant="werewolf" data-testid="card">Werewolf</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("shadow-lg", "shadow-red-900/20");
    });

    it("should have shadow effect for solo variant", () => {
      render(<Card variant="solo" data-testid="card">Solo</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("shadow-lg", "shadow-purple-900/20");
    });

    it("should have glass effect for glass variant", () => {
      render(<Card variant="glass" data-testid="card">Glass</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("shadow-xl");
    });
  });
});
