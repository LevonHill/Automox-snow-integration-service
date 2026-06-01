// Mock axios before any other imports
jest.mock('axios');

const request = require('supertest');
const axios = require('axios');

// Set environment variables before requiring app
process.env.SNOW_URL = 'https://dev12345.service-now.com';
process.env.SNOW_USER = 'testuser';
process.env.SNOW_PASSWORD = 'testpass';
process.env.AUTOMOX_URL = 'https://api.automox.com';
process.env.AUTOMOX_API_KEY = 'test-key';

// Mock other services
jest.mock('../services/automoxService');
jest.mock('../services/transformService');

const app = require('../app');
const automoxService = require('../services/automoxService');
const transformService = require('../services/transformService');

describe('Sync Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set default mock implementations
    automoxService.getAssets = jest.fn().mockResolvedValue([]);
    transformService.mapAutomoxAssets = jest.fn().mockReturnValue([]);
    axios.post = jest.fn().mockResolvedValue({ data: { result: {} } });
  });

  describe('POST /sync/automox-assets', () => {
    it('should sync assets and return count', async () => {
      const mockAutomoxAssets = [
        { id: '1', name: 'Server1', type: 'server' },
        { id: '2', name: 'Server2', type: 'server' }
      ];

      const mockTransformedAssets = [
        { u_asset_id: '1', u_asset_name: 'Server1' },
        { u_asset_id: '2', u_asset_name: 'Server2' }
      ];

      automoxService.getAssets.mockResolvedValue(mockAutomoxAssets);
      transformService.mapAutomoxAssets.mockReturnValue(mockTransformedAssets);

      const response = await request(app)
        .post('/sync/automox-assets')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        count: 2
      });

      expect(automoxService.getAssets).toHaveBeenCalled();
      expect(transformService.mapAutomoxAssets).toHaveBeenCalledWith(
        mockAutomoxAssets
      );
      expect(axios.post).toHaveBeenCalledWith(
        'https://dev12345.service-now.com/api/now/import/u_automox_assets',
        mockTransformedAssets[0],
        expect.objectContaining({ auth: expect.any(Object) })
      );
    });

    it('should return success with zero count for empty assets', async () => {
      automoxService.getAssets.mockResolvedValue([]);
      transformService.mapAutomoxAssets.mockReturnValue([]);

      const response = await request(app)
        .post('/sync/automox-assets')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        count: 0
      });
    });

    it('should return error if Automox service fails', async () => {
      const error = new Error('Automox API unreachable');
      automoxService.getAssets.mockRejectedValue(error);

      const response = await request(app)
        .post('/sync/automox-assets')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Automox API unreachable'
      });

      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should return error if ServiceNow import fails', async () => {
      const mockAutomoxAssets = [{ id: '1', name: 'Server1' }];
      const mockTransformedAssets = [{ u_asset_id: '1' }];
      const error = new Error('ServiceNow authentication failed');

      automoxService.getAssets.mockResolvedValue(mockAutomoxAssets);
      transformService.mapAutomoxAssets.mockReturnValue(mockTransformedAssets);
      axios.post.mockRejectedValue(error);

      const response = await request(app)
        .post('/sync/automox-assets')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'ServiceNow authentication failed'
      });
    });

    it('should return error if transformation fails', async () => {
      const mockAutomoxAssets = [{ id: '1', name: 'Server1' }];
      const error = new Error('Invalid asset format');

      automoxService.getAssets.mockResolvedValue(mockAutomoxAssets);
      transformService.mapAutomoxAssets.mockImplementation(() => {
        throw error;
      });

      const response = await request(app)
        .post('/sync/automox-assets')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        message: 'Invalid asset format'
      });

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  describe('GET /sync/health', () => {
    it('should return ok status', async () => {
      const response = await request(app)
        .get('/sync/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
