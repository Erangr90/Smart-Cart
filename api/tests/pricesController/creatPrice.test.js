import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../../server.js'; // Ensure your Express app exports using ES6 syntax
import Price from '../../models/priceModel.js';
import User from '../../models/userModel.js';
import Store from '../../models/priceModel.js';
import Chain from '../../models/chainModel.js';


describe('Price Creation', () => {
  let token = null
  let mongoServer;

    beforeAll(async () => {

      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const registerUser =  async ()=> {

        const user = await User.create({
          firstName:"testUser",
          lastName:"testUser",
          email:"testEmail2",
          password:"123456789",
          isSubtribe:true,
          isAdmin:true
        });

        const response = await request(app)
        .post('/users')
        .send(userData);
        expect(response.status).toBe(201);

        return response;

      }

      const res = await registerUser()
      token = res.headers['accessToken']
      
    });
  
    afterEach(async () => {
      // Clean up the database after each test
      await Price.deleteMany({});
      await Store.deleteMany({});
      await Chain.deleteMany({});
      await User.deleteMany({});
    });
  
    afterAll(async () => {

      await mongoose.disconnect();
      await mongoServer.stop();
      
    });
  
    it('should create a new price and associate with a store', async () => {
      
      const store = await Store.create({ name:"testStore1", businessNumber:"12345678", address:{city:"testCity", street:"testStreet", postalCode:"123frfs55"}, email:"testEmali@mail.com", phone:"08-7678963", location:"שדרות ירושלים 14"  });
      
  
      const response = await request(app)
        .post('/prices')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: '123456gggh',
          storeId: store._id,
          chainId: '',
          number: '66',
        });
  
      expect(response.status).toBe(201);
      const createdPrice = response.body;
      expect(createdPrice.store.toString()).toEqual(store._id.toString());
  
      const updatedStore = await Store.findById(store._id);
      expect(updatedStore.prices).toContainEqual(createdPrice._id);
    });
  
    // You can add more tests, for example to test the chain logic...
  });