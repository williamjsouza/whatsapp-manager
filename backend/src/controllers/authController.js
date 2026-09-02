const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_REQUEST', message: 'E-mail e senha são obrigatórios.' }
        });
      }

      const data = await authService.authenticate(email, password);

      return res.json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      // In a stateless JWT auth, logout is typically handled client-side by dropping the token.
      // But we provide the endpoint to follow the spec.
      return res.json({
        success: true,
        data: { message: 'Logout realizado com sucesso.' }
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const userId = req.userId;
      const user = await authService.getUser(userId);

      return res.json({
        success: true,
        data: { user }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
