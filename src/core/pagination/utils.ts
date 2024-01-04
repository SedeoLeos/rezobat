import { PageMetaDto } from './page-meta.js';
import { PageOptionsDto } from './page-option.dto';
import { PageDto } from './page.dto.js';

export const handlerReponse = <T>(
  page_options_dto: PageOptionsDto,
  result: [T[], number],
) => {
  const [entities, item_count] = result;
  const page_meta_dto = new PageMetaDto({ item_count, page_options_dto });
  return new PageDto(entities, page_meta_dto);
};
