const request = require('supertest');
const app = require('../index');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Get User Profile', () => {
  let token;

  beforeEach(async () => {
    // Limpiar la base de datos antes de cada prueba
    await User.deleteMany({});
    // Crear un usuario para las pruebas
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({ name: 'John Doe', email: 'john.doe@example.com', password: hashedPassword });
    
    // Generar un token JWT para las pruebas
    token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  });

  it('should get user profile with valid token', async () => {
    const res = await request(app)
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'John Doe');
    expect(res.body).toHaveProperty('email', 'john.doe@example.com');
  });

  it('should return 401 for unauthorized requests', async () => {
    const res = await request(app)
      .get('/user/profile');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
  });
});
