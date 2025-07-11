import { generateVoterId, getClientIp, calculatePercentage } from '@/lib/utils';

describe('Utils', () => {
  describe('generateVoterId', () => {
    it('generates consistent hash for same input', () => {
      const ip = '192.168.1.1';
      const userAgent = 'Mozilla/5.0';
      
      const id1 = generateVoterId(ip, userAgent);
      const id2 = generateVoterId(ip, userAgent);
      
      expect(id1).toBe(id2);
      expect(id1).toHaveLength(64); // SHA-256 produces 64 character hex string
    });

    it('generates different hash for different input', () => {
      const id1 = generateVoterId('192.168.1.1', 'Mozilla/5.0');
      const id2 = generateVoterId('192.168.1.2', 'Mozilla/5.0');
      
      expect(id1).not.toBe(id2);
    });
  });

  describe('getClientIp', () => {
    it('returns IP from x-forwarded-for header', () => {
      const mockRequest = {
        headers: {
          get: (key: string) => {
            if (key === 'x-forwarded-for') return '192.168.1.1, 10.0.0.1'
            return null
          }
        }
      } as Request
      
      expect(getClientIp(mockRequest)).toBe('192.168.1.1');
    });

    it('returns IP from x-real-ip header', () => {
      const mockRequest = {
        headers: {
          get: (key: string) => {
            if (key === 'x-real-ip') return '192.168.1.2'
            return null
          }
        }
      } as Request
      
      expect(getClientIp(mockRequest)).toBe('192.168.1.2');
    });

    it('returns default IP when no headers', () => {
      const mockRequest = {
        headers: {
          get: () => null
        }
      } as Request
      
      expect(getClientIp(mockRequest)).toBe('127.0.0.1');
    });
  });

  describe('calculatePercentage', () => {
    it('calculates percentage correctly', () => {
      expect(calculatePercentage(10, 50)).toBe(20);
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(33, 100)).toBe(33);
    });

    it('returns 0 when total is 0', () => {
      expect(calculatePercentage(10, 0)).toBe(0);
    });

    it('rounds to nearest integer', () => {
      expect(calculatePercentage(1, 3)).toBe(33);
      expect(calculatePercentage(2, 3)).toBe(67);
    });
  });
});