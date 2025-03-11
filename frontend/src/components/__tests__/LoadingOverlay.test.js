import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingOverlay from '../LoadingOverlay';

jest.useFakeTimers();

describe('LoadingOverlay', () => {
  beforeEach(() => {
    // Reset all timers before each test
    jest.clearAllTimers();
    
    // Reset body overflow style
    document.body.style.overflow = '';
  });

  it('should not render when isLoading is false', () => {
    render(<LoadingOverlay isLoading={false} />);
    const overlay = screen.queryByTestId('loading-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  it('should render when isLoading is true', () => {
    render(<LoadingOverlay isLoading={true} />);
    const overlay = screen.getByTestId('loading-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveClass('opacity-50');
  });

  it('should set body overflow to hidden when mounted', () => {
    render(<LoadingOverlay isLoading={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow when unmounted', () => {
    const { unmount } = render(<LoadingOverlay isLoading={true} />);
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('should not unmount immediately when isLoading changes to false', () => {
    const { rerender } = render(<LoadingOverlay isLoading={true} />);
    
    // Change to not loading
    rerender(<LoadingOverlay isLoading={false} />);
    
    // Should still be in document due to unmount delay
    const overlay = screen.queryByTestId('loading-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('should unmount after delay when isLoading changes to false', () => {
    const { rerender } = render(<LoadingOverlay isLoading={true} />);
    
    // Change to not loading
    rerender(<LoadingOverlay isLoading={false} />);
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(300); // Matches the unmount delay in the component
    });
    
    // Should be removed from document after delay
    const overlay = screen.queryByTestId('loading-overlay');
    expect(overlay).not.toBeInTheDocument();
  });

  it('should show spinner when loading', () => {
    render(<LoadingOverlay isLoading={true} />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should apply correct styles when loading', () => {
    render(<LoadingOverlay isLoading={true} />);
    const overlay = screen.getByTestId('loading-overlay');
    
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
    expect(overlay).toHaveClass('bg-black');
    expect(overlay).toHaveClass('opacity-50');
    expect(overlay).toHaveClass('z-50');
  });
}); 