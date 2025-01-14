import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import app from '../../src/index'; // Import your actual Hono app

// Mock PrismaClient and its extensions
const mockPrismaClient = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn()
  },
  $extends: vi.fn().mockReturnThis()
};

// Mock the PrismaClient constructor
vi.mock('@prisma/client/edge', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient)
}));

describe('Login Route Tests', () => {

  beforeEach(() => {
    
    // Clear all mocks before each test
    vi.clearAllMocks();
    app.fetch = app.fetch.bind({ env:  {
      DATABASE_URL: 'mock-database-url', 
    } });
    vi.stubEnv('DATABASE_URL', 'mock-database-url')
    
  });


  it('should create a new user when email does not exist', async () => {
    const testUser = {
      id: '123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      username: 'test@example.com'
    };

    const mockContext = {
      env:  {
        DATABASE_URL: 'mock-database-url', 
      }, // Inject mocked DATABASE_URL
    };
  
    mockPrismaClient.user.findUnique.mockResolvedValue(null);
    mockPrismaClient.user.create.mockResolvedValue(testUser);
  
    const res = await app.request('/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    }, mockContext);
  
    const data = await res.json();
    console.log('Response:', { status: res.status, data }); // Log the response for debugging
  
    expect(res.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: "New user created Successfully",
      createdUser: testUser,
    });
  
    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaClient.user.create).toHaveBeenCalledTimes(1);
  });
  

  it('should return existing user when email exists', async () => {
    const existingUser = {
        id: '123',
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123',
        username: 'existing@example.com',
    };

    const mockContext = {
      env:  {
        DATABASE_URL: 'mock-database-url', 
      }, // Inject mocked DATABASE_URL
    };
    mockPrismaClient.user.findUnique.mockResolvedValue(existingUser);

    const res = await app.request('/api/v1/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: existingUser.email }),
    }, mockContext);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({
        success: true,
        message: "New user created Successfully", // Match the corrected message
        user: existingUser,
    });

    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrismaClient.user.create).not.toHaveBeenCalled();
  });



});