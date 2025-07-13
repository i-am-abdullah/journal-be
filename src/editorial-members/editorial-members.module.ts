import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EditorialMember } from './entities/editorial-member.entity';
import { EditorialMembersService } from './editorial-members.service';
import { EditorialMembersController } from './editorial-members.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EditorialMember]),
    UsersModule,
    JwtModule
  ],
  providers: [EditorialMembersService],
  controllers: [EditorialMembersController],
  exports: [EditorialMembersService],
})
export class EditorialMembersModule {}