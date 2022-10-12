import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getProductsForUser as getProductsForUser } from '../../businessLogic/products'
import { getUserId } from '../utils';

const logger = createLogger('getProducts')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("-- Begin: Create Product List ---------------")

    const userId: string = getUserId(event)

    // Get Products belongs to the user logged in
    const products = await getProductsForUser(userId)

    logger.info("-- End: Get Product List ---------------")

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: products
      })
    }
  }
)
handler.use(
  cors({
    credentials: true
  })
)
