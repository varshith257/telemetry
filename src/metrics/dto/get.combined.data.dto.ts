import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export class GetCombinedData {
  @IsNumber()
  @ApiProperty()
  page: number = 1;

  @IsNumber()
  @ApiProperty()
  perPage: number = 10;

  @ApiProperty({
    description: 'Search object',
    example: {
      botId: '7228b201-f5db-4d1d-b1bb-f0b4c974921d',
      text: 'How to grow wheat?'
    }
  })
  @IsOptional()
  filter: any;

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