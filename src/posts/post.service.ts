import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostFile } from './entities/post-file.entity';
import { PostContributor } from './entities/post-contributor.entity';
import { Contributor } from 'src/contributors/entities/contributor.entity';
import { ContributorsHelperService, CreateContributorInput } from 'src/contributors/contributors.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApprovePostDto } from './dto/approve-post.dto';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { VolumeService } from './volume.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly contributorsHelperService: ContributorsHelperService,
    private readonly volumeService: VolumeService,

    private readonly dataSource: DataSource,
  ) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        authorId,
        categoryId,
        files,
        contributors: contributorInputs,
        ...postData
      } = createPostDto;

      const author = await queryRunner.manager.findOne(User, { where: { id: authorId } });
      if (!author) throw new NotFoundException(`Author with id ${authorId} not found`);

      const category = await queryRunner.manager.findOne(Category, { where: { id: categoryId } });
      if (!category) throw new NotFoundException(`Category with id ${categoryId} not found`);

      // Create contributors first
      const createdContributors = contributorInputs && contributorInputs.length > 0
        ? await this.contributorsHelperService.createContributors(contributorInputs)
        : [];

      // Create post
      const post = queryRunner.manager.create(Post, {
        ...postData,
        author,
        category,
      });

      const savedPost = await queryRunner.manager.save(post);

      // Link contributors
      for (const [index, contributorInput] of (contributorInputs || []).entries()) {
        const contributorEntity = createdContributors[index];
        const pc = queryRunner.manager.create(PostContributor, {
          postId: savedPost.id,
          contributorId: contributorEntity.id,
          role: contributorInput.role,
        });
        await queryRunner.manager.save(pc);
      }

      // Link files
      if (files && files.length > 0) {
        const postFiles = files.map(url => queryRunner.manager.create(PostFile, { url, post: savedPost }));
        await queryRunner.manager.save(postFiles);
      }

      await queryRunner.commitTransaction();

      return savedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Post[],
    meta: {
      page: number,
      limit: number,
      totalItems: number,
      totalPages: number,
    }
  }> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.postRepository.findAndCount({
      relations: ['author', 'category', 'volume', 'contributors', 'contributors.contributor', 'files'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }


  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'category','volume', 'contributors','contributors.contributor', 'files'],
    });
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const post = await queryRunner.manager.findOne(Post, { where: { id } });
      if (!post) throw new NotFoundException(`Post with id ${id} not found`);

      if (updatePostDto.categoryId) {
        const category = await queryRunner.manager.findOne(Category, { where: { id: updatePostDto.categoryId } });
        if (!category) throw new NotFoundException(`Category with id ${updatePostDto.categoryId} not found`);
        post.category = category;
      }

      Object.assign(post, updatePostDto);

      await queryRunner.manager.save(post);

      if (updatePostDto.contributors) {
        await queryRunner.manager.delete(PostContributor, { postId: id });
        const createdContributors = await this.contributorsHelperService.createContributors(updatePostDto.contributors);

        for (const [index, contributorInput] of updatePostDto.contributors.entries()) {
          const contributorEntity = createdContributors[index];
          const pc = queryRunner.manager.create(PostContributor, {
            postId: id,
            contributorId: contributorEntity.id,
            role: contributorInput.role,
          });
          await queryRunner.manager.save(pc);
        }
      }

      if (updatePostDto.files) {
        await queryRunner.manager.delete(PostFile, { post: { id } });
        const newFiles = updatePostDto.files.map(url => queryRunner.manager.create(PostFile, { url, post }));
        await queryRunner.manager.save(newFiles);
      }

      await queryRunner.commitTransaction();

      return post;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async findPostsByUserId(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    data: Post[],
    meta: {
      page: number,
      limit: number,
      totalItems: number,
      totalPages: number,
    }
  }> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.postRepository.findAndCount({
      where: { author: { id: userId } },
      relations: ['author', 'category', 'volume', 'contributors', 'contributors.contributor', 'files'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }


  async approvePost(id: string, approvePostDto: ApprovePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });    
    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    // Validate volume if provided
    if (approvePostDto.volumeId) {
      console.log("hello");
      
      const volume = await this.volumeService.findOne(approvePostDto.volumeId);
      if (!volume) {
        throw new NotFoundException(`Volume with id ${approvePostDto.volumeId} not found`);
      }
      post.volume = volume;
    }

    post.approvedByAdmin = approvePostDto.approvedByAdmin;
    post.published = true;
    post.publishedAt = new Date(); // Set published date when approving

    if (approvePostDto.pdfUrl) {
      post.pdfUrl = approvePostDto.pdfUrl;
    }

    return this.postRepository.save(post);
  }
  async archiveOrUnarchivePost(id: string, archive: boolean): Promise<Post> {
  const post = await this.postRepository.findOne({ where: { id } });
  if (!post) {
    throw new NotFoundException(`Post with id ${id} not found`);
  }

  post.isArchive = archive;
  return this.postRepository.save(post);
}

