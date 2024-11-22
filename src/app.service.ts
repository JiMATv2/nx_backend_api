import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) { }


  async handleWebhook(webhookData: Record<string, any>) {
    // Process the webhook payload here
    console.log('Received webhook data:', webhookData);
    return { success: true };
  }

  async handlePostWebhook(webhookData: Record<string, any>) {
    // Process the webhook payload here
    console.log('Received webhook data:', webhookData);
    return { success: true };
  }

  private getEntityModel(entity: string) {
    const models = {
      users: this.prisma.users,
      roles: this.prisma.roles,
    };
    if (!models[entity]) {
      throw new BadRequestException(`Invalid entity: ${entity}`);
    }
    return models[entity];
  }


  async findAll({
    model,
    preloads,
    additional_join_statements,
    additional_search_queries,
    search,
    start,
    length,
    order,
    columns,
  }) {

    const prismaModel = this.getEntityModel(model);

    console.log(model);
    if (!prismaModel) {
      throw new Error(`Model ${model} not found`);
    }
    const preloadMap = {
      role: true
    };
    const include = preloads.reduce((acc, preload) => {
      if (preloadMap[preload]) {
        acc[preload] = true;
      }
      return acc;
    }, {});
    console.log("include")
    console.log(include)

    console.log("additional_join_statements")
    console.log(additional_join_statements)
    console.log("additional search queries")
    console.log(additional_search_queries)
    // Construct where filter based on the search parameter (e.g., regex search)
    // find a way to create the map
    // 
    const orConditions: any[] = [];
    let preloadKeys = ['a', 'b', 'c', 'd', 'e'], where: any = {};

    for (let index = 0; index < additional_join_statements.length; index++) {
      const element = additional_join_statements[index];
      let kElement = Object.keys(element)[0]; // role
      let searchKey = preloadKeys[index + 1];

      // todo, split(",") this is for the AND

      let searchQueries = additional_search_queries.split("|");

      for (let index2 = 0; index2 < searchQueries.length; index2++) {
        const element2 = searchQueries[index2];

        let qkeys = element2.split("=")[0] // b.name
        let qvalues = element2.split("=")[1] // admin
        let map = {};
        let innerMap: Record<any, any> = {};
        if (searchKey == qkeys.split(".")[0]) {

          innerMap[qkeys.split(".")[1]] = qvalues

          console.log(innerMap)
          map[kElement] = innerMap

          console.log(map)
          orConditions.push(map);
        }
      }
      where.OR = orConditions

    }


    console.log(JSON.stringify(where))

    // Get the total number of records matching the filter
    const total = await prismaModel.count({ where });

    // Perform the query with dynamic includes, pagination, and sorting
    const data = await prismaModel.findMany({
      where,
      include,
      skip: start,
      take: length,
      orderBy: order.length ? order : undefined,
    });

    // Return the result in the required format
    return {
      data,
      draw: 1,
      recordsFiltered: data.length,
      recordsTotal: total,
    };
  }
  async findOne(entity: string, id: string) {
    const model = this.getEntityModel(entity);
    return model.findUnique({ where: { id: parseInt(id) } });
  }

  async create(entity: string, data: Record<string, any>) {
    const model = this.getEntityModel(entity);
    return model.create({ data });
  }
}
