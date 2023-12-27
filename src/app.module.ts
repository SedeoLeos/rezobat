import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { BenefitModule } from './api/benefit/benefit.module';
import { CathegorieModule } from './api/cathegorie/cathegorie.module';
import { MediaModule } from './api/media/media.module';
import { RequestForServiceModule } from './api/request_for_service/request_for_service.module';
import { RoleModule } from './api/role/role.module';
import { PermissionModule } from './api/permission/permission.module';

@Module({
  imports: [AuthModule, UserModule, BenefitModule, CathegorieModule, MediaModule, RequestForServiceModule, RoleModule, PermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