async getArchivedPublishedPosts(
  page = 1,
  limit = 10,
): Promise<{
  data: Post[],
  meta: {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
  }
}> {
  const skip = (page - 1) * limit;

  const [data, totalItems] = await this.postRepository.findAndCount({
    where: { isArchive: true, published: true },
    relations: ['author', 'category', 'volume', 'contributors', 'files'],
    order: { createdAt: 'DESC' },
    skip,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
}



  async findAllPublished(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Post[],
    meta: {
      page: number,
      limit: number,
      totalItems: number,
      totalPages: number,
    }
  }> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.postRepository.findAndCount({
      where:{published: true, isArchive:false},
      relations: ['author', 'category', 'volume', 'contributors', 'contributors.contributor', 'files'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

async findPostsByCategoryId(
  categoryId: string,
  page = 1,
  limit = 10,
): Promise<{
  data: Post[],
  meta: {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
  }
}> {
  const skip = (page - 1) * limit;

  const category = await this.dataSource.manager.findOne(Category, { 
    where: { id: categoryId } 
  });
  
  if (!category) {
    throw new NotFoundException(`Category with id ${categoryId} not found`);
  }

  const [data, totalItems] = await this.postRepository.findAndCount({
    where: { category: { id: categoryId } },
    relations: ['author', 'category', 'contributors', 'volume', 'contributors.contributor', 'files'],
    order: { createdAt: 'DESC' },
    skip,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      // category: category.name, // Optional: include category name in response
    },
  };
}

// Optional: Get only published posts by category
async findPublishedPostsByCategoryId(
  categoryId: string,
  page = 1,
  limit = 10,
): Promise<{
  data: Post[],
  meta: {
    page: number,
    limit: number,
    totalItems: number,
    totalPages: number,
  }
}> {
  const skip = (page - 1) * limit;

  // First check if category exists
  const category = await this.dataSource.manager.findOne(Category, { 
    where: { id: categoryId } 
  });
  
  if (!category) {
    throw new NotFoundException(`Category with id ${categoryId} not found`);
  }

  const [data, totalItems] = await this.postRepository.findAndCount({
    where: { 
      category: { id: categoryId },
      published: true,
      isArchive:false
    },
    relations: ['author', 'category','contributors.contributor', 'volume', 'contributors', 'files'],
    order: { createdAt: 'DESC' },
    skip,
    take: limit,
  });

  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      // category: category.name, // Optional: include category name in response
    },
  };
}

 async findPublishedPostsByVolumeId(
    volumeId: string,
    page = 1,
    limit = 10,
  ): Promise<{
    data: Post[],
    meta: {
      page: number,
      limit: number,
      totalItems: number,
      totalPages: number,
    }
  }> {
    const skip = (page - 1) * limit;

    const volume = await this.volumeService.findOne(volumeId);
    if (!volume) {
      throw new NotFoundException(`Volume with id ${volumeId} not found`);
    }

    const [data, totalItems] = await this.postRepository.findAndCount({
      where: { volume: { id: volumeId }, published:true, isArchive:false },
      relations: ['author', 'category', 'volume', 'contributors', 'volume', 'contributors.contributor', 'files'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
 
}
}
