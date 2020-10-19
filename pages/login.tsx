import React, { useState, FormEvent } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Credentials } from '../types'
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from "styled-components";
import withSession from "../lib/session";
import PropTypes from "prop-types";
import useUser from "../lib/useUser";
import fetchJson from "../lib/fetchJson";
const MyContainer = styled.div`
        height: auto;
        width: 90%;
        margin: 5em auto;
        color: snow;
        @media(min-width: 786px) {
            width: 60%;
        }

        label {
            color: #24B9B6;
            font-size: 1.2em;
            font-weight: 400;
        }

        h1 {
            color: #24B9B6;
            padding-top: .5em;
        }

        .form-group {
            margin-bottom: 2.5em;
        }

        .error {
            border: 2px solid #FF6565;
        }

        .error-message {
            color: #FF6565;
            padding: .5em .2em;
            height: 1em;
            position: absolute;
            font-size: .8em;
        }
    `;

const MyForm = styled(Form)`
        width: 90%;
        text-align: left;
        padding-top: 2em;
        padding-bottom: 2em;

        @media(min-width: 786px) {
            width: 50%;
        }
    `;

const MyButton = styled(Button)`
        background: #1863AB;
        border: none;
        font-size: 1.2em;
        font-weight: 400;

        &:hover {
            background: #1D3461;
        }
    `;
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("*Must be a valid email address")
    .max(100, "*Email must be less than 100 characters")
    .required("*Email is required"),
  password: Yup.string()
    .required('No password provided.')
});


const SignIn = ({referer}) => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { mutateUser } = useUser({
    redirectTo: referer,
    redirectIfFound: true,
  });
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
 
  const formikOnSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    setSubmitting(true);
    try {
      await mutateUser(
        fetchJson("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }),
      );
    } catch (error) {
      setErrors({ 'email': error.data.message, 'password': error.data.message })
    } finally {
      setSubmitting(false);
    }
  }
  const formikInitialValuse = { email: "", password: ""}
  return (
    <Container fluid>
      <Row>
        <Col>
          <MyContainer>
            <Formik initialValues={formikInitialValuse}
                    validationSchema={validationSchema}
                    onSubmit={formikOnSubmit}>
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <MyForm onSubmit={handleSubmit} className="mx-auto">
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email :</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Email:test@test.pl"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className={touched.email && errors.email ? "error" : null}
                    />
                    {touched.email && errors.email ? (
                      <div className="error-message">{errors.email}</div>
                    ) : null}
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password :</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Password:test"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className={touched.password && errors.password ? "error" : null}
                    />
                    {touched.password && errors.password ? (
                      <div className="error-message">{errors.password}</div>
                    ) : null}
                  </Form.Group>
                  <MyButton variant="primary" type="submit" disabled={isSubmitting}>
                    Submit
                  </MyButton>
                </MyForm>
              )}
            </Formik>
          </MyContainer>
        </Col>
      </Row>
    </Container>
  )
};
export default SignIn;

export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get("user");
    const referer = req.headers.referer || "/"; // in real world app we need to check referer and remove foreign url

    if (user) {
      res.setHeader("location", "/");
      res.statusCode = 302;
      res.end();
      return { props: {user, referer} };
    }
    return {
      props: {referer}
    };
  });
  
  
  SignIn.propTypes = {
    user: PropTypes.shape({
      isLoggedIn: PropTypes.bool,
      login: PropTypes.string,
      email: PropTypes.string
    }),
  };