import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostContributor } from './entities/post-contributor.entity';
import { PostContributorDto } from './dto/post-contributor.dto';

@Injectable()
export class PostContributorsService {
  constructor(@InjectRepository(PostContributor) private repo: Repository<PostContributor>) {}
  add(dto: PostContributorDto) { return this.repo.save(this.repo.create(dto)); }
}