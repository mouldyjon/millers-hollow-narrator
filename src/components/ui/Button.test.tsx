import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button Component", () => {
  describe("Rendering", () => {
    it("should render with children text", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("should apply primary variant by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-[var(--color-background-tertiary)]");
    });

    it("should apply secondary variant when specified", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-slate-700");
    });

    it("should apply danger variant when specified", () => {
      render(<Button variant="danger">Delete</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-red-600");
    });

    it("should apply success variant when specified", () => {
      render(<Button variant="success">Save</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-green-600");
    });

    it("should apply ghost variant when specified", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent");
    });

    it("should apply gold variant when specified", () => {
      render(<Button variant="gold">Gold</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-gradient-to-r");
      expect(button).toHaveClass("from-[var(--color-accent-amber)]");
    });
  });

  describe("Sizes", () => {
    it("should apply medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-base", "px-6", "py-2.5");
    });

    it("should apply small size when specified", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-sm", "px-4", "py-1.5");
    });

    it("should apply large size when specified", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-lg", "px-8", "py-3");
    });
  });

  describe("Full Width", () => {
    it("should not be full width by default", () => {
      render(<Button>Normal</Button>);
      const button = screen.getByRole("button");
      expect(button).not.toHaveClass("w-full");
    });

    it("should apply full width when specified", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });
  });

  describe("Loading State", () => {
    it("should show loading spinner when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector(".animate-spin")).toBeInTheDocument();
    });

    it("should disable button when isLoading is true", () => {
      render(<Button isLoading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should not show loading spinner when isLoading is false", () => {
      render(<Button isLoading={false}>Not Loading</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector(".animate-spin")).not.toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("should disable button when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should apply disabled styles", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("disabled:opacity-50", "disabled:cursor-not-allowed");
    });
  });

  describe("Interactions", () => {
    it("should call onClick handler when clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole("button");

      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");

      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should not call onClick when loading", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} isLoading>
          Loading
        </Button>
      );
      const button = screen.getByRole("button");

      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Custom Props", () => {
    it("should apply custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should forward HTML button attributes", () => {
      render(
        <Button type="submit" name="submitBtn" data-testid="submit-button">
          Submit
        </Button>
      );
      const button = screen.getByTestId("submit-button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("name", "submitBtn");
    });

    it("should support ref forwarding", () => {
      const ref = { current: null };
      render(<Button ref={ref}>Ref Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Accessibility", () => {
    it("should have focus ring styles", () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:outline-none", "focus:ring-2");
    });

    it("should be keyboard accessible", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole("button");

      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
