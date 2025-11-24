import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { RESTAURANT_SERVICE_NAME } from './restaurant.module';

// GraphQL Object Types
import { ObjectType, Field, Int, Float, InputType } from '@nestjs/graphql';

@ObjectType()
class MenuItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;
}

@ObjectType()
class OrderItem {
  @Field()
  menuItemId: string;

  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@ObjectType()
class Order {
  @Field()
  id: string;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Float)
  total: number;

  @Field()
  status: string;

  @Field(() => Int)
  createdAt: number;
}

@ObjectType()
class CreateMenuResponse {
  @Field()
  id: string;

  @Field(() => MenuItem)
  item: MenuItem;
}

@ObjectType()
class CreateOrderResponse {
  @Field()
  id: string;

  @Field(() => Order)
  order: Order;
}

@ObjectType()
class OperationResponse {
  @Field()
  ok: boolean;
}

@InputType()
class CreateOrderItemInput {
  @Field()
  menuItemId: string;

  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

// gRPC Service Interfaces
interface MenuServiceInterface {
  createMenuItem(data: { item: MenuItem }): Observable<{ id: string; item: MenuItem }>;
  listMenu(data: {}): Observable<{ items: MenuItem[] }>;
  updateMenuItem(data: { id: string; item: MenuItem }): Observable<{ ok: boolean }>;
  deleteMenuItem(data: { id: string }): Observable<{ ok: boolean }>;
}

interface OrderServiceInterface {
  createOrder(data: { items: any[] }): Observable<{ id: string; order: any }>;
  listOrders(data: {}): Observable<{ orders: any[] }>;
  updateOrder(data: { id: string; status: string }): Observable<{ ok: boolean }>;
  deleteOrder(data: { id: string }): Observable<{ ok: boolean }>;
}

@Resolver()
export class RestaurantResolver implements OnModuleInit {
  private menuService: MenuServiceInterface;
  private orderService: OrderServiceInterface;

  constructor(@Inject(RESTAURANT_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.menuService = this.client.getService<MenuServiceInterface>('MenuService');
    this.orderService = this.client.getService<OrderServiceInterface>('OrderService');
  }

  // ===== Menu Queries =====
  @Query(() => [MenuItem], { name: 'menu' })
  async getMenu(): Promise<MenuItem[]> {
    const response = await firstValueFrom(this.menuService.listMenu({}));
    return response.items;
  }

  // ===== Menu Mutations =====
  @Mutation(() => CreateMenuResponse)
  async createMenuItem(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('price', { type: () => Float }) price: number,
    @Args('category') category: string,
  ): Promise<CreateMenuResponse> {
    const item: MenuItem = { id: '', name, description, price, category };
    return firstValueFrom(this.menuService.createMenuItem({ item }));
  }

  @Mutation(() => OperationResponse)
  async updateMenuItem(
    @Args('id') id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('description', { nullable: true }) description?: string,
    @Args('price', { type: () => Float, nullable: true }) price?: number,
    @Args('category', { nullable: true }) category?: string,
  ): Promise<OperationResponse> {
    const item: MenuItem = {
      id: '',
      name: name || '',
      description: description || '',
      price: price || 0,
      category: category || '',
    };
    return firstValueFrom(this.menuService.updateMenuItem({ id, item }));
  }

  @Mutation(() => OperationResponse)
  async deleteMenuItem(@Args('id') id: string): Promise<OperationResponse> {
    return firstValueFrom(this.menuService.deleteMenuItem({ id }));
  }

  // ===== Order Queries =====
  @Query(() => [Order], { name: 'orders' })
  async getOrders(): Promise<Order[]> {
    const response = await firstValueFrom(this.orderService.listOrders({}));
    return response.orders.map((order: any) => ({
      id: order.id,
      items: order.items.map((item: any) => ({
        menuItemId: item.menu_item_id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
    }));
  }

  // ===== Order Mutations =====
  @Mutation(() => CreateOrderResponse)
  async createOrder(
    @Args('items', { type: () => [CreateOrderItemInput] }) items: CreateOrderItemInput[],
  ): Promise<CreateOrderResponse> {
    const orderItems: any[] = items.map((item) => ({
      menu_item_id: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const response = await firstValueFrom(this.orderService.createOrder({ items: orderItems }));
    return {
      id: response.id,
      order: {
        id: response.order.id,
        items: response.order.items.map((item: any) => ({
          menuItemId: item.menu_item_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: response.order.total,
        status: response.order.status,
        createdAt: response.order.created_at,
      },
    };
  }

  @Mutation(() => OperationResponse)
  async updateOrderStatus(
    @Args('id') id: string,
    @Args('status') status: string,
  ): Promise<OperationResponse> {
    return firstValueFrom(this.orderService.updateOrder({ id, status }));
  }

  @Mutation(() => OperationResponse)
  async deleteOrder(@Args('id') id: string): Promise<OperationResponse> {
    return firstValueFrom(this.orderService.deleteOrder({ id }));
  }
}