import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  HttpException, 
  HttpStatus, 
  UseGuards, 
  Query 
} from '@nestjs/common';
import { VolumeService } from './volume.service';
import { CreateVolumeDto } from './dto/volume.dto';
import { UpdateVolumeDto } from './dto/volume.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('volumes')
export class VolumeController {
  constructor(private readonly volumeService: VolumeService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      return await this.volumeService.findAll(pageNum, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('with-counts')
  async findVolumesWithPostCounts() {
    try {
      return await this.volumeService.findVolumesWithPostCounts();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.volumeService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createVolumeDto: CreateVolumeDto) {
    try {
      return await this.volumeService.create(createVolumeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateVolumeDto: UpdateVolumeDto) {
    try {
      return await this.volumeService.update(id, updateVolumeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.volumeService.remove(id);
      return { message: 'Volume deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}