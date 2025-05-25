import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),          // reads .env
    MongooseModule.forRoot(process.env.MONGODB_URI as string),   // connects DB
    ProductsModule,                                    // our feature
  ],
})
export class AppModule {}