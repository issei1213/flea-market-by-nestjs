import { Body, Controller, Get, Post, Param, Patch, Delete, ParseUUIDPipe } from "@nestjs/common";
import { ItemsService } from "./items.service";
import { Item } from "./item.model";
import { CreateItemDto } from "./dto/create-item.dto";

@Controller('items')
export class ItemsController {
  constructor(private readonly itemService: ItemsService) {}

  @Get()
  findAll(): Item[] {
    return this.itemService.findAll()
  }

  @Get(":id") // ex) /items/123
  findById(@Param('id', ParseUUIDPipe) id: string): Item {
    return this.itemService.findById(id)
  }

  @Post()
  create(@Body() createItemDto: CreateItemDto): Item {
    return this.itemService.create(createItemDto)
  }

  @Patch(":id")
  updateStatus(@Param('id', ParseUUIDPipe) id: string): Item {
    return this.itemService.updateStatus(id)
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string): void {
    return this.itemService.delete(id)
  }
}