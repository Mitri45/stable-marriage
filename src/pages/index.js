import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/Layout"
import { Link, navigate, useStaticQuery, graphql } from 'gatsby'
import { authenticateUser } from "../utils/userAuthenticate"

//Styles for the page

const StyledHeader = styled.h1`
    text-align: center;
    font-size: 1.5rem;
`


export default function Home() {

  const [userEmail, setUserEmail] = useState('')
  const [user, setUser] = useState({mentor: ''})
console.log(userEmail);

// onClick event handler that stores user role to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('userRole', JSON.stringify({mentor: true}))
  }

// If user role is in localStorage redirect to ranking page
  useEffect(() => {
    if (localStorage.getItem('userRole')) {
      const userRole = JSON.parse(localStorage.getItem('userRole'))
      navigate("/ranking",
      {
        state: { userRole },
      })
    }
  });

const handleSubmit = e => {
  e.preventDefault()
  const processedEmail = userEmail.trim().toLocaleLowerCase()
  console.log(processedEmail)
  const validUser = authenticateUser(processedEmail, userAuthData)
  if (validUser) {
    navigate("/ranking",
    {
      state: { validUser },
    })
  } else {
    document.getElementById("userNotFound").innerText = "User not found"
  }
}

const userAuthData = useStaticQuery(graphql`
query {
    mentees: allMenteesJson {
        edges {
        node {
            id
            email: Email
            name: First_Name
            }
        }
    }
    mentors: allMentorsJson {
        edges {
            node {
            id
            name: First_Name
            email: Email
            }
        }
    }
}
`)

  return (
    <Layout>
      <StyledHeader>Hello world!</StyledHeader>
      <Link
      to={'/ranking'}
      state={{mentor: true}}
      onClick={saveToLocalStorage}>
        I am mentee
      </Link> <br/>
      <Link
      to={'/ranking'}
      state={{mentor: false}}
      onClick={saveToLocalStorage}>
        I am mentor
      </Link> <br/>
      <form onSubmit={handleSubmit}>
      <label>Please identify yourself with your email address, that you used for register to this event:
      <input
      type="email"
      id="email"
      required
      value={userEmail}
      onChange={e => setUserEmail(e.target.value)}
      />
      </label>
        <button type="submit">Submit</button>
      </form>
      <div id="userNotFound"></div>

    </Layout>
  )
}

