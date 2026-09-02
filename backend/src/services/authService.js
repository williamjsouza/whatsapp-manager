const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

class AuthService {
  async authenticate(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw { statusCode: 401, code: 'AUTH_FAILED', message: 'E-mail ou senha incorretos.' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw { statusCode: 401, code: 'AUTH_FAILED', message: 'E-mail ou senha incorretos.' };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password_hash from user object before returning
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  async getUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw { statusCode: 404, code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' };
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new AuthService();
