import { ContributorInput } from './create-post.dto';

export class UpdatePostDto {
  title?: string;
  slug?: string;
  imageUrl?: string;
  abstract?: string;
  excerpt?: string;
  categoryId?: string;
  published?: boolean;
  publishedAt?: Date | null;
  isArchive?: boolean;
  approvedByAdmin?: boolean;
  pdfUrl?: string;
  contributors?: ContributorInput[];
  files?: string[];
}
