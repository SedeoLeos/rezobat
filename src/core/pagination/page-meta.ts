// import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from './page.interfaces';

export class PageMetaDto {
  // @ApiProperty()
  readonly page: number;

  // @ApiProperty()
  readonly take: number;

  // @ApiProperty()
  readonly item_count: number;

  // @ApiProperty()
  readonly page_count: number;

  // @ApiProperty()
  readonly hasPreviousPage: boolean;

  // @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ page_options_dto, item_count }: PageMetaDtoParameters) {
    this.page = page_options_dto.page;
    this.take = page_options_dto.take;
    this.item_count = item_count;
    this.page_count = Math.ceil(this.item_count / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.page_count;
  }
}
