import { describe, it, expect, beforeEach, vi } from 'vitest';
import app from '../../src/index'; 

// Mock PrismaClient and its extensions
const mockPrismaClient = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(), // Add update method mock
  },
  $extends: vi.fn().mockReturnThis(),
};

// Mock the PrismaClient constructor
vi.mock('@prisma/client/edge', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient),
}));

describe('Username Update Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    app.fetch = app.fetch.bind({
      env: {
        DATABASE_URL: 'mock-database-url',
      },
    });
    vi.stubEnv('DATABASE_URL', 'mock-database-url');
  });

  it('should update the username when valid data is provided', async () => {
    const testPayload = {
      username: 'newUsername',
      userId: '123',
    };

    const mockContext = {
      env: {
        DATABASE_URL: 'mock-database-url',
      },
      req: {
        json: async () => testPayload,
      },
    };

    // Mock PrismaClient behavior
    mockPrismaClient.user.update.mockResolvedValue({
      id: testPayload.userId,
      username: testPayload.username,
    });

    const res = await app.request('/api/v1/user/username', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    }, mockContext);

    const data = await res.json();
    console.log('Response:', { status: res.status, data });

    expect(res.status).toBe(200);
    expect(data).toEqual({
      message: 'username updated',
      updatedUsername: {
        id: testPayload.userId,
        username: testPayload.username,
      },
    });

    expect(mockPrismaClient.user.update).toHaveBeenCalledTimes(1);
    expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
      where: {
        id: testPayload.userId,
      },
      data: {
        username: testPayload.username,
      },
    });
  });

  
});
