import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditorialMember } from './entities/editorial-member.entity';
import { CreateEditorialMemberDto } from './dto/create-editorial-member.dto';
import { UpdateEditorialMemberDto } from './dto/create-editorial-member.dto';

@Injectable()
export class EditorialMembersService {
  constructor(
    @InjectRepository(EditorialMember)
    private readonly editorialMemberRepository: Repository<EditorialMember>,
  ) {}

  async create(createDto: CreateEditorialMemberDto): Promise<EditorialMember> {
    try {
      // Check if member with same name already exists
      const existingMember = await this.editorialMemberRepository.findOne({ 
        where: { name: createDto.name } 
      });
      if (existingMember) {
        throw new ConflictException(`Editorial member with name "${createDto.name}" already exists`);
      }

      const editorialMember = this.editorialMemberRepository.create(createDto);
      return this.editorialMemberRepository.save(editorialMember);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create editorial member: ' + error.message);
    }
  }

  async findAll(): Promise<EditorialMember[]> {
    return this.editorialMemberRepository.find({ 
      order: { createdAt: 'DESC' } 
    });
  }

  async findOne(id: string): Promise<EditorialMember> {
    const editorialMember = await this.editorialMemberRepository.findOne({ 
      where: { id } 
    });
    if (!editorialMember) {
      throw new NotFoundException(`Editorial member with id ${id} not found`);
    }
    return editorialMember;
  }

  async update(id: string, updateDto: UpdateEditorialMemberDto): Promise<EditorialMember> {
    const editorialMember = await this.findOne(id);

    // Check if updating name to an existing name
    if (updateDto.name && updateDto.name !== editorialMember.name) {
      const existingMember = await this.editorialMemberRepository.findOne({ 
        where: { name: updateDto.name } 
      });
      if (existingMember) {
        throw new ConflictException(`Editorial member with name "${updateDto.name}" already exists`);
      }
    }

    Object.assign(editorialMember, updateDto);
    return this.editorialMemberRepository.save(editorialMember);
  }

  async remove(id: string): Promise<void> {
    const result = await this.editorialMemberRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Editorial member with id ${id} not found`);
    }
  }
}