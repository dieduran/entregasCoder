import { Controller, Body, Get, Post } from '@nestjs/common';
import { CreateProductDto } from '../dto/product.dto';
import { Product } from '../interfaces/product.interface';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
    constructor( private readonly productService: ProductService) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto){
        this.productService.create(createProductDto);
    }

    @Get()
    async findAll(): Promise<Product[]>{
        return this.productService.findAll();
    }
}
