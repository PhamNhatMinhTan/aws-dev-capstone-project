import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { updateProduct } from '../../businessLogic/products'
import { UpdateProductRequest } from '../../requests/UpdateProductRequest'
import { getUserId } from '../utils'

const logger = createLogger('updateProduct')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("-- Begin: Update Product ---------------")

    const productId = event.pathParameters.productId
    const userId: string = getUserId(event)

    // get product information in request
    const updatedProductItem: UpdateProductRequest = JSON.parse(event.body)

    // Update product data on database 
    await updateProduct(updatedProductItem, userId, productId);

    logger.info("-- End: Update Product ---------------")
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
