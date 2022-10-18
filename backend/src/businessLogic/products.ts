import { ProductAccess } from '../dataLayer/productsAcess'
import { getUploadUrl } from '../helpers/attachmentUtils';

import { ProductItem } from '../models/ProductItem'
import { ProductUpdate } from '../models/ProductUpdate';

import { CreateProductRequest } from '../requests/CreateProductRequest'
import { UpdateProductRequest } from '../requests/UpdateProductRequest'

import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const ATTACHMENT_S3_BUCKET = process.env.ATTACHMENT_S3_BUCKET
const logger = createLogger('products')
const productAccess = new ProductAccess()


export async function getProductsForUser(userId: string): Promise<ProductItem[]> {
  return await productAccess.getProductsbyUserId(userId);
}

export async function getProductByProductId(userId: string, productId: string): Promise<ProductItem> {
  return await productAccess.getProductByProductId(userId, productId);
}

export async function createProduct(request: CreateProductRequest, userId: string): Promise<ProductItem> {

  const expirationDate = new Date()

  // Initialize the ProductItem
  const productItem: ProductItem = {
    userId: userId,
    productId: uuid.v4(),
    expirationDate: new Date(expirationDate.setMonth(expirationDate.getMonth() + 8)).toISOString(),
    ...request
  }

  logger.info("ProductItem = " + productItem)

  return await productAccess.createProductItem(productItem);
}

export async function updateProduct(request: UpdateProductRequest, userId: string, productId: string): Promise<void> {

  const productItem: ProductUpdate = {
    ...request
  }

  logger.info("ProductItem = " + productItem)

  return await productAccess.updateProductItem(productItem, userId, productId);
}

export async function createAttachmentPresignedUrl(productId: string) {
  return await getUploadUrl(productId);
}

export async function uploadProductImage(userId: string, productId: string): Promise<void> {
  let attachmentUrl: string = `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${productId}`

  logger.info("Attachment URL = " + attachmentUrl)

  return await productAccess.updateProductImage(userId, productId, attachmentUrl);
}

export async function deleteProduct(userId: string, productId: string): Promise<void> {
  return await productAccess.deleteProductItem(userId, productId);
}