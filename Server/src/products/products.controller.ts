import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()                findAll()                         { return this.service.findAll(); }
  @Get('search')        search(@Query('q') q: string)     { return this.service.search(q); }
  @Get(':id')           findOne(@Param('id') id: string)  { return this.service.findOne(id); }
  @Post()               create(@Body() dto: CreateProductDto) { return this.service.create(dto); }
  @Put(':id')           update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
                           return this.service.update(id, dto); }
}