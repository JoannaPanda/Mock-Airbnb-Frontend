import React from 'react';
import { AppBar, Toolbar, Typography, Slider } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { BackendUrl } from './BackendUrl';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
const useStyles = makeStyles((theme) => ({
  activeLink: {
    backgroundColor: 'grey',
    color: 'inherit',
  },
  regularLink: {
    backgroundColor: 'transparent',
    color: 'inherit',
  }
}));
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Header () {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [text, setText] = React.useState('');
  const [price, setPrice] = React.useState([1, 9999]);
  const [priceCheck, setPriceCheck] = React.useState(false);
  const [bedrooms, setBedrooms] = React.useState([1, 10]);
  const [bedroomsCheck, setBedroomsCheck] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [dateCheck, setDateCheck] = React.useState(false);
  const [ranking, setRanking] = React.useState('default');
  const [rankingCheck, setRankingCheck] = React.useState(false);
  const minDistancePrice = 100;
  const minDistance = 1;

  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search', { state: { text, price, priceCheck, bedrooms, bedroomsCheck, startDate, endDate, dateCheck, ranking, rankingCheck } });
  };

  function handleText (event) {
    setText(event.target.value)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  function handleStartDateChange (event) {
    setStartDate(event.target.value);
    setDateCheck(true);
  }
  function handleEndDateChange (event) {
    const startISO = startDate ? new Date(startDate).toISOString() : null;
    const endISO = event.target.value ? new Date(event.target.value).toISOString() : null;

    if (new Date(endISO) >= new Date(startISO)) {
      setEndDate(event.target.value);
      setDateCheck(true);
    } else {
      alert('The end date must be after the start date!');
    }
  }

  function handleRanking (event) {
    setRanking(event.target.value);
    setRankingCheck(true);
  }
  const handlePriceRange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPrice([Math.min(newValue[0], price[1] - minDistancePrice), price[1]]);
      setPriceCheck(true);
    } else {
      setPrice([price[0], Math.max(newValue[1], price[0] + minDistancePrice)]);
      setPriceCheck(true);
    }
  };

  const handleBedrooms = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setBedrooms([clamped, clamped + minDistance]);
        setBedroomsCheck(true);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setBedrooms([clamped - minDistance, clamped]);
        setBedroomsCheck(true);
      }
    } else {
      setBedrooms(newValue);
      setBedroomsCheck(true);
    }
  };
  function handleReset (newValue) {
    setDateCheck(false);
    setRankingCheck(false);
    setPriceCheck(false);
    setBedroomsCheck(false);
    setPrice([1, 9999]);
    setBedrooms([1, 10]);
    setRanking('default');
    setStartDate('');
    setEndDate('')
  }
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const classes = useStyles();

  const handleLogout = () => {
    const token = localStorage.getItem('token');

    // call API to log out the user
    fetch(`${BackendUrl}/user/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          // remove token
          localStorage.removeItem('token');
          localStorage.removeItem('userinfo');

          // redirect to the login page
          window.location.href = '/login';
        }
      })
      .catch((error) => console.log(error));
  };

  const handleLogin = () => {
    // redirect to the login page
    window.location.href = '/login';
  };

  const isUserActive = !!localStorage.getItem('token');

  return (
    <AppBar position="static">
      <Toolbar>
        <img
          src={require('../assets/logo2.png')}
          alt="Logo"
          width="auto"
          height="50"
        />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Airbrb
        </Typography>
        <Search>
        <Button className="search-link" onClick={handleSearchClick}>
          <SearchIcon />
        </Button>
        <StyledInputBase
          value={text}
          onChange={handleText}
          onKeyDown ={(event) => {
            if (event.key === 'Enter') {
              handleSearchClick();
            }
          }}
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
        />
        <AlignHorizontalRightIcon aria-describedby={id} variant="contained" onClick={handleClick} />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          onKeyDown ={(event) => {
            if (event.key === 'Enter') {
              handleSearchClick();
            }
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            width: '90%',
            maxWidth: '100%',
          }}
        >
          <Typography sx={{ p: 2 }}>
          <label>Select the Price range.</label>
            <Slider
            getAriaLabel={() => 'Minimum distance'}
            value={price}
            onChange={handlePriceRange}
            valueLabelDisplay="auto"
            step={1}
            max = {9999}
            valueLabelFormat={(value) => `$${value}`}
            disableSwap
            />
          <label>select the bedrooms range</label>
          <Slider
            getAriaLabel={() => 'Minimum distance shift'}
            value={bedrooms}
            min = {1}
            step={1}
            max = {10}
            onChange={handleBedrooms}
            valueLabelDisplay="auto"
            disableSwap
          />
          <TextField
            type="date"
            value={startDate}
            onChange={handleStartDateChange}

          />
          <TextField
            type="date"
            value={endDate}
            onChange={handleEndDateChange}

          />
            <label>select the sort</label>
          <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={ranking}
                        label="bathrooms"
                        defaultValue={'default'}
                        onChange={handleRanking}
                        sx={{ width: '30%' }}
                    >
                        <MenuItem value={'default'}>default</MenuItem>
                        <MenuItem value={'high to low'}>high to low (by review score)</MenuItem>
                        <MenuItem value={'low to high'}>low to high (by review score)</MenuItem>
          </Select>
          <Button onClick={handleReset}>RESET</Button>
          </Typography>
        </Popover>
      </Search>
        <NavLink
          to="/home"
          className={`nav-link ${useLocation().pathname === '/home' ? classes.activeLink : classes.regularLink}`}
        >
          All Listings
        </NavLink>

        <NavLink
          to="/hosted-listings"
          className={`nav-link ${useLocation().pathname === '/hosted-listings' ? classes.activeLink : classes.regularLink}`}
        >
          Hosted Listings
        </NavLink>
        {isUserActive
          ? (
          <button className="btn btn-secondary logout" onClick={handleLogout}>
            Logout
          </button>
            )
          : (
          // Show "Login" button if the user is not active
          <button className="btn btn-info" onClick={handleLogin}>
            Login
          </button>
            )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
