// DateComponent.test.js
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides extra matchers like 'toBeInTheDocument'
import DateComponent from '@/app/components/datepicker';
import dayjs from 'dayjs';

describe('DateComponent', () => {
  it('renders the date picker component', () => {
    const mockSetDate = jest.fn();
    const date = dayjs('2024-09-05'); // Initial date for the DatePicker

    // Render the DateComponent
    render(<DateComponent date={date} setDate={mockSetDate} />);

    // Find the input field for the date picker
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();

    // Simulate changing the date
    fireEvent.change(inputElement, { target: { value: '09/10/2024' } });

    // Assert the setDate function was called
    expect(mockSetDate).toHaveBeenCalled();
  });
});
