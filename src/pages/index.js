import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import { navigate, useStaticQuery, graphql } from 'gatsby'
import { authenticateUser } from "../utils/userAuthenticate"

//Styles for the page 
const Container = styled.div`
    max-width: 80%;
    margin: 10em auto;
`

//Main page component
export default function Home() {

  const [userEmail, setUserEmail] = useState('')

// If user role already is in localStorage redirect to ranking page to continue ranking
// redirect also pass current user info inside location object
  useEffect(() => {
    if (localStorage.getItem('validUser')) {
      const validUser = JSON.parse(localStorage.getItem('validUser'))
      console.log(validUser)
      navigate("/ranking",
      {
        state: { validUser },
      })
    }
  });

// Pass entered email into helper function, if email in the JSON with users data
// return object with current user data and pass it with redirect to ranking page, otherwise trigger error
const handleSubmit = e => {
  e.preventDefault()
  const processedEmail = userEmail.trim().toLocaleLowerCase()
  const validUser = authenticateUser(processedEmail, userAuthData)
  if (validUser) {
    localStorage.setItem('validUser', JSON.stringify(validUser))
    navigate("/ranking",
    {
      state: { validUser },
    })
  } else {
    document.getElementById("userNotFound").innerText = "Please, check the spelling and try once again"
  }
}

//Query data for searching among that data entered email
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
      <Container>
      <form onSubmit={handleSubmit}>
      <label>Please identify yourself with your email address, that you used for register to this event:<br/>
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
      </Container>
    </Layout>
  )
}

