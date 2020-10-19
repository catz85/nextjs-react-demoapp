import Head from 'next/head';
import Link from 'next/link';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from "prop-types";
import withSession from "../lib/session";


const Home = ({user}) => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>Awesome Test Application</h2>
        </Col>
      </Row>
    </Container>
  );
}
export default Home;

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }
  return {
    props: { user: req.session.get("user") },
  };
});


Home.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    login: PropTypes.string,
    email: PropTypes.string
  }),
};