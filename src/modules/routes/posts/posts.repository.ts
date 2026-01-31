import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '#common/base/repository/base-repository.service';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsRepository extends BaseRepository<Post> {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) {
        super(postRepository);
    }
}
