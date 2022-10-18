import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import dateFormat from 'dateformat'
import { createProduct } from '../api/products-api'
import { Product } from '../types/Product'

interface ProductsProps {
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
      const manufacturingDate = this.calculateDueDate()
      console.log("name: " + this.state.name)
      console.log("brand: " + this.state.brand)
      console.log("manufacturingDate: " + manufacturingDate)
      
      const newProduct = await createProduct(this.props.auth.getIdToken(), {
        name: this.state.name,
				brand: this.state.brand
        // manufacturingDate
      })
      this.setState({
        // products: [...this.state.products, newProduct],
        name: '',
				brand: ''
      })

      alert('New product was created!')
    } catch {
      alert('Product creation failed')
    }
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
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
        {/* {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>} */}
        <Button
          // loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
