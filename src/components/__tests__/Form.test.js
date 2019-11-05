import React from "react";

import { render, cleanup } from "@testing-library/react";

import Form from "components/Appointment/Form";

import { fireEvent } from "@testing-library/react";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const fn = jest.fn(onSave => "Save");
    const { debug, getByText } = render(
      <Form interviewers={interviewers} onSave={fn} />
    );
    debug();
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(fn).not.toHaveBeenCalled();
  });

  it("calls onSave function when the name is defined", () => {
    const fn = jest.fn(onSave => "Save");
    const { debug, queryByText, getByText } = render(
      <Form interviewers={interviewers} onSave={fn} name="Lydia Miller-Jones" />
    );
    fireEvent.click(getByText("Save"));
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("Lydia Miller-Jones", null);
  });
});