import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateProductRequest } from '../../requests/CreateProductRequest'
import { getUserId } from '../utils';
import { createProduct } from '../../businessLogic/products'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createProduct')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info("-- Begin: Create Product ---------------")

    // Get information use to create product item
    const newProduct: CreateProductRequest = JSON.parse(event.body)
    const userId: string = getUserId(event)

    // Create Product
    const productItem = await createProduct(newProduct, userId);

    logger.info("-- End: Create Product ---------------")

    // Return result
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: productItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
