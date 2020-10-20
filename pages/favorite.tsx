import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from "next/router";

import { ImagePost } from '../types'
import { useInfiniteQuery, useMutation } from 'react-query'
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import withSession from "../lib/session";

function Photos() {

  const router = useRouter()

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingMore,
    fetchMore,
    canFetchMore,
  } = useInfiniteQuery('photos',
    async (key, nextId = 0) => {
      console.log('useInfiniteQuery', key, nextId)
      const { data } = await axios.post('/api/favorite?page=' + nextId)
      return data
    },
    {
      getFetchMore: (lastGroup) => {
        console.log('lastGroup', lastGroup)
        return lastGroup.nextId
      },
    }
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [favoriteState, setFavoriteState] = useState([])
  const [favoriteMutation] = useMutation(imageId => axios.put(`/api/favorite?imageId=${imageId}`))
  const [unFavoriteMutation] = useMutation(imageId => axios.delete(`/api/favorite?imageId=${imageId}`))
  const [grid, setGrid] = useState(typeof localStorage !== "undefined" && !!+localStorage.getItem('grid'))
  const [intersect, setIntersect] = useState(false)
  const [favoriteHandler,setFavoriteHandler] = useState({})
  const loadMoreButtonRef = React.useRef()
  const favorite = (imageId, page) => {
    if (favoriteHandler[imageId]) return;
    const update = {}
    update[imageId] = true
    setFavoriteHandler(update);
    favoriteMutation(imageId,
      {
        onSuccess: (response, variables) => {
          update[imageId] = false
          setFavoriteHandler(update);
          const imageIndex = data[page].data.findIndex((el)=>{if (el.imageId==imageId) {return true} else {return false}})
          console.log('ImageIndex', imageIndex)
          data[page].data[imageIndex].favorite = true
          setFavoriteState(data.reduce((prev, next)=> {
            return prev.concat(next.data.map((el)=>{return el.favorite}))
          },[]))
        },
        onError: (err, variables) => {
          console.log(err)
          update[imageId] = false
          setFavoriteHandler(update);
        }
      })
  }

  const unFavorite = (imageId, page) => {
    if (favoriteHandler[imageId]) return;
    const update = {}
    update[imageId] = true
    unFavoriteMutation(imageId,
      {
        onSuccess: (response, variables) => {
          update[imageId] = false
          setFavoriteHandler(update);
          const imageIndex = data[page].data.findIndex((el)=>{if (el.imageId==imageId) {return true} else {return false}})
          console.log('ImageIndex', imageIndex)
          data[page].data[imageIndex].favorite = false
          setFavoriteState(data.reduce((prev, next)=> {
            return prev.concat(next.data.map((el)=>{return el.favorite}))
          },[]))
        },
        onError: (err, variables) => {
          update[imageId] = false
          setFavoriteHandler(update);
        }
      })
  }
  useIntersectionObserver({
    target: loadMoreButtonRef,
    root: null,
    onIntersect: fetchMore,
    enabled: intersect && canFetchMore,
  })
  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  const setGridFn = (grid:boolean) => {
    setGrid(grid);
    localStorage.setItem('grid', grid ? '1' : '0');
  }
  return (
    <>
      <Container>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : status === 'error' ? (
          <>
            <span>Error try later</span>
          </>
        ) : (
              <>
                <p></p>
                <div>
                <Row>
                <Col >
                  <Button onClick={() => setGridFn(!grid)}>{grid ? 'List View' : 'Grid View'}</Button>
                  {' '}
                  <Button onClick={() => setIntersect(!intersect)}>{intersect ? 'Dont load on scroll' : 'Load on scroll'}</Button>
                </Col>
                  {' '}
                  <Col >
                  <Form.Control type="text"
                      name="searchterm"
                      placeholder="Search by title"
                      onChange={handleSearchTermChange}
                      onBlur={handleSearchTermChange}
                      value={searchTerm} />
                    </Col>  
                  </Row>
                </div>
                <p></p>
                <Row>
                  {data.map((page: any, i: number) => (
                    <React.Fragment key={`page-${i}`}>
                      {page.data.map((photo: { id: number; title: string; url: string; favorite: boolean; imageId: number; }) => (
                          photo.title.includes(searchTerm) ? 
                          <Col className={grid ? 'gridview' : 'listview'} style={{
                            backgroundImage: `url(${photo.url})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover'
                          }} onClick={() => { router.push(`/photos/${photo.imageId}`) }} key={`grid-${photo.imageId}`}>
                            <p className='phototitle' key={`image-${photo.imageId}`}>
                              {photo.title}
                            </p>
                            {
                              photo.favorite ? <FontAwesomeIcon key={`hearts-${photo.imageId}`} onClick={(e)=>{e.stopPropagation(); unFavorite(photo.imageId, i);}} className="heartfavorite" icon={["fas", "heart"]} /> : <FontAwesomeIcon key={`heartr-${photo.imageId}`} className="heartfavorite" onClick={(e)=>{e.stopPropagation(); favorite(photo.imageId, i)}} icon={["far", "heart"]} />
                            }
                          </Col>
                           : null
                      ))}
                    </React.Fragment>
                  ))}
                </Row>
                <div>
                  <p></p>
                  <Button
                    ref={loadMoreButtonRef}
                    onClick={() => fetchMore()}
                  >
                    {isFetchingMore
                      ? 'Loading more...'
                      : canFetchMore
                        ? 'Load More'
                        : 'Nothing more to load'}
                  </Button>
                </div>
              </>
            )}
      </Container>

    </>
  );
}
export default Photos;

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