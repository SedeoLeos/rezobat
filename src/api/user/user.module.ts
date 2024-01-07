import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AccountController } from './acount.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, ,]),
  ],
  controllers: [UserController, AccountController],
  providers: [UserService, AccountService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
