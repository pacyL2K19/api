import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  getPagination(offset: number, limit: number, totalCount: number) {
    return {
      offset: offset,
      limit: limit,
      previousOffset: offset - limit < 0 ? 0 : offset - limit,
      nextOffset: offset + limit,
      pageCount: Math.floor(totalCount / limit) + 1,
      currentPage: Math.floor(offset / limit) + 1,
      totalCount: totalCount,
    };
  }
}
