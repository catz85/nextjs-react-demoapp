import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { Container, Row, Col } from 'react-bootstrap';
import PropTypes from "prop-types";
import withSession from "../../lib/session";
import db from '../../lib/fakeDb';
import axios from 'axios';
import { generatePhotoUrl } from '../../lib/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from 'react-query'


const PageId = ({ photo }) => {
    const [favoriteMutation] = useMutation(imageId => axios.put(`/api/favorite?imageId=${imageId}`))
    const [unFavoriteMutation] = useMutation(imageId => axios.delete(`/api/favorite?imageId=${imageId}`))
    const [hasMounted, setHasMounted] = React.useState(false);
    
    const [favoriteHandler, setFavoriteHandler] = useState(photo.favorite);
    // const [photoState, setPhotoState] = useState(Object.assign({},photo));
    const favorite = (imageId) => {
        if (favoriteHandler) return;
        favoriteMutation(imageId,
            {
                onSuccess: (response, variables) => {
                    // setPhotoState({ favorite: true })
                    setFavoriteHandler(true);
                },
                onError: (err, variables) => {
                    console.log(err)

                }
            })
    }

    const unFavorite = (imageId) => {
        if (!favoriteHandler) return;
        unFavoriteMutation(imageId,
            {
                onSuccess: (response, variables) => {
                    // setPhotoState({ favorite: false })
                    setFavoriteHandler(false);
                },
                onError: (err, variables) => {
                    console.log(err)
                }
            })
    }
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    return (
        <Container fluid>
            <Row>
                <Col style={{
                    backgroundImage: `url(${photo.url})`,
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    height: '300px'
                }}>
                </Col>
                <Col>
                    <p className='phototitleblack'>
                        {photo.title}
                    </p>
                    {
                        favoriteHandler ?
                            <FontAwesomeIcon onClick={(e) => { e.stopPropagation(); unFavorite(photo.imageId); }} className="phototitleblack" icon={["fas", "heart"]} /> :
                            <FontAwesomeIcon className="phototitleblack" onClick={(e) => { e.stopPropagation(); favorite(photo.imageId) }} icon={["far", "heart"]} />
                    }
                </Col>
            </Row>
        </Container>
    );
}
export default PageId;

export const getServerSideProps = withSession(async function ({ req, res, params }) {
    const user = req.session.get("user");
    console.log(params, user)
    if (user === undefined) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return { props: {} };
    }
    if (isNaN(+params.id)) {
        res.setHeader("location", "/photos");
        res.statusCode = 302;
        res.end();
        return { props: {} };
    }
    return {
        props: {
            user: req.session.get("user"),
            photo: {
                albumId: Math.floor(+params.id / 10),
                title: 'Photo ' + params.id,
                url: generatePhotoUrl(+params.id, 600),
                thumbnailUrl: generatePhotoUrl(+params.id, 100),
                imageId: +params.id,
                favorite: !!db[+params.id]
            }
        },
    };
});