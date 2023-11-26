import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const clickToBackHandler = () => {
    navigate('/');
  };

  const [userField, setUserField] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [passwordErrors, setPasswordErrors] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const result = await axios.get(`http://127.0.0.1:5000/userdetails/${id}`);
      setUserField(result.data);
    } catch (err) {
      console.log('Something Wrong');
    }
  };

  const validatePassword = (password) => {
    const isValidPassword = isStrongPassword(password);
    setPasswordErrors(isValidPassword ? '' : 'Password is invalid. Please check the requirements.');
  };

  const isStrongPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,12}$/;
    return regex.test(password);
  };

  const changeUserFieldHandler = (e) => {
    const { name, value } = e.target;
    setUserField((prevUserField) => ({
      ...prevUserField,
      [name]: value,
    }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const onSubmitChange = async (e) => {
    e.preventDefault();

    if (passwordErrors) {
      alert('Invalid input. Please check the form for errors.');
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:5000/userupdate/${id}`, userField);
      navigate('/');
    } catch (err) {
      console.log('Something Wrong');
    }
  };

  return (
    <div className="container">
      <h1>Edit Form</h1>
      <form>
        <div className="mb-3 mt-3">
          <label className="form-label"> ID:</label>
          <input type="text" className="form-control" id="id" name="id" value={id} disabled />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label"> Full Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Your Full Name"
            name="name"
            value={userField.name}
            onChange={(e) => changeUserFieldHandler(e)}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            name="email"
            value={userField.email}
            onChange={(e) => changeUserFieldHandler(e)}
          />
        </div>
        <div className="mb-3 mt-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            name="password"
            onChange={(e) => changeUserFieldHandler(e)}
          />
          {passwordErrors && <div className="text-danger">{passwordErrors}</div>}
        </div>
        <button type="submit" className="btn btn-primary" onClick={(e) => onSubmitChange(e)}>
          Update
        </button>
      </form>
      <br />
      <div className="container d-flex justify-content-center">
        <button className="btn btn-primary" onClick={clickToBackHandler}>
          Back To Home
        </button>
      </div>
    </div>
  );
};

export default Edit;
