import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateCategoryDto): Promise<Category> {
    try {
      const existingByName = await this.categoryRepository.findOne({ where: { name: createDto.name } });
      if (existingByName) {
        throw new ConflictException(`Category with name "${createDto.name}" already exists`);
      }

      const existingBySlug = await this.categoryRepository.findOne({ where: { slug: createDto.slug } });
      if (existingBySlug) {
        throw new ConflictException(`Category with slug "${createDto.slug}" already exists`);
      }

      const category = this.categoryRepository.create(createDto);
      return this.categoryRepository.save(category);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create category: ' + error.message);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateDto.name && updateDto.name !== category.name) {
      const existingByName = await this.categoryRepository.findOne({ where: { name: updateDto.name } });
      if (existingByName) {
        throw new ConflictException(`Category with name "${updateDto.name}" already exists`);
      }
    }

    if (updateDto.slug && updateDto.slug !== category.slug) {
      const existingBySlug = await this.categoryRepository.findOne({ where: { slug: updateDto.slug } });
      if (existingBySlug) {
        throw new ConflictException(`Category with slug "${updateDto.slug}" already exists`);
      }
    }

    Object.assign(category, updateDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }
}
