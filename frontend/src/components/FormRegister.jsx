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
function FormRegister () {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name === '') {
      toast.error('Invalid username.', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (!validator.isEmail(email)) {
      toast.error('Invalid email address.', {
        position: 'bottom-left',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      toast.error('Your password is not a strong password. When setting your password, ensure it is at least 8 characters long, includes at least one uppercase letter, one number, and one symbol for enhanced security.', {
        position: 'bottom-left',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      // Check if passwords match
      toast.error('Passwords do not match.', {
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
      name,
    };

    fetch(`${BackendUrl}/user/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Registration failed: ' + response.status);
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

        toast.success('Registration Successful!', {
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
        toast.error('Registration failed: please try agian', {
          position: 'bottom-left',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
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
            <h2>Create your account</h2>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                id="username"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="Password_input" >Password (Please enter a strong password)</Form.Label>
              <Form.Control
                id="Password_input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="confirm psw">Confirm Password</Form.Label>
              <Form.Control
                id="confirm psw"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-enter your password"
              />
            </Form.Group>
            <Button type="submit" className="btn btn-primary form-submit">
              Sign Up
            </Button>
            <Link to="/login" className="login-link">
              Already Registered? Back to login
            </Link>
          </Form>
        </Grid>
      </Grid>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default FormRegister;
