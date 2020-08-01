import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/Layout"
import Img from "gatsby-image"
import { graphql, Link } from 'gatsby'
import reorderImg from "../images/reorder-black-18dp.svg"
import { ReactSortable } from "react-sortablejs";


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

export default function UserList({ location, data }) {

  let userData = []
  let currentUser = location.state.validUser
  console.log (currentUser)
  if (currentUser.userType === "mentor") {
    data.mentees.edges.map(el => userData.push(el.node))
  } else {
    data.mentors.edges.map(el => userData.push(el.node))
  }
console.log(userData)
const [state, setState] = useState(() => {
  if (localStorage.getItem(`${currentUser.userType}`)) {
    const localData = JSON.parse(localStorage.getItem(`${currentUser.userType}`))
    const localDataToObject = localData.map(el => Object.fromEntries(el))
    return localDataToObject
  } else {
  return userData
}
})

useEffect(() => {
    if (!localStorage.getItem(`${currentUser.userType}`)) {
      let userDataToStore = []
      userData.forEach(el => {
      userDataToStore.push([["id", el.id], ["name", el.name], ["surname", el.surname], ["photo", el.photo]])
      })
      localStorage.setItem(`${currentUser.userType}`, JSON.stringify(userDataToStore))
    } else {
      let localStorageData = localStorage.getItem(`${currentUser.userType}`)
      let localStorageDataConverted = JSON.parse(localStorageData)
    }
  })


  const sortEvent = (el) => {
    let sortUserDataToStore = [];
      state.forEach(el => {
        sortUserDataToStore.push([["id", el.id], ["name", el.name], ["surname", el.surname], ["photo", el.photo]])
      })
      localStorage.setItem(`${currentUser.userType}`, JSON.stringify(sortUserDataToStore))

  }

  return (
    <Layout>
      <StyledHeader>Hi, {currentUser.name}! Please rate this {(currentUser.userType === "mentor") ? 'mentees' : 'mentors' }</StyledHeader>
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
          <StyledImg src={item.photo} alt="User avatar" />
          <UserName>{`${item.name} ${item.surname}`}</UserName>
          <Hamburger src={reorderImg} alt="reorderList" />
        </UserCard>
        ))}
      </CardsWrapper>
      <Link to='/'> Back</Link>
    </Layout>
  )
}

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