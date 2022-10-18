// import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
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

  // onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
  //   try {
  //     const dueDate = this.calculateDueDate()
  //     const newTodo = await createTodo(this.props.auth.getIdToken(), {
  //       name: this.state.newTodoName,
  //       dueDate
  //     })
  //     this.setState({
  //       todos: [...this.state.todos, newTodo],
  //       newTodoName: ''
  //     })
  //   } catch {
  //     alert('Todo creation failed')
  //   }
  // }

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

  // onProductCheck = async (pos: number) => {
  //   try {
  //     const todo = this.state.todos[pos]
  //     await patchProduct(this.props.auth.getIdToken(), todo.todoId, {
  //       name: todo.name,
  //       dueDate: todo.dueDate,
  //       done: !todo.done
  //     })
  //     this.setState({
  //       todos: update(this.state.todos, {
  //         [pos]: { done: { $set: !todo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Todo deletion failed')
  //   }
  // }

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

        {this.renderCreateProductInput()}

        {this.renderProducts()}
      </div>
    )
  }

  renderCreateProductInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onCreateButtonClick
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
      <Grid padded>
        {this.state.products.map((product, pos) => {
          return (
            <Grid.Row key={product.productId}>
              <Grid.Column width={1} verticalAlign="middle">
                {/* <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={product.brand}
                /> */}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {product.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {product.expirationDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(product.productId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onProductDelete(product.productId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {product.attachmentUrl && (
                <Image src={product.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  // calculateDueDate(): string {
  //   const date = new Date()
  //   date.setDate(date.getDate() + 7)

  //   return dateFormat(date, 'yyyy-mm-dd') as string
  // }
}
