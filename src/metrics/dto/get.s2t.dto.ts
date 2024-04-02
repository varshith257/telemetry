import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export class GetS2TDto {
  @IsNumber()
  @ApiProperty()
  page: number = 1;

  @IsNumber()
  @ApiProperty()
  limit: number = 10;

  @ApiProperty({
    description: 'Search object',
    example: {
      column: 'text',
      searchQuery: 'some input to search'
    }
  })
  @IsOptional()
  searchObj: any;

  @ApiProperty({
    description: 'Search object',
    example: {
      column: 'orgId',
      filterQuery: '7228b201-f5db-4d1d-b1bb-f0b4c974921d'
    }
  })
  @IsOptional()
  filterObj: any;

  @ApiProperty({
    description: 'Sort by column name to sort data by',
    example: 'createdAt',
  })
  @IsOptional()
  sortBy: string = 'createdAt';

  @IsIn(['asc', 'desc'])
  @ApiProperty({
    description: 'Order to sort column provided in sortBy',
    example: 'asc',
  })
  @IsOptional()
  sort: string = 'desc';
}

// GET http://my.api.url/posts?sort=["title","ASC"]&range=[0, 24]&filter={"title":"bar"}