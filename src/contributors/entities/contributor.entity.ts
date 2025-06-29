import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PostContributor } from 'src/posts/entities/post-contributor.entity';

@Entity('contributors')
export class Contributor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  affiliation: string | null;

  @Column({ type: 'varchar', length: 19, unique: true, nullable: true })
  orcidId: string | null;

  @Column({ type: 'text', nullable: true })
  profileUrl: string | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => PostContributor, (pc) => pc.contributor)
  postConnections: PostContributor[];
}
