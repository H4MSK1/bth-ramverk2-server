import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ReportsModule } from '../reports/reports.module';

const DatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'storage/database/db.sqlite',
  entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
  synchronize: true,
});

@Module({
  controllers: [AppController],
  providers: [],
  imports: [DatabaseModule, AuthModule, UsersModule, ReportsModule],
})
export class AppModule {}
