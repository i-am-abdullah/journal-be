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

    for (const input of inputs) {
      let contributor: Contributor | null = null;

      if (input.orcidId) {
        contributor = await this.contributorRepository.findOne({ where: { orcidId: input.orcidId } });
      }

      if (!contributor && input.fullName && input.email) {
        contributor = await this.contributorRepository.findOne({
          where: { fullName: input.fullName, email: input.email },
        });
      }

      if (!contributor) {
        contributor = this.contributorRepository.create(input);
        contributor = await this.contributorRepository.save(contributor);
      }

      contributors.push(contributor);
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
