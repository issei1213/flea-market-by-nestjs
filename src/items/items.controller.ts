import { Body, Controller, Get, Post, Param, Patch, Delete } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { Item } from "./item.model";
import { ItemStatus } from "./item-status.enum";

@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  @Get()
  findAll(): Item[] {
    return this.itemService.findAll()
  }

  @Get(":id") // ex) /items/123
  findById(@Param('id') id: string): Item {
    return this.itemService.findById(id)
  }

  @Post()
  create(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description: string
  ): Item {
    const item: Item = {
      id,
      name,
      price,
      description,
      status: ItemStatus.ON_SALE
    }
    return this.itemService.create(item)
  }

  @Patch(":id")
  updateStatus(@Param('id') id: string): Item {
    return this.itemService.updateStatus(id)
  }

  @Delete(':id')
  delete(@Param('id') id: string): void {
    return this.itemService.delete(id)
  }
}