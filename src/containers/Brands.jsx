import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import {getBrands, deleteBrand} from "../backend/services/brandService";
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
const token = Cookie.get('sneakerlog_access_token');

export default class Brand extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      brands: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Brands...',
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    }
  }

  componentWillMount() {
    this.fetchBrand();
  }

  fetchBrand = () => {
    this.setState({ loading: true })
    getBrands()
    .then(response => {
      this.setState({
        brands: response,
        loading: false,
        responseMessage: 'No Brands Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No Brands Found...'
      })
    })
  }
  
  deleteBrand(brandId, index) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
      deleteBrand(brandId)
        .then(response => {
          const brands = this.state.brands.slice();
          brands.splice(index, 1);
          this.setState({
            brands,
            showSnackBar: true,
            snackBarMessage: "Brand deleted successfully",
            snackBarVariant: "success",
          });
        })
        .catch(() => {
          this.setState({
            showSnackBar: true,
            snackBarMessage: "Error deleting brand",
            snackBarVariant: "error",
          });
        })
    }
  })
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, brands: [], responseMessage: 'Loading Brand...'})
    // if(q === "") {
    //   this.fetchBrand();
    // } else {
      axios.get(`${API_END_POINT}/api/items/brand/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          brands: response.data.searchedItems,
          loading: false,
          responseMessage: 'No Brands Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Brands Found...'
        })
      })
    }
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false })
  }

  render() {
    // console.log(this.state);
    const {loading, brands, responseMessage,
      showSnackBar,
      snackBarMessage,
      snackBarVariant } = this.state; 
    return (
      <div className="row animated fadeIn">
        {showSnackBar && (
          <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of Brands</h3>
            </div>
            <div  className="col-sm-4">
              {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchBrand();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
            </div>

          <div className="col-sm-4 pull-right mobile-space">
              <Link to="/brands/brand-form">
                <button type="button" className="btn btn-success">Add New Brand</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Name</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {this.state.brands && this.state.brands.length >= 1 ?
                this.state.brands.map((brand, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{brand.name}</td>
                  <td>{<img style={{height: '50px', width: '50px'}} src={brand.image} />}</td>
                  <td>
                    <Link to={`/brands/edit-brand/${brand.uuid}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteBrand(brand.uuid, index)}></span>
                  </td>
                </tr>
                )) :
                (
                  <tr>
                    <td colSpan="15" className="text-center">{responseMessage}</td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
          {/* <div className="text-center">
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
