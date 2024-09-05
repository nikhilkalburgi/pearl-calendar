import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for extended matchers
import RoundedDropdown from '@/app/components/dropdown';

// Mock styles as Next.js uses CSS Modules
jest.mock('@/app/page.module.css', () => ({
  dropdownContainer: 'dropdown-container',
  dropdown: 'dropdown',
  option: 'option',
}));

describe('RoundedDropdown Component', () => {
  const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
  const setRepeatTypeMock = jest.fn();

  beforeEach(() => {
    // Clear the mock function between tests
    setRepeatTypeMock.mockClear();
  });

  test('renders without crashing and shows default option', () => {
    render(<RoundedDropdown options={options} repeatType="" setRepeatType={setRepeatTypeMock} />);

    // Check if the dropdown is in the document
    const dropdown = screen.getByRole('combobox');
    expect(dropdown).toBeInTheDocument();

    // Check if the default option is "Select repeat type"
    const defaultOption = screen.getByText('Select repeat type');
    expect(defaultOption).toBeInTheDocument();
  });

  test('renders all options', () => {
    render(<RoundedDropdown options={options} repeatType="" setRepeatType={setRepeatTypeMock} />);

    // Check if all options are rendered
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test('calls setRepeatType when an option is selected', () => {
    render(<RoundedDropdown options={options} repeatType="" setRepeatType={setRepeatTypeMock} />);

    // Get the dropdown element
    const dropdown = screen.getByRole('combobox');

    // Simulate changing the value to "Monthly"
    fireEvent.change(dropdown, { target: { value: 'Monthly' } });

    // Check if setRepeatType was called with "Monthly"
    expect(setRepeatTypeMock).toHaveBeenCalledWith('Monthly');
  });

  test('shows the correct selected option', () => {
    render(<RoundedDropdown options={options} repeatType="Weekly" setRepeatType={setRepeatTypeMock} />);

    // Get the dropdown element
    const dropdown = screen.getByRole('combobox');

    // Check if the selected option is "Weekly"
    expect(dropdown).toHaveValue('Weekly');
  });
});
