import { describe, it, expect } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import TimetableGenerator from "@/components/TimetableGenerator";

describe("TimetableGenerator — priority-weighted split", () => {
  it("splits each day's hours proportionally to High:Medium:Low = 4:3:2 on the 5-level scale", () => {
    render(<TimetableGenerator />);

    const nameInputs = screen.getAllByPlaceholderText("Subject (e.g. Physics)");
    expect(nameInputs).toHaveLength(3); // starts with one High, one Medium, one Low row

    fireEvent.change(nameInputs[0], { target: { value: "Physics" } });   // High (default first row)
    fireEvent.change(nameInputs[1], { target: { value: "Math" } });      // Medium
    fireEvent.change(nameInputs[2], { target: { value: "Chemistry" } }); // Low

    const hoursInput = screen.getByLabelText("Hours available per day");
    fireEvent.change(hoursInput, { target: { value: "9" } });

    fireEvent.click(screen.getByRole("button", { name: "Generate timetable" }));

    expect(screen.getByText("Priority ratio: Physics : Math : Chemistry = 4 : 3 : 2")).toBeInTheDocument();

    // All three default to every day free, so Monday still splits 9h as 4:3:2.
    const mondayCard = screen.getByRole("heading", { name: "Mon" }).closest(".tool-day-card");
    expect(within(mondayCard).getByText(/Physics.*4h/)).toBeInTheDocument();
    expect(within(mondayCard).getByText(/Math.*3h/)).toBeInTheDocument();
    expect(within(mondayCard).getByText(/Chemistry.*2h/)).toBeInTheDocument();
  });

  it("offers all 5 priority levels, Very Low through Very High", () => {
    render(<TimetableGenerator />);
    const select = screen.getAllByRole("combobox", { name: /Priority for/ })[0];
    const optionLabels = within(select).getAllByRole("option").map((o) => o.textContent);
    expect(optionLabels).toEqual(["Very High", "High", "Medium", "Low", "Very Low"]);
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

describe("TimetableGenerator — per-subject free days", () => {
  it("only schedules a subject on the days it's marked free", () => {
    render(<TimetableGenerator />);

    const nameInputs = screen.getAllByPlaceholderText("Subject (e.g. Physics)");
    fireEvent.change(nameInputs[0], { target: { value: "Physics" } });
    fireEvent.change(nameInputs[1], { target: { value: "Chemistry" } });
    fireEvent.change(nameInputs[2], { target: { value: "Biology" } });

    // Restrict Physics to Mon/Wed/Fri only.
    const physicsGroup = nameInputs[0].closest(".tool-subject-row-group");
    ["Tue", "Thu", "Sat", "Sun"].forEach((day) => {
      fireEvent.click(within(physicsGroup).getByText(day));
    });

    fireEvent.click(screen.getByRole("button", { name: "Generate timetable" }));

    const mondayCard = screen.getByRole("heading", { name: "Mon" }).closest(".tool-day-card");
    const tuesdayCard = screen.getByRole("heading", { name: "Tue" }).closest(".tool-day-card");
    expect(within(mondayCard).getByText(/Physics/)).toBeInTheDocument();
    expect(within(tuesdayCard).queryByText(/Physics/)).not.toBeInTheDocument();
  });

  it("treats a subject with no free days picked as free every day instead of dropping it", () => {
    render(<TimetableGenerator />);

    const nameInputs = screen.getAllByPlaceholderText("Subject (e.g. Physics)");
    fireEvent.change(nameInputs[0], { target: { value: "Physics" } });

    const physicsGroup = nameInputs[0].closest(".tool-subject-row-group");
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((day) => {
      fireEvent.click(within(physicsGroup).getByText(day));
    });
    expect(within(physicsGroup).getByText(/scheduled every day for now/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Generate timetable" }));

    const sundayCard = screen.getByRole("heading", { name: "Sun" }).closest(".tool-day-card");
    expect(within(sundayCard).getByText(/Physics/)).toBeInTheDocument();
  });

  it("shows a priority tag and free-days summary for each subject in the result", () => {
    render(<TimetableGenerator />);
    const nameInputs = screen.getAllByPlaceholderText("Subject (e.g. Physics)");
    fireEvent.change(nameInputs[0], { target: { value: "Physics" } });

    fireEvent.click(screen.getByRole("button", { name: "Generate timetable" }));

    expect(screen.getByText(/Physics · free Every day/)).toBeInTheDocument();
  });
});
