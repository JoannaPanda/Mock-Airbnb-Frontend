import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BackendUrl } from './BackendUrl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Slider, Typography, Checkbox, FormControlLabel } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import BedroomChildIcon from '@mui/icons-material/BedroomChild';
import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import { fileToDataUrl } from './Helpers';

function EditCard () {
  const { listingId } = useParams();
  const [title, setTitle] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [country, setCountry] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [doubleBedrooms, setDoubleBedrooms] = useState(0);
  const [singleBedrooms, setSingleBedrooms] = useState(0);
  const [amenities, setAmenities] = useState([]);
  const [selectAllAmenities, setSelectAllAmenities] = useState(false);
  const [listingImgs, setListingImgs] = useState([]);
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState('');
  const [thumbnailType, setThumbnailType] = useState('image');

  useEffect(() => {
    // Fetch listing details based on listingId
    fetch(`${BackendUrl}/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error('Failed: ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        // Set default values for form controls based on listing info
        setTitle(data.listing.title || ''); // Use empty string as default if null
        setStreet(data.listing.address.street || '');
        setCity(data.listing.address.city || '');
        setState(data.listing.address.state || '');
        setPostcode(data.listing.address.postcode || '');
        setCountry(data.listing.address.country || '');
        setThumbnail(data.listing.thumbnail || null); // Use null if no thumbnail
        if (data.listing.thumbnail && data.listing.thumbnail.includes('https://')) {
          setThumbnailType('youtube');
          setYoutubeVideoUrl(data.listing.thumbnail);
        } else {
          setThumbnailType('image');
        }
        setPrice(data.listing.price || '');
        setType(data.listing.metadata.type || '');
        setBathrooms(data.listing.metadata.bathrooms || '');
        setDoubleBedrooms(data.listing.metadata.doubleBedrooms || 0);
        setSingleBedrooms(data.listing.metadata.singleBedrooms || 0);
        setAmenities(data.listing.metadata.amenities || []);
        setListingImgs(data.listing.metadata.listingImgs || []);
      })
      .catch((error) => {
        console.error('Error fetching listing details:', error);
      });
  }, [listingId]);

  const handleThumbnailChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      // Use the fileToDataUrl function to convert the image file to a data URL
      fileToDataUrl(imageFile)
        .then((imageData) => {
          setThumbnail(imageData); // Set the image data
          setYoutubeVideoUrl(''); // Reset YouTube video field when image is chosen
        })
        .catch(() => {
          toast.error('Thumbnail image is not valid', {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        });
    }
  };

  const handleYoutubeVideoChange = (event) => {
    setYoutubeVideoUrl(event.target.value);
    setThumbnail(null); // Reset image data when a YouTube video is provided
  };

  const handleThumbnailTypeChange = (event) => {
    setThumbnailType(event.target.value);
    setThumbnail(null);
    setYoutubeVideoUrl('');
  };

  const handleListingImgsChange = (event) => {
    const imageFiles = Array.from(event.target.files);

    // Use the fileToDataUrl function to convert each image file to a data URL
    Promise.all(
      imageFiles.map((file) => fileToDataUrl(file))
    )
      .then((imageDataArray) => {
        setListingImgs(imageDataArray); // Set the image data array
      })
      .catch(() => {
        toast.error('Listing images are not valid', {
          position: 'bottom-left',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const handleSelectAllAmenities = () => {
    if (selectAllAmenities) {
      // Deselect
      setAmenities([]);
    } else {
      // Select
      setAmenities(['WiFi', 'TV', 'Kitchen', 'Parking', 'AC']);
    }
    // Toggle the selectAllAmenities state
    setSelectAllAmenities(!selectAllAmenities);
  };

  const isFormValid = () => {
    return (
      title &&
      street &&
      city &&
      state &&
      postcode &&
      country &&
      ((thumbnailType === 'image' && thumbnail) ||
        (thumbnailType === 'youtube' && youtubeVideoUrl)) &&
      price &&
      type &&
      bathrooms
    );
  }
  function handleSubmit (event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const address = {
      street,
      city,
      state,
      postcode,
      country
    }
    const metadata = {
      type,
      bathrooms,
      singleBedrooms,
      doubleBedrooms,
      amenities,
      listingImgs,
    }
    const params = {
      title,
      address,
      price,
      thumbnail: thumbnail || youtubeVideoUrl,
      metadata
    };

    const postcodeValid = () => {
      return /^\d{4}$/.test(postcode);
    };

    if (!postcodeValid()) {
      toast.error('Postcode is not valid', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (isFormValid()) {
      fetch(`${BackendUrl}/listings/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(params),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Edit failed: ' + response.status);
          }
          return response.text();
        })
        .then((data) => {
          if (data.length === 0) {
            throw new Error('Empty response data');
          }

          toast.success('Edit Successful!', {
            position: 'bottom-left',
            autoClose: 100,
            hideProgressBar: false,
            closeOnClick: true,
            onClose: () => {
              window.location.href = '/hosted-listings';
            },
          });
        })
        .catch(() => {
          toast.error('Edit failed: please try again', {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        });
    } else {
      toast.error('Some fields are still empty, please double check', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  }
  const handleSliderChange = (event, newValue) => {
    setPrice(newValue); // update price change
  };
  const handleAmenitiesChange = (event) => {
    const selectedAmenity = event.target.name;
    if (event.target.checked) {
      setAmenities([...amenities, selectedAmenity]);
    } else {
      setAmenities(amenities.filter((amenity) => amenity !== selectedAmenity));
    }
  };

  return (
        <div className="registration-form">
          <Container>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Form onSubmit={handleSubmit}>
                <h2>Edit this Hosted Card</h2>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Enter your title"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1 },
                    }}
                    noValidate
                    autoComplete="off"
                    >
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Street"
                            value={street}
                            onChange={(event) => setStreet(event.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="State"
                            value={state}
                            onChange={(event) => setState(event.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Country"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            required
                            id="outlined-required"
                            label="City"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Postcode"
                            value={postcode}
                            onChange={(event) => setPostcode(event.target.value)}
                        />
                        </Grid>
                    </Grid>
                    </Box>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Select One Thumbnail Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={thumbnailType}
                    onChange={handleThumbnailTypeChange}
                    id="select-thumbnail-type"
                  >
                    <option value="image">Image</option>
                    <option value="youtube">YouTube Video URL</option>
                  </Form.Control>
                </Form.Group>

                {thumbnailType === 'image' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Thumbnail Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                    />
                  </Form.Group>
                )}

                {thumbnailType === 'youtube' && (
                  <Form.Group className="mb-3">
                    <Form.Label>YouTube Video URL</Form.Label>
                    <Form.Control
                      type="text"
                      value={youtubeVideoUrl}
                      onChange={handleYoutubeVideoChange}
                      id="edit-thumbnail-youtube"
                    />
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>Other Listing Images (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleListingImgsChange}
                    multiple // Allow multiple file selection
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Input your price</Form.Label>
                  <Form.Control
                    type="text"
                    value={price}
                    // onChange={(event) => setPrice(Number(event.target.value))}
                    onChange={(event) => {
                      // check is number
                      if (/^\d*\.?\d*$/.test(event.target.value)) {
                        setPrice(event.target.value === '' ? '' : Number(event.target.value));
                      }
                    }}
                    placeholder=""
                  />
                  <Slider aria-label="Custom marks"
                  defaultValue={20}
                  step={1}
                  max = {9999}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                  value={price}
                  onChange={handleSliderChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select your Property Type</Form.Label>
                  <InputLabel id="demo-simple-select-label">Property Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Age"
                        onChange={(event) => setType(event.target.value)}
                        sx={{ width: '80%' }}
                    >
                        <MenuItem value={'house'}>House</MenuItem>
                        <MenuItem value={'townhouse'}>Townhouse</MenuItem>
                        <MenuItem value={'unit'}>Unit</MenuItem>
                        <MenuItem value={'villa'}>Villa</MenuItem>
                        <MenuItem value={'apartment'}>Apartment</MenuItem>
                    </Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select your Amount of Bathrooms</Form.Label>
                  <InputLabel id="demo-simple-select-label">The amount of bathrooms</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={bathrooms}
                        label="bathrooms"
                        onChange={(event) => setBathrooms(event.target.value)}
                        sx={{ width: '30%' }}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                    </Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <div>
                      <Typography>Double Bed Bedrooms: {doubleBedrooms}</Typography>
                      <Button onClick={() => setDoubleBedrooms(doubleBedrooms + 1)}>+</Button>
                      <BedroomParentIcon></BedroomParentIcon>
                      <Button onClick={() => doubleBedrooms > 0 && setDoubleBedrooms(doubleBedrooms - 1)}>-</Button>
                  </div>
                  <div>
                      <Typography>Single Bed Bedrooms: {singleBedrooms}</Typography>
                      <Button onClick={() => setSingleBedrooms(singleBedrooms + 1)}>+</Button>
                      <BedroomChildIcon></BedroomChildIcon>
                      <Button onClick={() => singleBedrooms > 0 && setSingleBedrooms(singleBedrooms - 1)}>-</Button>
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>Select your amenities</Form.Label>
                <div>
                  <Button onClick={handleSelectAllAmenities}>
                    {selectAllAmenities ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                {['WiFi', 'TV', 'Kitchen', 'Parking', 'AC'].map((amenity) => (
                <FormControlLabel
                    key={amenity}
                    control={
                    <Checkbox
                        checked={amenities.includes(amenity)}
                        onChange={handleAmenitiesChange}
                        name={amenity}
                    />
                    }
                    label={amenity}
                />
                ))}
                </Form.Group>

                <Button type="submit" className="btn btn-primary form-submit edit-submit">
                  Edit
                </Button>
                <Link to="/hosted-listings" className="hosted-listings-link">
                <Button className="btn btn-primary form-submit">
                  Back
                </Button>
                </Link>
              </Form>
            </Grid>
          </Grid>
          </Container>
          <ToastContainer />
        </div>
  );
}

export default EditCard
