import React from "react";
import './App.css';
import {
  TextField, Divider, InputAdornment, IconButton, Container, Grid,
  Card, CardActionArea, CardContent, CardMedia, Grow
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import axios from 'axios';
import moment from "moment";

import * as Path from './utils/GlobalVariables';

function getFormData(e) {
  const data = {};
  const formData = new FormData(e.target);
  for (let entry of formData.entries()) {
    data[entry[0]] = entry[1]
  }
  return data;
}

function sliceData(data, current, limit) {
  var start = (current - 1) * limit;
  var end = current * limit;
  var fixdata = data.slice(start, end);
  return fixdata;
}

function calculatePagesCount(limit, totalCount) {
  return totalCount < limit ? 1 : Math.ceil(totalCount / limit);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data_images_original: [],
      data_images: [],
      data_images_total: 0,
      data_title: "",
      current_page: 1,
      limit_per_page: 9,
    };
  }

  // fetch data images
  postImageSearchData(req) {
    axios.post(Path.API + 'flickr/feeds/publicPhotos', req)
      .then((response) => {
        var resp = response.data;
        if (resp) {
          this.setState({
            data_images_original: resp.items,
            data_images: sliceData(resp.items, 1, this.state.limit_per_page),
            data_images_total: resp.items.length,
            data_title: resp.title
          });
        }
        // console.log('tes', response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.postImageSearchData({ format: "json" });
  }

  onClickImage = (link) => {
    window.open(link);
  }

  onChangePagination = (event, page) => {
    const section = document.querySelector('#app-content');
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    this.setState({
      data_images: [],
      current_page: page
    }, () => {
      this.setState({
        data_images: sliceData(this.state.data_images_original, page, this.state.limit_per_page),
      })
    });
  }

  onSubmitSearch(e) {
    e.preventDefault();
    var data = getFormData(e.target);
    var escape_txtsearch = data.search_value.replace(/[^a-zA-Z0-9 ]/g, "");
    var tags_txtsearch = escape_txtsearch.replace(/[ ,]+/g, ",");

    var request_body = {
      format: "json",
      tags: tags_txtsearch
    };
    this.postImageSearchData(request_body);
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h2 className="text-center" style={{ margin: "1rem 0" }}>Test AIA Project</h2>
          <form onSubmit={this.onSubmitSearch}>
            <div className="h-flex jc ac search-bar">
              <TextField id="search_value" name="search_value"
                label="Search Something"
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
        <div className="app-content" id="app-content">
          <Container maxWidth="lg">
            <h2 className="text-center" style={{ margin: "1rem 0" }}>{this.state.data_title}</h2>

            {this.state.data_images ?
              <Grid container spacing={2}>
                {this.state.data_images.map((row, index) => {

                  return (
                    <Grow in={true} timeout={index * 1000}>
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card onClick={this.onClickImage.bind(this, row.link)}>
                          <CardActionArea>
                            <CardMedia
                              className="image-item"
                              image={row.media.m}
                            />
                            <CardContent>
                              <h4>{row.title.substring(0, 49) || 'Untitled'}</h4>
                              <p>By:&nbsp;{row.author}</p>
                              <p className="text-right" style={{ fontSize: '11px', color: '#959da5' }}>
                                Uploaded&nbsp;on&nbsp;{moment(row.date_taken).format('DD MMM YYYY HH:MM')}
                              </p>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    </Grow>
                  );
                })}
              </Grid>
              : <div className="content-not-found">
                <ErrorOutlineIcon style={{ fontSize: '300px' }} color="error" />
                <h2>Sorry, Data Not Found</h2>
              </div>
            }

            {this.state.data_images_total > this.state.limit_per_page ?
              <Pagination
                className="image-pagination"
                color="primary"
                count={calculatePagesCount(this.state.limit_per_page, this.state.data_images_total)}
                page={this.state.current_page}
                onChange={this.onChangePagination}
              />
              : null
            }
          </Container>
        </div>
      </div>
    )
  }
}
