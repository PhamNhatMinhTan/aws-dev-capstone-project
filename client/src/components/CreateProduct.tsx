import * as React from 'react'
import { History } from 'history'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createProduct } from '../api/products-api'

interface ProductsProps {
  history: History
  auth: Auth
}

interface ProductsState {
  name: string
	brand: string
  loadingProducts: boolean
}

export class CreateProduct extends React.PureComponent<ProductsProps, ProductsState> {
	state: ProductsState = {
    name: '',
		brand: '',
    loadingProducts: true
  }

	handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ brand: event.target.value })
  }
    
	onProductCreate = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    
    try {
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.name,
				brand: this.state.brand
      })
      this.setState({
        name: '',
				brand: ''
      })

      alert('New product was created!')
      this.props.history.goBack()
    } catch {
      alert('Product creation failed')
    }
  }

  render() {
    return (
      <div>
        <h1>Create new product</h1>

        <Form onSubmit={this.onProductCreate}>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Product Name' value={this.state.name} onChange={this.handleNameChange} />
          </Form.Field>
          <Form.Field>
            <label>Brand</label>
            <input placeholder='Product Brand' value={this.state.brand} onChange={this.handleBrandChange} />
          </Form.Field>
          <Button type='submit'>Create</Button>
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button type="submit" content="Create" />
      </div>
    )
  }
}
