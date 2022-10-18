import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createLogger } from '../../utils/logger'
import { getProductByProductId } from '../../businessLogic/products'
import { getUserId } from '../utils';

const logger = createLogger('getProduct')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("-- Begin: Get Product ---------------")

    const userId: string = getUserId(event)
    const productId = event.pathParameters.productId

    // Get Products belongs to the user logged in
    const product = await getProductByProductId(userId, productId)

    logger.info("-- End: Get Product ---------------")

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: product
      })
    }
  }
)
handler.use(
  cors({
    origin: "*",
    methods: "OPTIONS,GET,PUT,POST,DELETE,HEAD",
    credentials: true
  })
)