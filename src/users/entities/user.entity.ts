import { Column, Entity, OneToMany} from 'typeorm';
import { BaseEntity } from 'src/common/base.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'varchar', length: 19, unique: true, nullable: true })
  orc_id: string | null;

  @Column({ nullable: true})
  role: string;

  @Column({ nullable: true, type: 'timestamp' })
  lastLogin: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
