import { formatDate, truncateString } from '../formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format date to readable string', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/March 15, 2024/);
    });

    it('should handle null date', () => {
      const formatted = formatDate(null);
      expect(formatted).toBe('');
    });

    it('should handle invalid date', () => {
      const formatted = formatDate('invalid-date');
      expect(formatted).toBe('');
    });

    it('should include time when showTime is true', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const formatted = formatDate(date, true);
      expect(formatted).toMatch(/10:30/);
    });
  });

  describe('truncateString', () => {
    it('should truncate string longer than maxLength', () => {
      const longString = 'This is a very long string that needs to be truncated';
      const truncated = truncateString(longString, 20);
      expect(truncated).toBe('This is a very long...');
      expect(truncated.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it('should not truncate string shorter than maxLength', () => {
      const shortString = 'Short string';
      const truncated = truncateString(shortString, 20);
      expect(truncated).toBe(shortString);
    });

    it('should handle empty string', () => {
      const truncated = truncateString('', 20);
      expect(truncated).toBe('');
    });

    it('should handle null input', () => {
      const truncated = truncateString(null, 20);
      expect(truncated).toBe('');
    });

    it('should handle undefined input', () => {
      const truncated = truncateString(undefined, 20);
      expect(truncated).toBe('');
    });

    it('should handle maxLength of 0', () => {
      const string = 'Test string';
      const truncated = truncateString(string, 0);
      expect(truncated).toBe('...');
    });

    it('should handle negative maxLength', () => {
      const string = 'Test string';
      const truncated = truncateString(string, -5);
      expect(truncated).toBe('...');
    });
  });
}); 