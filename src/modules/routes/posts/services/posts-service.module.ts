import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../entities/post.entity';
import { PostsRepository } from '../posts.repository';
import { PostsResponse } from '../posts.response';
import { RESPONSE_CODE_PREFIX_POSTS } from '../posts.constants';
import { PostsFindService } from './posts.find.service';
import { PostsCreateService } from './posts.create.service';
import { PostsUpdateService } from './posts.update.service';
import { PostsDeleteService } from './posts.delete.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post])],
    providers: [
        /* Repository */
        PostsRepository,

        /* Response */
        PostsResponse,

        /* Constant */
        {
            provide: RESPONSE_CODE_PREFIX_POSTS,
            useValue: RESPONSE_CODE_PREFIX_POSTS,
        },

        /* Service */
        PostsFindService,
        PostsCreateService,
        PostsUpdateService,
        PostsDeleteService,
    ],
    exports: [
        PostsFindService,
        PostsCreateService,
        PostsUpdateService,
        PostsDeleteService,
        PostsRepository,
        PostsResponse,
        RESPONSE_CODE_PREFIX_POSTS,
    ],
})
export class PostsServiceModule {}
