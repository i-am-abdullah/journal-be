import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostFile } from './entities/post-file.entity';
import { PostContributor } from './entities/post-contributor.entity';
import { Contributor } from 'src/contributors/entities/contributor.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { ContributorsHelperService } from 'src/contributors/contributors.service';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/user.module';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostFile, PostContributor, Contributor, User, Category]),
JwtModule, UsersModule],
  controllers: [PostController],
  providers: [PostService, ContributorsHelperService],
  exports: [PostService],
})
export class PostModule {}
