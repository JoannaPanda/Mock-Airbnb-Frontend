import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

function CreateCard () {
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
  const [shouldSubmit, setShouldSubmit] = useState(false);
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

  function handleJsonfile (event) {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      const listings = JSON.parse(e.target.result).listings;
      Object.values(listings).forEach(listing => {
        if (isListingValid(listing)) {
          setTitle(listing.title)
          setStreet(listing.address.street)
          setCity(listing.address.city)
          setState(listing.address.state)
          setPostcode(listing.address.postcode)
          setCountry(listing.address.country)
          setThumbnail(listing.thumbnail)
          setType(listing.metadata.type)
          setBathrooms(listing.metadata.bathrooms)
          setSingleBedrooms(listing.metadata.singleBedrooms)
          setDoubleBedrooms(listing.metadata.doubleBedrooms)
          setAmenities(listing.metadata.amenities)
          setPrice(listing.price)
          toast('Upload successed', {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          })
          setShouldSubmit(true);
        } else {
          toast.error('Some fields are still empty, please double check', {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
          });
        }
      });
    };
  }
  useEffect(() => {
    if (shouldSubmit) {
      // 创建一个新的事件对象，因为原始事件对象在异步操作中可能不再可用
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
      setShouldSubmit(false);
    }
  }, [shouldSubmit]);

  function isListingValid (listing) {
    const requiredFields = ['title', 'owner', 'price', 'thumbnail'];
    const addressFields = ['street', 'city', 'state', 'postcode', 'country'];

    for (const field of requiredFields) {
      if (!listing[field]) {
        return false;
      }
    }

    for (const field of addressFields) {
      if (!listing.address || !listing.address[field]) {
        return false;
      }
    }

    return true;
  }
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
      fetch(`${BackendUrl}/listings/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify(params),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.error);
            });
          }
          return response.text();
        })
        .then((data) => {
          if (data.length === 0) {
            throw new Error('Empty response data');
          }

          toast.success('Create Successful!', {
            position: 'bottom-left',
            autoClose: 100,
            hideProgressBar: false,
            closeOnClick: true,
            onClose: () => {
              window.location.href = '/hosted-listings';
            },
          });
        })
        .catch((error) => {
          toast.error(`Create listing failed, ${error}`, {
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
                <h2>Create your Hosted Card</h2>
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
                            id="street"
                            label="Street"
                            value={street}
                            onChange={(event) => setStreet(event.target.value)}
                        />
                        <TextField
                            required
                            id="state"
                            label="State"
                            value={state}
                            onChange={(event) => setState(event.target.value)}
                        />
                        <TextField
                            required
                            id="country"
                            label="Country"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                        />
                        </Grid>
                        <Grid item xs={6}>
                        <TextField
                            required
                            id="city"
                            label="City"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                        />
                        <TextField
                            required
                            id="postcode"
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
                    id="select-thumbnail-type"
                    onChange={handleThumbnailTypeChange}
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
                      placeholder="Enter YouTube Video URL"
                      value={youtubeVideoUrl}
                      onChange={handleYoutubeVideoChange}
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
                  <Form.Label>JSON files upload (Optional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".json,application/json"
                    onChange={handleJsonfile}
                    multiple // Allow multiple file selection
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Input your price</Form.Label>
                  <Form.Control
                    type="text"
                    value={price}
                    id="create-price"
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
                  <InputLabel id="simple-select-label">Property Type</InputLabel>
                    <Select
                        labelId="elect-prop-type-label"
                        id="select-prop-type"
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
                  <InputLabel id="simple-select-label2">The amount of bathrooms</InputLabel>
                    <Select
                        labelId="select-bathroom-label"
                        id="select-bathroom"
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
                      <Button id="increase-doubed"onClick={() => setDoubleBedrooms(doubleBedrooms + 1)}>+</Button>
                      <BedroomParentIcon></BedroomParentIcon>
                      <Button onClick={() => doubleBedrooms > 0 && setDoubleBedrooms(doubleBedrooms - 1)}>-</Button>
                  </div>
                  <div>
                      <Typography>Single Bed Bedrooms: {singleBedrooms}</Typography>
                      <Button id="increase-sinbed" onClick={() => setSingleBedrooms(singleBedrooms + 1)}>+</Button>
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

                <Button type="submit" className="btn btn-primary form-submit">
                  Submit
                </Button>
                <Link to="/hosted-listings" className="hosted-listings-link">
                <Button className="btn btn-primary">
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

export default CreateCard;
