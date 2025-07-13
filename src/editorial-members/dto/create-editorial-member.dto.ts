// create-editorial-member.dto.ts
export class CreateEditorialMemberDto {
  name: string;
  location?: string;
  education: string;
  affiliation?: string;
  areasOfExpertise?: string;
}

// update-editorial-member.dto.ts
export class UpdateEditorialMemberDto {
  name?: string;
  location?: string;
  education?: string;
  affiliation?: string;
  areasOfExpertise?: string;
}