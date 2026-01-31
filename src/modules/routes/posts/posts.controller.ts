import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

/* Dtos */
import { CreatePostDto } from "./dtos/create-post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { FindAllPostsDto } from "./dtos/find-posts.dto";
import { IdParamDto } from "#common/dto";

/* Services */
import { PostsFindService } from "./services/posts.find.service";
import { PostsCreateService } from "./services/posts.create.service";
import { PostsUpdateService } from "./services/posts.update.service";
import { PostsDeleteService } from "./services/posts.delete.service";

/* Utils */
import { getSwaggerDomain } from "#modules/config/swagger/swagger.util";

@ApiTags(getSwaggerDomain(__dirname))
@Controller("posts")
export class PostsController {
    constructor(
        private readonly postsFindService: PostsFindService,
        private readonly postsCreateService: PostsCreateService,
        private readonly postsUpdateService: PostsUpdateService,
        private readonly postsDeleteService: PostsDeleteService,
    ) {}

    @Get()
    @ApiOperation({ summary: "게시글 목록 조회" })
    async findAll(@Query() query: FindAllPostsDto) {
        return this.postsFindService.findAll({ query });
    }

    @Get(":id")
    @ApiOperation({ summary: "게시글 상세 조회" })
    async findOne(@Param() { id }: IdParamDto) {
        return this.postsFindService.findOne({ where: { id } });
    }

    @Post()
    @ApiOperation({ summary: "게시글 생성" })
    async create(@Body() createPostDto: CreatePostDto) {
        return this.postsCreateService.create({ createDto: createPostDto });
    }

    @Patch(":id")
    @ApiOperation({ summary: "게시글 수정" })
    async update(
        @Param() { id }: IdParamDto,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postsUpdateService.update({
            target: { id },
            updateDto: updatePostDto,
        });
    }

    @Delete(":id")
    @ApiOperation({ summary: "게시글 삭제" })
    async remove(@Param() { id }: IdParamDto) {
        return this.postsDeleteService.delete({ target: { id } });
    }
}
