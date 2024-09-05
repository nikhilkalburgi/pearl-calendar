// Home.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For custom matchers like toBeInTheDocument
import App from '@/app/page'; // Assuming Home.js is in the same directory

// Mock styles as Next.js uses CSS Modules
jest.mock('@/app/page.module.css', () => ({
    dropdownContainer: 'dropdown-container',
    dropdown: 'dropdown',
    option: 'option',
    main: 'main',
    container: 'container'
}));

describe('App Component Integration Test', () => {
  it('renders the Calendar component after selecting repeat type and dates', () => {
    render(<App />);

    // Simulate selecting the "Monthly" repeat type
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Monthly' } });

    // Simulate selecting dates using the DatePickers
    const dateInputElements = screen.getAllByRole('textbox'); // Find all date inputs
    fireEvent.change(dateInputElements[0], { target: { value: '09/05/2024' } }); // Start Date
    fireEvent.change(dateInputElements[1], { target: { value: '09/06/2024' } }); // End Date

    // Assert that Calendar is properly rendered after the date selection
    const startDateElement = screen.getByDisplayValue('09/05/2024');
    const endDateElement = screen.getByDisplayValue('09/06/2024');
    expect(startDateElement).toBeInTheDocument();
    expect(endDateElement).toBeInTheDocument();

    const dayCell = screen.getAllByRole('gridcell')[4]; // Get the first day cell
    
    const stylesBefore = getComputedStyle(dayCell);

    // Before the click, assert that the day is not selected 
    expect(stylesBefore.backgroundColor).not.toBe('rgb(21, 101, 192)')

    // Simulate clicking on a day
    fireEvent.click(dayCell);

    const stylesAfter = getComputedStyle(dayCell);

    // After the click, assert that the day is selected
    expect(stylesAfter.backgroundColor).toBe('rgb(21, 101, 192)')
  });
});
