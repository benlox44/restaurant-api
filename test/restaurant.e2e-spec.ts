import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Restaurant API E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Menu Operations', () => {
    let menuItemId: string;

    it('should create a menu item', () => {
      const query = `
        mutation {
          createMenuItem(
            name: "Pasta Carbonara"
            description: "Delicious Italian pasta with eggs and bacon"
            price: 12.99
            category: "Pasta"
          ) {
            id
            item {
              id
              name
              description
              price
              category
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createMenuItem).toBeDefined();
          expect(res.body.data.createMenuItem.item.name).toBe('Pasta Carbonara');
          menuItemId = res.body.data.createMenuItem.id;
        });
    });

    it('should get all menu items', () => {
      const query = `
        query {
          menu {
            id
            name
            description
            price
            category
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.menu).toBeDefined();
          expect(Array.isArray(res.body.data.menu)).toBe(true);
        });
    });

    it('should update a menu item', () => {
      const query = `
        mutation {
          updateMenuItem(
            id: "${menuItemId}"
            name: "Updated Pasta"
            price: 14.99
          ) {
            ok
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateMenuItem.ok).toBe(true);
        });
    });

    it('should delete a menu item', () => {
      const query = `
        mutation {
          deleteMenuItem(id: "${menuItemId}") {
            ok
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteMenuItem.ok).toBe(true);
        });
    });
  });

  describe('Order Operations', () => {
    let orderId: string;

    it('should create an order', () => {
      const query = `
        mutation {
          createOrder(items: [
            {
              menuItemId: "507f1f77bcf86cd799439011"
              name: "Pasta Carbonara"
              quantity: 2
              price: 12.99
            }
          ]) {
            id
            order {
              id
              total
              status
              items {
                menuItemId
                name
                quantity
                price
              }
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createOrder).toBeDefined();
          expect(res.body.data.createOrder.order.items).toHaveLength(1);
          orderId = res.body.data.createOrder.id;
        });
    });

    it('should get all orders', () => {
      const query = `
        query {
          orders {
            id
            total
            status
            items {
              menuItemId
              name
              quantity
              price
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.orders).toBeDefined();
          expect(Array.isArray(res.body.data.orders)).toBe(true);
        });
    });

    it('should update order status', () => {
      const query = `
        mutation {
          updateOrderStatus(
            id: "${orderId}"
            status: "preparing"
          ) {
            ok
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.updateOrderStatus.ok).toBe(true);
        });
    });

    it('should delete an order', () => {
      const query = `
        mutation {
          deleteOrder(id: "${orderId}") {
            ok
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.deleteOrder.ok).toBe(true);
        });
    });
  });
});
