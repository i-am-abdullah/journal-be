import { Controller, Get, Post as HttpPost, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards, Req, Query, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApprovePostDto } from './dto/approve-post.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { ArchivePostDto } from './dto/archive-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get('all')
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    return this.postService.findAll(pageNum, limitNum);
  }

  @Get('published')
  async findAllPublished(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return await this.postService.findAllPublished(pageNum, limitNum);
  }

  @Get('category/:categoryId')
  async findPostsByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return await this.postService.findPostsByCategoryId(categoryId, pageNum, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('category/:categoryId/published')
  async findPublishedPostsByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return await this.postService.findPublishedPostsByCategoryId(categoryId, pageNum, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

    @Get('volume/:volumeId')
  async findPostsByVolumeId(
    @Param('volumeId') volumeId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return await this.postService.findPublishedPostsByVolumeId(volumeId, pageNum, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

    @Get('details/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.postService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('archived')
  async getArchivedPublishedPosts() {
    try {
      return await this.postService.getArchivedPublishedPosts();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,) {
    try {
      console.log(req.user);

      createPostDto.authorId = req.user.id
      return await this.postService.create(createPostDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Get('my-posts')
  async findPostsByUserId(@Req() req: RequestWithUser,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10') {
    try {
      const userId = req.user.id;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return await this.postService.findPostsByUserId(userId, pageNum, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    try {
      return await this.postService.update(id, updatePostDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.postService.remove(id);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id/approve')
  async approvePost(@Param('id') id: string, @Body() approvePostDto: ApprovePostDto) {
    try {
      return await this.postService.approvePost(id, approvePostDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id/archive')
  async archiveOrUnarchivePost(@Param('id') id: string, @Body() body: ArchivePostDto) {
    try {
      return await this.postService.archiveOrUnarchivePost(id, body.archive);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}