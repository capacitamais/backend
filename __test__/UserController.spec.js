const UserController = require('../controllers/userController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const httpMocks = require('node-mocks-http');

jest.mock('../models/User');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // getAllUsers
  describe('getAllUsers', () => {
    it('deve retornar todos os usuários sem senha', async () => {
      const mockUsers = [
        { name: 'João', registration: '123', role: 'aluno' },
        { name: 'Maria', registration: '456', role: 'professor' },
      ];

      User.find.mockResolvedValue(mockUsers);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await UserController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalledWith({}, '-password');
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockUsers);
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      User.find.mockRejectedValue(new Error('DB error'));

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await UserController.getAllUsers(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: 'Erro interno do servidor.' });
    });
  });

  // checkRegistration
  describe('checkRegistration', () => {
    it('deve retornar usuário se matrícula existir', async () => {
      const mockUser = { name: 'João' };
      User.findOne.mockResolvedValue(mockUser);

      const result = await UserController.checkRegistration('123');
      expect(User.findOne).toHaveBeenCalledWith({ registration: '123' });
      expect(result).toEqual('João');
    });

    it('deve retornar null se matrícula não existir', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await UserController.checkRegistration('999');
      expect(User.findOne).toHaveBeenCalledWith({ registration: '999' });
      expect(result).toBe(null);
    });
  });

  // checkPassword
  describe('checkPassword', () => {
    it('deve retornar true se senha for válida', async () => {
      const plainPassword = 'senha123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const result = await UserController.checkPassword(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('deve retornar false se senha for inválida', async () => {
      const plainPassword = 'senhaErrada';
      const hashedPassword = await bcrypt.hash('senhaCorreta', 10);

      const result = await UserController.checkPassword(plainPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });
});
