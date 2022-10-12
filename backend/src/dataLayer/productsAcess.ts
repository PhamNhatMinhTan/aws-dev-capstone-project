import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ProductItem } from '../models/ProductItem'
import { ProductUpdate } from '../models/ProductUpdate'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('productsAccess')

export class ProductAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly PRODUCT_TABLE = process.env.PRODUCTS_TABLE
  ) { }

  async getProductsbyUserId(userId: string): Promise<ProductItem[]> {
    const result = await this.docClient.query({
      TableName: this.PRODUCT_TABLE,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
    }).promise()

    logger.info("Product items: " + result.Items)
    logger.info("Get list Product item by UserId successfully!")
    return result.Items as ProductItem[]

  }

  async createProductItem(productItem: ProductItem): Promise<ProductItem> {
    await this.docClient.put({
      TableName: this.PRODUCT_TABLE,
      Item: productItem
    }).promise()
      .then(data => {
        logger.info("Data created: " + data.Attributes)
        logger.info("Create product item successfully!")
      })
      .catch(err => logger.error("Error occurred while create product item cause: " + err))

    return productItem
  }

  async updateProductItem(productUpdate: ProductUpdate, userId: string, productId: string): Promise<void> {
    this.docClient.update({
      TableName: this.PRODUCT_TABLE,
      Key: {
        userId: userId,
        productId: productId,
      },
      UpdateExpression: "set #name = :name, brand = :brand, expirationDate = :expirationDate",
      ExpressionAttributeNames: { "#name": "name" },
      ExpressionAttributeValues: {
        ':name': productUpdate.name,
        ':brand': productUpdate.brand,
        ':expirationDate': productUpdate.expirationDate
      }
    }).promise()
      .then(data => {
        logger.info("Data updated: " + data.Attributes)
        logger.info("Update product item successfully!")
      })
      .catch(err => logger.error("Error occurred while update product item cause: " + err))

    return;
  }

  async updateProductImage(userId: string, productId: string, attachmentUrl: string): Promise<void> {
    this.docClient.update({
      TableName: this.PRODUCT_TABLE,
      Key: {
        userId: userId,
        productId: productId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl,
      }
    }).promise()
      .then(data => {
        logger.info("Data updated: " + data.Attributes)
        logger.info("Update product image successfully!")
      })
      .catch(err => logger.error("Error occurred while update product image cause: " + err))

    return;
  }

  async deleteProductItem(userId: string, productId: string): Promise<void> {
    this.docClient.delete({
      TableName: this.PRODUCT_TABLE,
      Key: {
        userId: userId,
        productId: productId,
      }
    }).promise()
      .then(data => {
        logger.info("Data updated: " + data.Attributes)
        logger.info("Delete product item successfully!")
      })
      .catch(err => logger.error("Error occurred while delete product item cause: " + err))

    return;
  }
}
