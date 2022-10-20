import * as React from 'react'
import { History } from 'history'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getProductByProductId, updateProduct, getUploadUrl, uploadFile } from '../api/products-api'
import { Product } from '../types/Product'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditProductProps {
  match: {
    params: {
      productId: string
    }
  }
  history: History
  auth: Auth
}

interface EditProductState {
  name: string
  brand: string
  file: any
  uploadState: UploadState
}

export class EditProduct extends React.PureComponent<EditProductProps, EditProductState> {
  state: EditProductState = {
    name: '',
    brand: '',
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }

  handleBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ brand: event.target.value })
  }
  
  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      console.log("Product name: " + this.state.name)
      console.log("Product brand: " + this.state.brand)

      await updateProduct(this.props.auth.getIdToken(), this.props.match.params.productId, {
        name: this.state.name,
        brand: this.state.brand
      })

      if (this.state.file) {
        this.setUploadState(UploadState.FetchingPresignedUrl)
        
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.productId)

        this.setUploadState(UploadState.UploadingFile)
        await uploadFile(uploadUrl, this.state.file)
      }

      alert('Product was updated!')
      this.props.history.goBack()
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }


  async componentDidMount() {
    try {
      const product = await getProductByProductId(this.props.auth.getIdToken(), this.props.match.params.productId)
      
      this.setState({
        name: product.name,
        brand: product.brand
      })
    } catch (e) {
      alert(`Failed to fetch products: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <h1>Update the product</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Product Name' value={this.state.name} onChange={this.handleNameChange} />
          </Form.Field>
          <Form.Field>
            <label>Brand</label>
            <input placeholder='Product Brand' value={this.state.brand} onChange={this.handleBrandChange} />
          </Form.Field>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
          content="Update"
        />
      </div>
    )
  }
}
