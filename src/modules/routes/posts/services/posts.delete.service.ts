import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "#common/base/service/base-service.service";
import { PostsRepository } from "../posts.repository";
import { PostsResponse } from "../posts.response";
import { RESPONSE_CODE_PREFIX_POSTS } from "../posts.constants";
import { Post } from "../entities/post.entity";

@Injectable()
export class PostsDeleteService extends BaseService<Post> {
    constructor(
        protected readonly postsRepository: PostsRepository,
        protected readonly postsResponse: PostsResponse,
        @Inject(RESPONSE_CODE_PREFIX_POSTS)
        protected readonly RESPONSE_CODE_PREFIX: string,
    ) {
        super(postsRepository, postsResponse, RESPONSE_CODE_PREFIX);
    }
}
