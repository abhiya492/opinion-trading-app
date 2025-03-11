import { validateEmail, getTimeRemaining } from '../helpers';

describe('Helpers', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+tag@domain.co.uk',
        'user123@subdomain.domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should reject incorrect email formats', () => {
      const invalidEmails = [
        'test@',
        '@domain.com',
        'test@domain',
        'test.domain.com',
        'test@domain.',
        'test@.com',
        '',
        null,
        undefined
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('getTimeRemaining', () => {
    beforeEach(() => {
      // Mock current date to a fixed value
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-03-15T10:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should calculate time remaining correctly', () => {
      const endDate = new Date('2024-03-15T11:30:00Z'); // 1.5 hours from now
      const remaining = getTimeRemaining(endDate);

      expect(remaining).toEqual({
        days: 0,
        hours: 1,
        minutes: 30,
        seconds: 0,
        total: 5400000 // 1.5 hours in milliseconds
      });
    });

    it('should handle past dates', () => {
      const pastDate = new Date('2024-03-15T09:00:00Z'); // 1 hour ago
      const remaining = getTimeRemaining(pastDate);

      expect(remaining).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      });
    });

    it('should calculate multiple days correctly', () => {
      const futureDate = new Date('2024-03-18T10:00:00Z'); // 3 days from now
      const remaining = getTimeRemaining(futureDate);

      expect(remaining).toEqual({
        days: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 259200000 // 3 days in milliseconds
      });
    });

    it('should handle null or invalid dates', () => {
      expect(getTimeRemaining(null)).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      });

      expect(getTimeRemaining('invalid-date')).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
      });
    });

    it('should handle exact time boundaries', () => {
      // Test exactly 1 day remaining
      const oneDayLater = new Date('2024-03-16T10:00:00Z');
      const remaining = getTimeRemaining(oneDayLater);

      expect(remaining).toEqual({
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 86400000 // 1 day in milliseconds
      });
    });
  });
}); 