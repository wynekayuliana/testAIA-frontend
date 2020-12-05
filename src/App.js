import React from "react";
import './App.css';
import { TextField, Divider, InputAdornment, IconButton } from '@material-ui/core';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import axios from 'axios';

import * as Path from './utils/GlobalVariables';

function getFormData(e) {
  const data = {};
  const formData = new FormData(e.target);
  for (let entry of formData.entries()) {
    data[entry[0]] = entry[1]
  }
  return data;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_images: [],
      data_title: "",
    };
  }

  // fetch data images
  postImageSearchData(req) {
    axios.post(Path.API + 'flickr/feeds/publicPhotos', req)
      .then((response) => {
        var resp = response.data;
        if (resp) {
          this.setState({
            data_images: resp.items,
            data_title: resp.title
          });
        }
        console.log('tes', response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.postImageSearchData({ format: "json" });
  }

  onSubmitSearch(e) {
    e.preventDefault();
    var data = getFormData(e.target);


  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h2 style={{ margin: "1rem 0" }}>{this.state.data_title}</h2>
          <form onSubmit={this.onSubmitSearch}>
            <div className="h-flex jc ac search-bar">
              <TextField id="search_value" name="search_value"
                label="Search Something . . ."
                variant="outlined" className="search-input"
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton aria-label="ImageSearch" title="click to search" type="submit">
                      <ImageSearchIcon />
                    </IconButton>
                  </InputAdornment>,
                }}
              />
            </div>
          </form>
        </div>
        <Divider />
        <div className="app-content">
          tes
        </div>
      </div>
    )
  }
}
