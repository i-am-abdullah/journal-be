import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { Contributor } from 'src/contributors/entities/contributor.entity';

@Entity('post_contributors')
export class PostContributor {
  @PrimaryColumn({ type: 'uuid', name: 'post_id' })
  postId: string;

  @PrimaryColumn({ type: 'uuid', name: 'contributor_id' })
  contributorId: string;

  @ManyToOne(() => Post, (post) => post.contributors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Contributor, (contributor) => contributor.postConnections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contributor_id' })
  contributor: Contributor;

  @Column({ type: 'varchar', nullable: false })
  role: string;
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
