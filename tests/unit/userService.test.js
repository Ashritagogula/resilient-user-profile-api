const UserService = require('../../src/services/userService');
const UserRepository = require('../../src/repositories/impl/UserRepository');
const UnitOfWork = require('../../src/repositories/impl/UnitOfWork');
const axios = require('axios');
jest.mock('axios');
jest.mock('../../src/repositories/impl/UserRepository');
jest.mock('../../src/repositories/impl/UnitOfWork');

describe('UserService Unit Tests', () => {
  let userService;

  beforeEach(() => {
    UserRepository.mockClear();
    UnitOfWork.mockClear();
    userService = new UserService();
  });

  it('should create a user successfully', async () => {
    userService.userRepository.findByEmail.mockResolvedValue(null);
    userService.userRepository.create.mockResolvedValue({ id: '123', name: 'John', email: 'john@example.com' });

    const user = await userService.createUser({ name: 'John', email: 'john@example.com' });
    
    expect(user).toHaveProperty('id', '123');
    expect(userService.userRepository.create).toHaveBeenCalled();
  });

  it('should throw EMAIL_ALREADY_EXISTS if email is taken', async () => {
    userService.userRepository.findByEmail.mockResolvedValue({ _id: '456', email: 'taken@example.com' });

    await expect(userService.createUser({ name: 'Bob', email: 'taken@example.com' }))
      .rejects
      .toThrow('EMAIL_ALREADY_EXISTS');
  });

  it('should fallback enrichment gracefully on external error', async () => {
    userService.getUserById = jest.fn().mockResolvedValue({ _id: '123', name: 'Alice' });
    axios.get.mockRejectedValue(new Error('Network Error'));

    const result = await userService.getEnrichedUser('123');

    expect(result.enrichedDataStatus).toBe('unavailable');
    expect(result.enrichedData).toBeNull();
    // Opossum circuit breaker and exponential backoff retry will kick in and eventually fail
  }, 15000); // increase timeout as exponential backoff takes time
});
