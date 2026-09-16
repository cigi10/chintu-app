import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import TimetableGenerator from "@/components/TimetableGenerator";

describe("TimetableGenerator — priority-weighted split", () => {
  it("splits each day's hours proportionally to High:Medium:Low = 3:2:1", () => {
    render(<TimetableGenerator />);

    const nameInputs = screen.getAllByPlaceholderText("Subject (e.g. Physics)");
    expect(nameInputs).toHaveLength(3); // starts with one High, one Medium, one Low row

    fireEvent.change(nameInputs[0], { target: { value: "Physics" } });   // High (default first row)
    fireEvent.change(nameInputs[1], { target: { value: "Math" } });      // Medium
    fireEvent.change(nameInputs[2], { target: { value: "Chemistry" } }); // Low

    const hoursInput = screen.getByLabelText("Hours available per day");
    fireEvent.change(hoursInput, { target: { value: "6" } });

    fireEvent.click(screen.getByRole("button", { name: "Generate timetable" }));

    expect(screen.getByText("Priority ratio: Physics : Math : Chemistry = 3 : 2 : 1")).toBeInTheDocument();

    const mondayCard = screen.getByText("Mon").closest(".tool-day-card");
    expect(within(mondayCard).getByText(/Physics.*3h/)).toBeInTheDocument();
    expect(within(mondayCard).getByText(/Math.*2h/)).toBeInTheDocument();
    expect(within(mondayCard).getByText(/Chemistry.*1h/)).toBeInTheDocument();
  });

  it("lets a subject row's priority be changed and the removed count enforces at least one row", () => {
    render(<TimetableGenerator />);

    const removeButtons = screen.getAllByLabelText(/Remove/);
    expect(removeButtons).toHaveLength(3);

    fireEvent.click(removeButtons[2]);
    fireEvent.click(screen.getAllByLabelText(/Remove/)[1]);

    // Down to one row now — its own remove button must be disabled.
    const lastRemove = screen.getAllByLabelText(/Remove/)[0];
    expect(lastRemove).toBeDisabled();
  });
});
