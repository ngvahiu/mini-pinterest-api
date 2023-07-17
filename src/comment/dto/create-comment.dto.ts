import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({ description: "userId", type: Number })
    userId: number;
    @ApiProperty({ description: "imageId", type: Number })
    imageId: number;
    @ApiProperty({ description: "content", type: String })
    content: string;
}
