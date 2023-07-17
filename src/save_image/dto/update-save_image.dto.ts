import { PartialType } from '@nestjs/mapped-types';
import { CreateSaveImageDto } from './create-save_image.dto';

export class UpdateSaveImageDto extends PartialType(CreateSaveImageDto) {}
