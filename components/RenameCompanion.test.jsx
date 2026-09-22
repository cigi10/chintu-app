import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RenameCompanion from "@/components/RenameCompanion";

const mockSetCompanionName = vi.fn((name) => name.trim());

vi.mock("@/lib/companion", () => ({
  setCompanionName: (name) => mockSetCompanionName(name),
  NAME_CHIPS: ["Pip", "Mochi", "Tofu"],
}));

beforeEach(() => {
  mockSetCompanionName.mockClear();
});

function openEditor() {
  fireEvent.click(screen.getByRole("button", { name: "Rename" }));
  return screen.getByPlaceholderText("Type a new name...");
}

describe("RenameCompanion", () => {
  it("shows the current name and a Rename link by default", () => {
    render(<RenameCompanion currentName="Whiskers" onRenamed={vi.fn()} />);
    expect(screen.getByText("Whiskers")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Rename" })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Type a new name...")).not.toBeInTheDocument();
  });

  it("opens an editor prefilled with the current name when Rename is clicked", () => {
    render(<RenameCompanion currentName="Whiskers" onRenamed={vi.fn()} />);
    const input = openEditor();
    expect(input).toHaveValue("Whiskers");
    expect(screen.getByRole("button", { name: "Pip" })).toBeInTheDocument();
  });

  it("fills the input when a suggestion chip is clicked", () => {
    render(<RenameCompanion currentName="Whiskers" onRenamed={vi.fn()} />);
    openEditor();
    fireEvent.click(screen.getByRole("button", { name: "Mochi" }));
    expect(screen.getByPlaceholderText("Type a new name...")).toHaveValue("Mochi");
  });

  it("saves a typed name: calls setCompanionName, calls onRenamed, and returns to read mode", () => {
    const onRenamed = vi.fn();
    render(<RenameCompanion currentName="Whiskers" onRenamed={onRenamed} />);
    const input = openEditor();
    fireEvent.change(input, { target: { value: "Sushi" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockSetCompanionName).toHaveBeenCalledWith("Sushi");
    expect(onRenamed).toHaveBeenCalledWith("Sushi");
    expect(screen.queryByPlaceholderText("Type a new name...")).not.toBeInTheDocument();
  });

  it("saves on pressing Enter in the input", () => {
    const onRenamed = vi.fn();
    render(<RenameCompanion currentName="Whiskers" onRenamed={onRenamed} />);
    const input = openEditor();
    fireEvent.change(input, { target: { value: "Coco" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockSetCompanionName).toHaveBeenCalledWith("Coco");
    expect(onRenamed).toHaveBeenCalledWith("Coco");
  });

  it("trims whitespace before saving", () => {
    render(<RenameCompanion currentName="Whiskers" onRenamed={vi.fn()} />);
    const input = openEditor();
    fireEvent.change(input, { target: { value: "  Coco  " } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockSetCompanionName).toHaveBeenCalledWith("Coco");
  });

  it("disables Save when the input is empty or whitespace-only", () => {
    render(<RenameCompanion currentName="Whiskers" onRenamed={vi.fn()} />);
    const input = openEditor();
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    fireEvent.change(input, { target: { value: "   " } });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(mockSetCompanionName).not.toHaveBeenCalled();
  });

  it("discards changes and returns to read mode on Cancel, without saving", () => {
    const onRenamed = vi.fn();
    render(<RenameCompanion currentName="Whiskers" onRenamed={onRenamed} />);
    const input = openEditor();
    fireEvent.change(input, { target: { value: "Noodle" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockSetCompanionName).not.toHaveBeenCalled();
    expect(onRenamed).not.toHaveBeenCalled();
    expect(screen.getByText("Whiskers")).toBeInTheDocument();
  });
});
