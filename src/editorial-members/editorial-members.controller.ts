import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { EditorialMembersService } from './editorial-members.service';
import { CreateEditorialMemberDto } from './dto/create-editorial-member.dto';
import { UpdateEditorialMemberDto } from './dto/create-editorial-member.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('editorial-members')
export class EditorialMembersController {
  constructor(private readonly editorialMembersService: EditorialMembersService) { }

  @Get()
  async findAll() {
    return this.editorialMembersService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.editorialMembersService.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createDto: CreateEditorialMemberDto) {
    try {
      return await this.editorialMembersService.create(createDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateEditorialMemberDto) {
    try {
      return await this.editorialMembersService.update(id, updateDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.editorialMembersService.remove(id);
      return { message: 'Editorial member deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}