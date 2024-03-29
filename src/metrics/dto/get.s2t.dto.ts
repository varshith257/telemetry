import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber } from "class-validator";

export class GetS2TDto {
  @IsNumber()
  page: number = 1;

  @IsNumber()
  limit: number = 10;

  @ApiProperty({
    description: 'Search object',
    example: {
      column: '',
      searchQuery: ''
    }
  })
  searchObj: any;

  @IsIn(['createdAt', 'capturedAt', 'updatedAt'])
  @ApiProperty({
    description: 'Sort by createdAt, capturedAt, updatedAt',
    example: 'createdAt',
  })
  sortBy: string = 'createdAt';

  @IsIn(['asc', 'desc'])
  order: string = 'desc';
}

// GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}