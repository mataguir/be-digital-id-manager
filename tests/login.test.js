const request = require('supertest');
const app = require('../index');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('User Login', () => {
  beforeEach(async () => {
    // Limpiar la base de datos antes de cada prueba
    await User.deleteMany({});
    // Crear un usuario para las pruebas de inicio de sesión
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({ name: 'John Doe', email: 'john.doe@example.com', password: hashedPassword });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return invalid credentials with wrong password', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });
});
