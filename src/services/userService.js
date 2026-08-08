const axios = require('axios');
const UserRepository = require("../repositories/impl/UserRepository");
const UnitOfWork = require("../repositories/impl/UnitOfWork");
const { retryWithExponentialBackoff } = require("../utils/retry");
const { createCircuitBreaker, CircuitBreakerOpenException } = require("../utils/circuitBreaker");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.enrichmentServiceUrl = process.env.ENRICHMENT_SERVICE_URL || 'http://enrichment-service:8081/enrich';
    
    // Create the circuit breaker wrapping the HTTP call logic
    this.enrichmentBreaker = createCircuitBreaker(async (userId) => {
      const response = await axios.get(`${this.enrichmentServiceUrl}?userId=${userId}`);
      return response.data;
    });
  }

  async createUser(data) {
    const uow = new UnitOfWork();
    await uow.startTransaction();

    try {
      // In a real transactional setup, we would pass uow.session to the repo
      const existingUser = await this.userRepository.findByEmail(data.email);

      if (existingUser) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }

      const user = await this.userRepository.create(data, uow.session);
      await uow.commit();
      return user;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  }

  async updateUser(id, data) {
    const uow = new UnitOfWork();
    await uow.startTransaction();
    try {
      const user = await this.userRepository.update(id, data, uow.session);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }
      
      await uow.commit();
      return user;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async deleteUser(id) {
    const uow = new UnitOfWork();
    await uow.startTransaction();
    try {
      const user = await this.userRepository.delete(id, uow.session);

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      await uow.commit();
      return true;
    } catch (error) {
      await uow.rollback();
      throw error;
    }
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async getEnrichedUser(id) {
    const user = await this.getUserById(id);
    const userObj = user.toObject ? user.toObject() : user;
    
    try {
      // Execute the retry backoff which wraps the circuit breaker call
      const enrichedData = await retryWithExponentialBackoff(async () => {
        return await this.enrichmentBreaker.fire(id);
      });
      
      return {
        ...userObj,
        enrichedDataStatus: "available",
        enrichedData
      };
    } catch (error) {
      // If circuit breaker is open, or all retries fail
      return {
        ...userObj,
        enrichedDataStatus: "unavailable",
        enrichedData: null
      };
    }
  }
}

module.exports = UserService;