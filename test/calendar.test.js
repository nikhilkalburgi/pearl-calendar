import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers for jest
import MultiDatePicker from '@/app/components/calendar';
import dayjs from 'dayjs';

// Mock styles as Next.js uses CSS Modules
jest.mock('@/app/page.module.css', () => ({
    dropdownContainer: 'dropdown-container',
    dropdown: 'dropdown',
    option: 'option',
  }));

describe('MultiDatePicker Component', () => {
  const startDate = dayjs('2024-09-01');
  const endDate = dayjs('2024-09-30');
  
  it('should render the date picker and select days based on repeatType "Daily"', () => {
    render(
      <MultiDatePicker
        startDate={startDate}
        endDate={endDate}
        repeatType="Daily"
      />
    );

    // Simulate a hover and selection event
    const days = screen.getAllByRole('gridcell'); // All days in the calendar
    expect(days.length).toBeGreaterThan(0);

    // Assert that the component initializes with selected days based on the startDate and endDate
    const selectedDays = screen.getAllByRole('gridcell', { ariaSelected: true });
    expect(selectedDays.length).toBeGreaterThan(0);
  });

  it('should update the selected days when the repeatType is changed to "Custom" with Days interval', () => {
    render(
      <MultiDatePicker
        startDate={startDate}
        endDate={endDate}
        repeatType="Custom"
      />
    );

    // Simulate the Custom option selection and set the counter to 2 (select every 2nd day)
    const input = screen.getByRole('spinbutton'); // Input for setting counter
    fireEvent.change(input, { target: { value: '2' } });

    const customSelect = screen.getByRole('combobox'); // Dropdown for selecting Days, Weeks, etc.
    fireEvent.change(customSelect, { target: { value: 'Days' } });

    const days = screen.getAllByRole('gridcell'); // All days in the calendar
    expect(days.length).toBeGreaterThan(0);

    const selectedDays = screen.getAllByRole('gridcell', { ariaSelected: true });
    expect(selectedDays.length).toBeGreaterThan(0);
  });

  it('should toggle recurring dates when a day is clicked', () => {
    render(
      <MultiDatePicker
        startDate={startDate}
        endDate={endDate}
        repeatType="Monthly"
      />
    );

    // Simulate clicking on a day
    const dayCell = screen.getAllByRole('gridcell')[0]; // Get the first day cell
    fireEvent.click(dayCell);

    const styles = getComputedStyle(dayCell);

    // After the click, assert that the day is selected (has been added to selectedDays)
    expect(styles.backgroundColor).toBe('rgb(21, 101, 192)')
  });
});
