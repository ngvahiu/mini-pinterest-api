import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: "email", type: String })
    email: string;
    @ApiProperty({ description: "password", type: String })
    password: string;
    @ApiProperty({ description: "fullname", type: String })
    fullname: string;
    @ApiProperty({ description: "age", type: Number })
    age: number;
}
