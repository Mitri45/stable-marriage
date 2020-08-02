import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/Layout"
import { graphql, Link } from 'gatsby'
import reorderImg from "../images/reorder.svg"
import userAvatar from "../images/userAvatar.png"
import { ReactSortable } from "react-sortablejs";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";

// Styles section with styled-components library (initial adaptation for mobile)

const Container = styled.div`
    max-width: 500px;
    margin: 1em auto;
`
const StyledHeader = styled.h1`
    text-align: center;
    font-size: 1.5rem;
`
const CardsWrapper = styled(ReactSortable)`
    display: flex;
    flex-flow: column nowrap;
    width: 90%;
    margin: 0 auto;
`
const UserCard = styled.div`
    max-height: 100px;
    min-width: 360px;
    border: 1px solid #EEEEEE;
    box-shadow: 4px 3px 3px 0px rgb(28 27 33 / 55%);
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1em;
    padding: 1em 0;
    background-color: white;

    &.sortable-swap-highlight {
      background-color: #f9c7c8;
    }

    &:hover {
      cursor: move;
      cursor: -webkit-grabbing;
    }
`
const StyledImg = styled.img`
    width: 90px;
    height: 90px;
    border-radius: 50%;
    flex: 0 0 auto;
    border: solid 1px #cec4c4;
`
const UserName = styled.h2`
    max-width: 150px;
    flex: 1 1 auto;
    font-size: 1.2rem;
    margin: 0 1em;
    overflow-wrap: break-word;
    hyphens: auto;
`
const Hamburger = styled.img`
    max-width: 50px;
    min-width: 25px;
    height: 100%
`
const UserRating = styled.div`
    flex: 0 1 auto;
    margin: 0 1em;

    & p {
      font-size: 1.5em;
      color: red;
    }
`

// User list component accept location object with state info about current user and data from GraphQL query
export default function UserList({ location, data }) {

// Push data from GraphQL query to userData array according to current user state - mentor or mentee
  let userData = []
  let currentUser = location.state.validUser
  if (currentUser.userType === "mentor") {
    data.mentees.edges.map(el => userData.push(el.node))
  } else {
    data.mentors.edges.map(el => userData.push(el.node))
  }

// Make this function stateful with React useState hook
// If current user already have changed something in ranking list this info should be
// in local storage. So we take it and make it our initial state by converting it to the object,
// otherwise use data from GraphQL initial query
const [state, setState] = useState(() => {
  if (localStorage.getItem(`${currentUser.userType}`)) {
    const localData = JSON.parse(localStorage.getItem(`${currentUser.userType}`))
    const localDataToObject = localData.map(el => Object.fromEntries(el))
    return localDataToObject
  } else {
  return userData
}
})

//Using React useEffect hook with empty array as second param to store
// users data from GraphQL query on initial render if there are no data in local storage
useEffect(() => {
    if (!localStorage.getItem(`${currentUser.userType}`)) {
      let userDataToStore = []
      userData.forEach(el => {
      userDataToStore.push([["id", el.id], ["name", el.name], ["surname", el.surname], ["photo", el.photo]])
      })
      localStorage.setItem(`${currentUser.userType}`, JSON.stringify(userDataToStore))
    }
  }, [])

//Every time moving/dragging triggered in the list - save current order to local storage
  const sortEvent = (el) => {
    let sortUserDataToStore = [];
      state.forEach(el => {
        sortUserDataToStore.push([["id", el.id], ["name", el.name], ["surname", el.surname], ["photo", el.photo]])
      })
      localStorage.setItem(`${currentUser.userType}`, JSON.stringify(sortUserDataToStore))

  }

// When we going back to first screen delete all data in local storage to prevent redirect 
  const wipeCurrentUserDetails = () => {
    localStorage.removeItem('validUser')
    localStorage.removeItem('mentee')
    localStorage.removeItem('mentor')
  }

// TODO - organizing and submitting results of raking to somewhere
const submitResults = () => {

}
  return (
    <Layout>
      <Container>
        <StyledHeader>Hi, {capitalizeFirstLetter(currentUser.name)}! Please rate this {(currentUser.userType === "mentor") ? 'mentees' : 'mentors' }</StyledHeader>
        <CardsWrapper
        tag="div"
        list={state}
        setList={setState}
        onSort={sortEvent}
        animation={200}
        easing="cubic-bezier(1, 0, 0, 1)">
          {state.map((item, index) => (
            <UserCard key={item.id}>
              <UserRating>
                <p className="user-rating">{index + 1}</p>
              </UserRating>
              {item.photo === "" ? <StyledImg src={userAvatar} alt="User avatar" /> : <StyledImg src={item.photo} alt="User avatar" />}
              <UserName>{`${capitalizeFirstLetter(item.name)} ${capitalizeFirstLetter(item.surname)}`}</UserName>
              <Hamburger src={reorderImg} alt="reorderList" />
            </UserCard>
          ))}
        </CardsWrapper>
        <Link to='/' style={{ fontSize:"1.3em"}} onClick={wipeCurrentUserDetails}>Start from the beginning</Link>
        <button type="button" style={{ display:"block", margin:'1em 0', padding: '1em'}} onClick={submitResults}>Submit ranking results</button>
      </Container>
    </Layout>
  )
}


// Initial GraphQL query of data from JSON files
export const pageQuery = graphql`
        query {
          mentees: allMenteesJson {
            edges {
              node {
                id
                photo: A_recent_photo_of_yourself
                name: First_Name
                surname: Last_Name
              }
            }
          }
          mentors: allMentorsJson {
            edges {
              node {
                id
                photo: A_recent_photo_of_yourself
                name: First_Name
                surname: Last_Name
              }
            }
          }
        }
`