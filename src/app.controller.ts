import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/api/:entity') // This route prefix makes the entity dynamic
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  async getData(
    @Param('entity') entity: string,
    @Query('draw') draw: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
    @Param('model') model: string, // Capture the model name, e.g., BookInventory
    @Query() query: any, // Capture all query parameters
  ) {
    const preloads = query.preloads ? JSON.parse(query.preloads) : [];

    console.log('preloads')
    console.log(preloads)
    const additional_join_statements = query.additional_join_statements ? JSON.parse(query.additional_join_statements) : [];
    console.log('additional_join_statements')
    console.log(additional_join_statements)
    const additional_search_queries = query.additional_search_queries ? query.additional_search_queries : {};
    console.log('additional_search_queries')
    console.log(additional_search_queries)
    if (model == undefined) {
      model = entity
    }

    // Pass the necessary parameters to the service
    const result = await this.appService.findAll({
      model,
      preloads,
      additional_join_statements,
      additional_search_queries,
      search: query.search,
      start: parseInt(query.start, 10) || 0,
      length: parseInt(query.length, 10) || 10,
      order: query.order || [],
      columns: query.columns || [],
    });

    return result;
  }

  @Get(':id')
  async findOne(@Param('entity') entity: string, @Param('id') id: string) {
    return this.appService.findOne(entity, id);
  }

  @Post()
  async create(
    @Param('entity') entity: string,
    @Body() data: Record<string, any>,
  ) {
    return this.appService.create(entity, data);
  }
}
