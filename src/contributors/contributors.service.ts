import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contributor } from './entities/contributor.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface CreateContributorInput {
  fullName: string;
  email?: string | null;
  affiliation?: string | null;
  orcidId?: string | null;
  profileUrl?: string | null;
  role?: string; // role will be passed at PostContributor join, so optional here
}

@Injectable()
export class ContributorsHelperService {
  constructor(
    @InjectRepository(Contributor)
    private readonly contributorRepository: Repository<Contributor>,
  ) {}

async createContributors(inputs: CreateContributorInput[]): Promise<Contributor[]> {
  const contributors: Contributor[] = [];
  const seen = new Set<string>();

  for (const input of inputs) {
    const key = `${input.fullName}||${input.email}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const contributor = this.contributorRepository.create(input);
    const saved = await this.contributorRepository.save(contributor);
    contributors.push(saved);
  }

  return contributors;
}

    async findOne(id: string): Promise<any> {
      const contributor = await this.contributorRepository.findOne({
        where: { id }
      });
      if (!contributor) {
        throw new NotFoundException(`Post with id ${id} not found`);
      }
      return contributor;
    }
}
