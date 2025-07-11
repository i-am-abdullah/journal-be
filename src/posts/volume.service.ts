import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Volume } from './entities/volume.entity';
import { CreateVolumeDto } from './dto/volume.dto';
import { UpdateVolumeDto } from './dto/volume.dto';

@Injectable()
export class VolumeService {
  constructor(
    @InjectRepository(Volume)
    private readonly volumeRepository: Repository<Volume>,
  ) {}

  async create(createVolumeDto: CreateVolumeDto): Promise<Volume> {
    try {
      const volume = this.volumeRepository.create(createVolumeDto);
      return await this.volumeRepository.save(volume);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Volume[],
    meta: {
      page: number,
      limit: number,
      totalItems: number,
      totalPages: number,
    }
  }> {
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.volumeRepository.findAndCount({
      relations: ['posts'],
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

  async findOne(id: string): Promise<Volume> {
    const volume = await this.volumeRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.author', 'posts.category'],
    });

    if (!volume) {
      throw new NotFoundException(`Volume with id ${id} not found`);
    }

    return volume;
  }

  async update(id: string, updateVolumeDto: UpdateVolumeDto): Promise<Volume> {
    const volume = await this.volumeRepository.findOne({ where: { id } });
    
    if (!volume) {
      throw new NotFoundException(`Volume with id ${id} not found`);
    }

    Object.assign(volume, updateVolumeDto);
    
    try {
      return await this.volumeRepository.save(volume);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.volumeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Volume with id ${id} not found`);
    }
  }

  async findVolumesWithPostCounts(): Promise<any[]> {
    return await this.volumeRepository
      .createQueryBuilder('volume')
      .leftJoinAndSelect('volume.posts', 'post')
      .loadRelationCountAndMap('volume.postCount', 'volume.posts')
      .orderBy('volume.createdAt', 'DESC')
      .getMany();
  }
}