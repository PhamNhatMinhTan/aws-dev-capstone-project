import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { deleteProduct } from '../../businessLogic/products'
import { getUserId } from '../utils'

const logger = createLogger('deleteProduct')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("-- Begin: Delete Product ---------------")

    const productId = event.pathParameters.productId
    const userId: string = getUserId(event)

    // Delete Product
    await deleteProduct(userId, productId)

    logger.info("-- End: Delete Product ---------------")
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
