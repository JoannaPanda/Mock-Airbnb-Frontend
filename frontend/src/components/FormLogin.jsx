import React, { useState } from 'react';
import validator from 'validator';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BackendUrl } from './BackendUrl';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

function FormLogin () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validator.isEmail(email)) {
      toast.error('Invalid email address.', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    const params = {
      email,
      password,
    };

    fetch(`${BackendUrl}/user/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Login failed: ' + response.status);
        }
        return response.text();
      })
      .then((data) => {
        if (data.length === 0) {
          throw new Error('Empty response data');
        }
        const jsonData = JSON.parse(data);

        localStorage.setItem('token', String(jsonData.token));
        localStorage.setItem('userinfo', JSON.stringify(params));

        toast.success('Login Successful!', {
          position: 'bottom-left',
          autoClose: 100,
          hideProgressBar: false,
          closeOnClick: true,
          onClose: () => {
            window.location.href = '/home';
          },
        });
      })
      .catch(() => {
        toast.error('Login failed: please try again', {
          position: 'bottom-left',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  return (
    <div className="login-form">
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Form onSubmit={handleSubmit}>
              <h2>Login to your account</h2>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="emailInput">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="emailInput"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="passwordInput">Password</Form.Label>
                <Form.Control
                  id = "passwordInput"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                />
              </Form.Group>
              <Button type="submit" className="btn btn-primary form-submit">
                Login
              </Button>
              <Link to="/register" className="register-link">
                Not Registered? Sign Up
              </Link>
            </Form>
          </Grid>
        </Grid>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default FormLogin;
