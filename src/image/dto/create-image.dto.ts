import { ApiProperty } from "@nestjs/swagger";

export class CreateImageDto {
    @ApiProperty({ description: "title", type: String })
    title: string;
    @ApiProperty({ description: "description", type: String })
    description: string;
    @ApiProperty({ description: "userId", type: Number })
    userId: number;
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}
