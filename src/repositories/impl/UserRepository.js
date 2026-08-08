const User = require("../../models/User");

class UserRepository {
  async create(data, session = null) {
    const user = new User(data);
    return await user.save({ session });
  }

  async findById(id, session = null) {
    return await User.findById(id).session(session);
  }

  async findByEmail(email, session = null) {
    return await User.findOne({ email }).session(session);
  }

  async findAll(session = null) {
    return await User.find().session(session);
  }

  async update(id, data, session = null) {
    return await User.findByIdAndUpdate(
      id,
      data,
      { new: true, session }
    );
  }

  async delete(id, session = null) {
    return await User.findByIdAndDelete(id, { session });
  }
}

module.exports = UserRepository;