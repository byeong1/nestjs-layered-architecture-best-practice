import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsServiceModule } from './services/posts-service.module';

@Module({
    imports: [PostsServiceModule],
    controllers: [PostsController],
})
export class PostsModule {}
