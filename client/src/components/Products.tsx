// import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Table,
} from 'semantic-ui-react'

import { deleteProduct, getProducts } from '../api/products-api'
import Auth from '../auth/Auth'
import { Product } from '../types/Product'

interface ProductsProps {
  auth: Auth
  history: History
}

interface ProductsState {
  products: Product[]
  newProductName: string
  loadingProducts: boolean
}

export class Products extends React.PureComponent<ProductsProps, ProductsState> {
  state: ProductsState = {
    products: [],
    newProductName: '',
    loadingProducts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newProductName: event.target.value })
  }

  onEditButtonClick = (productId: string) => {
    this.props.history.push(`/products/${productId}/edit`)
  }

  onCreateButtonClick = () => {
    this.props.history.push(`/products/create`)
  }

  onProductDelete = async (productId: string) => {
    try {
      await deleteProduct(this.props.auth.getIdToken(), productId)
      this.setState({
        products: this.state.products.filter(product => product.productId !== productId)
      })
    } catch {
      alert('Product deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const products = await getProducts(this.props.auth.getIdToken())
      this.setState({
        products,
        loadingProducts: false
      })
    } catch (e) {
      alert(`Failed to fetch products: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">PRODUCTs</Header>

        {this.renderCreateProductButton()}

        {this.renderProducts()}
      </div>
    )
  }

  renderCreateProductButton() {
    return (
      <Button 
      onClick={this.onCreateButtonClick }
      content="Create product" 
      icon="add"
      labelPosition='left'
      primary />
    )
  }

  renderProducts() {
    if (this.state.loadingProducts) {
      return this.renderLoading()
    }

    return this.renderProductsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading PRODUCTs
        </Loader>
      </Grid.Row>
    )
  }

  renderProductsList() {
    return (
      <Table celled padded>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Thumbnail</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Brand</Table.HeaderCell>
            <Table.HeaderCell>MFG Date</Table.HeaderCell>
            <Table.HeaderCell>EXP Date</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.state.products.map((product) => {
          return (
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Image src={product.attachmentUrl} size="small" />
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {product.name}
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {product.brand}
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {product.manufacturingDate}
                </Table.Cell>
                <Table.Cell verticalAlign="middle">
                  {product.expirationDate}
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(product.productId) }
                  >
                    <Icon name="pencil" />
                  </Button>
                  <Button 
                    icon
                    color="red"
                    onClick={() => this.onProductDelete(product.productId) }
                  >
                    <Icon name="delete" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        })}
      </Table>
    )
  }
}
