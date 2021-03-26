import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { getSneakersReleaseDates, deleteSneakersReleaseDate } from "../backend/services/sneakerReleaseService";
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2"
export default class Sneakers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sneakers: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading Sneakers Release Dates...',
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({ loading: true })
    getSneakersReleaseDates()
      .then(response => {
        this.setState({
          sneakers: response,
          loading: false,
          responseMessage: 'No Sneakers Release Dates Found'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Sneakers Release Dates Found...'
        })
      })
  }

  deleteSneaker(sneakerId, index) {
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
      deleteSneakersReleaseDate(sneakerId)
        .then(response => {
          const sneakers = this.state.sneakers.slice();
          sneakers.splice(index, 1);
          this.setState({
            sneakers,
            showSnackBar: true,
            snackBarMessage: "Sneaker Release deleted successfully",
            snackBarVariant: "success",
          })
        })
        .catch(() => {
          this.setState({
            showSnackBar: true,
            snackBarMessage: "Error deleting sneaker release",
            snackBarVariant: "error",
          });
        })
    }
  })
}

    // handleSearch() {
    //   const { q } = this.state;
    //   if(q.length) {
    //   this.setState({loading: true, sneakers: [], responseMessage: 'Loading Sneakers...'})
    //   // if(q === "") {
    //   //   this.fetchBrand();
    //   // } else {
    //     axios.get(`${API_END_POINT}/api/items/sneaker/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
    //     .then((response) => {
    //       this.setState({
    //         sneakers: response.data.searchedItems,
    //         loading: false,
    //         responseMessage: 'No Sneakers Found...'
    //       })
    //     })
    //     .catch(() => {
    //       this.setState({
    //         loading: false,
    //         responseMessage: 'No Sneakers Found...'
    //       })
    //     })
    //   }
    // }

    closeSnackBar = () => {
      this.setState({ showSnackBar: false })
    }

    render() {
      // console.log(this.state);
      const { loading, sneakers, responseMessage,
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
                <h3>List of Sneakers Release</h3>
              </div>
              <div className="col-sm-4">
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
                <Link to="/sneakers/sneakers-form">
                  <button type="button" className="btn btn-success">Add New Sneakers Release</button>
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
                    <th>Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sneakers && this.state.sneakers.length >= 1 ?
                    this.state.sneakers.map((sneaker, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{sneaker.name}</td>
                        <td>{<img style={{ height: '50px', width: '50px' }} src={sneaker.image} />}</td>
                        <td>{moment(new Date(sneaker.releaseDate.seconds * 1000)).format("DD-MMM-YYYY")}</td>
                        <td>
                          <Link to={`/sneakers/edit-sneakers/${sneaker.uuid}`}>
                            <span className="fa fa-edit" aria-hidden="true"></span>
                          </Link>
                        </td>
                        <td>
                          <span className="fa fa-trash" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.deleteSneaker(sneaker.uuid, index)}></span>
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
