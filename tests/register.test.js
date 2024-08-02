const request = require('supertest');
const app = require('../index'); // Asegúrate de exportar la instancia de tu aplicación Express en index.js
const User = require('../models/user');

describe('User Registration', () => {
  beforeEach(async () => {
    // Limpiar la base de datos antes de cada prueba
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/user/register')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');

    const user = await User.findOne({ email: 'john.doe@example.com' });
    expect(user).not.toBeNull();
    expect(user.name).toBe('John Doe');
  });
});
