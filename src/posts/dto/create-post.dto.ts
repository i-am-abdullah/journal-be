export interface ContributorInput {
  fullName: string;
  email?: string | null;
  affiliation?: string | null;
  orcidId?: string | null;
  profileUrl?: string | null;
  role: string;
}

export class CreatePostDto {
  title: string;
  slug: string;
  keywords?:string;
  imageUrl?: string;
  abstract?: string;
  excerpt?: string;
  categoryId: string;
  authorId?: string;
  published?: boolean;
  publishedAt?: Date;
  isArchive?: boolean;
  contributors?: ContributorInput[];
  files?: string[];
}
