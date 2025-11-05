import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Inject, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';

// GraphQL Object Types
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  isLocked: boolean;

  @Field()
  isEmailConfirmed: boolean;

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  oldEmail?: string;

  @Field({ nullable: true })
  newEmail?: string;

  @Field({ nullable: true })
  emailChangedAt?: string;
}

@ObjectType()
class AuthResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
class MessageResponse {
  @Field()
  message: string;
}

@ObjectType()
class RevertEmailResponse {
  @Field()
  resetToken: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User)
  user: User;
}

// gRPC Service Interfaces
interface AuthService {
  register(data: { email: string; password: string; name: string }): Observable<{ message: string }>;
  login(data: { email: string; password: string }): Observable<{ accessToken: string }>;
  requestPasswordReset(data: { email: string }): Observable<{ message: string }>;
  resetPassword(data: { token: string; newPassword: string }): Observable<{ message: string }>;
  resetPasswordAfterRevert(data: { token: string; newPassword: string }): Observable<{ message: string }>;
  requestUnlock(data: { email: string }): Observable<{ message: string }>;
  confirmEmail(data: { token: string }): Observable<{ message: string }>;
  confirmEmailUpdate(data: { token: string }): Observable<{ message: string }>;
  revertEmail(data: { token: string }): Observable<{ resetToken: string }>;
  unlockAccount(data: { token: string }): Observable<{ message: string }>;
}

interface UsersService {
  getMyProfile(data: {}): Observable<UserResponse>;
  updateProfile(data: { name: string }): Observable<{ message: string }>;
  updatePassword(data: { currentPassword: string; newPassword: string }): Observable<{ message: string }>;
  requestEmailUpdate(data: { password: string; newEmail: string }): Observable<{ message: string }>;
  deleteAccount(data: { password: string }): Observable<{ message: string }>;
}

@Resolver()
export class AuthResolver implements OnModuleInit {
  private authService: AuthService;
  private usersService: UsersService;

  constructor(@Inject('AUTH_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
    this.usersService = this.client.getService<UsersService>('UsersService');
  }

  // Queries
  @Query(() => User, { name: 'myProfile' })
  async myProfile(): Promise<User> {
    const response = await firstValueFrom(this.usersService.getMyProfile({}));
    return response.user;
  }

  // Authentication Mutations
  @Mutation(() => MessageResponse)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
  ): Promise<MessageResponse> {
    return firstValueFrom(this.authService.register({ email, password, name }));
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthResponse> {
    return firstValueFrom(this.authService.login({ email, password }));
  }

  @Mutation(() => MessageResponse)
  async requestPasswordReset(@Args('email') email: string): Promise<MessageResponse> {
    return firstValueFrom(this.authService.requestPasswordReset({ email }));
  }

  @Mutation(() => MessageResponse)
  async resetPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<MessageResponse> {
    return firstValueFrom(this.authService.resetPassword({ token, newPassword }));
  }

  @Mutation(() => MessageResponse)
  async resetPasswordAfterRevert(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<MessageResponse> {
    return firstValueFrom(this.authService.resetPasswordAfterRevert({ token, newPassword }));
  }

  @Mutation(() => MessageResponse)
  async updatePassword(
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<MessageResponse> {
    return firstValueFrom(this.usersService.updatePassword({ currentPassword, newPassword }));
  }

  // Account Management Mutations
  @Mutation(() => MessageResponse)
  async requestUnlock(@Args('email') email: string): Promise<MessageResponse> {
    return firstValueFrom(this.authService.requestUnlock({ email }));
  }

  @Mutation(() => MessageResponse)
  async confirmEmail(@Args('token') token: string): Promise<MessageResponse> {
    return firstValueFrom(this.authService.confirmEmail({ token }));
  }

  @Mutation(() => MessageResponse)
  async confirmEmailUpdate(@Args('token') token: string): Promise<MessageResponse> {
    return firstValueFrom(this.authService.confirmEmailUpdate({ token }));
  }

  @Mutation(() => RevertEmailResponse)
  async revertEmail(@Args('token') token: string): Promise<RevertEmailResponse> {
    return firstValueFrom(this.authService.revertEmail({ token }));
  }

  @Mutation(() => MessageResponse)
  async unlockAccount(@Args('token') token: string): Promise<MessageResponse> {
    return firstValueFrom(this.authService.unlockAccount({ token }));
  }

  // Profile Management Mutations
  @Mutation(() => MessageResponse)
  async updateProfile(@Args('name') name: string): Promise<MessageResponse> {
    return firstValueFrom(this.usersService.updateProfile({ name }));
  }

  @Mutation(() => MessageResponse)
  async requestEmailUpdate(
    @Args('password') password: string,
    @Args('newEmail') newEmail: string,
  ): Promise<MessageResponse> {
    return firstValueFrom(this.usersService.requestEmailUpdate({ password, newEmail }));
  }

  @Mutation(() => MessageResponse)
  async deleteAccount(@Args('password') password: string): Promise<MessageResponse> {
    return firstValueFrom(this.usersService.deleteAccount({ password }));
  }
}
