import React, { useState } from 'react';
import List from './List';
import axios from 'axios';
import SearchBar from './SearchBar';
import validator from 'validator';

const Home = () => {
  const [userField, setUserField] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState('');
  const [nameError, setNameError] = useState('');

  const changeUserFieldHandler = (e) => {
    setUserField({
      ...userField,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'name') {
      validateName(e.target.value);
    } else if (e.target.name === 'password') {
      validatePassword(e.target.value);
    }
  };

  const validateName = (name) => {
    setNameError(name ? '' : 'Name cannot be empty.');
  };

  const validatePassword = (password) => {
    const isValidPassword = isStrongPassword(password);
    setPasswordErrors(isValidPassword ? '' : 'Password is invalid. Please check the requirements.');
  };

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,12}$/;
    return regex.test(password);
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();

    if (!userField.name || !validateEmail(userField.email) || passwordErrors) {
      alert('Invalid input. Please check the form for errors.');
      return;
    }

   
    try {
      const response = await axios.post('http://127.0.0.1:5000/newuser', userField);
      setLoading(true);
    } catch (err) {
      console.log('Something Wrong');
    }
  };

  const handleSearchResult = (userId) => {
    setSearchResult(userId);
  };

  if (loading) {
    return <Home />;
  }

  return (
    <div className="container">
      <h2 className='w-100 d-flex justify-content-center p-3'>User Management REACTJS FLASK REST API CRUD Axios Mysql</h2>
      <div className='row'>
        <div className='col-md-4'>
          <h3>Add Your Detail</h3>
          <form>
            <div className="mb-3 mt-3">
              <label className="form-label"> Full Name:</label>
              <input type="text" className="form-control" id="name" placeholder="Enter Your Full Name" name="name" onChange={e => changeUserFieldHandler(e)} required/>
              {nameError && <div className="text-danger">{nameError}</div>}
            </div>
            <div className="mb-3 mt-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" onChange={e => changeUserFieldHandler(e)} required />
            </div>
            <div className="mb-3 mt-3">
              <label className="form-label">Password:</label>
              <input type="password" className="form-control" id="password" placeholder="Enter password" name="password" onChange={e => changeUserFieldHandler(e)} required />
              {passwordErrors && <div className="text-danger">{passwordErrors}</div>}
              {passwordErrors && <div className="text-muted mt-2">{getPasswordRequirements()}</div>}
            </div>

            <button type="submit" className="btn btn-primary" onClick={e => onSubmitChange(e)}>Add User</button>
          </form><br /><br />
          <SearchBar handleSearchResult={handleSearchResult} />
        </div>
        <div className='col-md-8'>
          <List />
        </div>
      </div>
    </div>
  );
};

export default Home;

const getPasswordRequirements = () => {
  return `
    Password Requirements:
    - At least one lowercase letter
    - At least one uppercase letter
    - At least one digit
    - At least one special character
    - Length between 5 and 12 characters
  `;
};
