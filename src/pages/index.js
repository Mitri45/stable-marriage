import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import { navigate, useStaticQuery, graphql } from 'gatsby'
import { authenticateUser } from "../utils/userAuthenticate"

//Styles for the page 
const Container = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.3em;
`

//Main page component
export default function Home() {

  const [userEmail, setUserEmail] = useState('')

// If user role already is in localStorage redirect to ranking page to continue ranking
// redirect also pass current user info inside location object
  useEffect(() => {
    if (localStorage.getItem('validUser')) {
      navigate("/ranking")
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
    navigate("/ranking")
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
      <form onSubmit={handleSubmit} >
      <label>Please identify yourself with your email address, that you used for register to this event: <br />
      <input
      name="email"
      type="email"
      id="email"
      required
      value={userEmail}
      onChange={e => setUserEmail(e.target.value)}
      style={{ fontSize:"1.3rem", padding:"1rem", marginTop:"1rem" }}
      />
      </label>
        <button type="submit" style={{ fontSize:"1.3rem", padding:"1rem"}}>Submit</button>
        <span id="userNotFound" style={{ marginLeft:"1rem", fontStyle:"italic", color:"white"}}></span>
      </form>
      </Container>
    </Layout>
  )
}

