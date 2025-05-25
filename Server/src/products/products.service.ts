import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsGateway } from './ws.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private model: Model<ProductDocument>,
    private gateway: ProductsGateway,
  ) {}

  findAll() { return this.model.find().exec(); }

  async findOne(id: string) {
    const product = await this.model.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
  
  

  search(q: string) {
    const regex = new RegExp(q, 'i');
    return this.model.find({ $or: [{ name: regex }, { description: regex }] }).exec();
  }

  async create(dto: CreateProductDto) {
    const created = new this.model(dto);
    await created.save();
    this.gateway.emitCreated(created);      // push to clients
    return created;
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Product not found');
    this.gateway.emitUpdated(updated);      // push
    return updated;
  }
}