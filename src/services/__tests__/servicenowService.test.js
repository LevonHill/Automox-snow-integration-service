const axios = require('axios');
const servicenowService = require('../servicenowService');

jest.mock('axios');

describe('ServiceNow Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SNOW_URL = 'https://dev12345.service-now.com';
    process.env.SNOW_USER = 'testuser';
    process.env.SNOW_PASSWORD = 'testpass';
  });

  describe('importAssets', () => {
    it('should POST assets to ServiceNow API endpoint', async () => {
      const mockAssets = [
        { name: 'Server1', id: '123' },
        { name: 'Server2', id: '456' }
      ];

      axios.post.mockResolvedValue({ data: { result: {} } });

      await servicenowService.importAssets(mockAssets);

      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(axios.post).toHaveBeenCalledWith(
        'https://dev12345.service-now.com/api/now/import/u_automox_assets',
        mockAssets[0],
        {
          auth: {
            username: 'testuser',
            password: 'testpass'
          }
        }
      );
      expect(axios.post).toHaveBeenCalledWith(
        'https://dev12345.service-now.com/api/now/import/u_automox_assets',
        mockAssets[1],
        {
          auth: {
            username: 'testuser',
            password: 'testpass'
          }
        }
      );
    });

    it('should handle empty assets array', async () => {
      await servicenowService.importAssets([]);

      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should throw error if ServiceNow request fails', async () => {
      const mockAssets = [{ name: 'Server1', id: '123' }];
      const error = new Error('ServiceNow API Error');

      axios.post.mockRejectedValue(error);

      await expect(servicenowService.importAssets(mockAssets)).rejects.toThrow(
        'ServiceNow API Error'
      );
    });

    it('should use basic auth with credentials', async () => {
      const mockAssets = [{ name: 'Server1', id: '123' }];

      axios.post.mockResolvedValue({ data: { result: {} } });

      await servicenowService.importAssets(mockAssets);

      const callArgs = axios.post.mock.calls[0];
      expect(callArgs[2].auth).toEqual({
        username: 'testuser',
        password: 'testpass'
      });
    });
  });
});
