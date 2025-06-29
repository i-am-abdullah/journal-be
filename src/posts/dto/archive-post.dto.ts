// archive-post.dto.ts
import { IsBoolean } from 'class-validator';

export class ArchivePostDto {
  @IsBoolean()
  archive: boolean;
}
