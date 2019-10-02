import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';
import { TransformInterceptor } from './transform.interceptor';
import { ChatModule } from '../chat/chat.module';

const DatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'storage/database/db.sqlite',
  entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
  synchronize: true,
});

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  imports: [DatabaseModule, AuthModule, UsersModule, ReportsModule, ChatModule],
})
export class AppModule {}
