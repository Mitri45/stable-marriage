import React, { useState } from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import Img from "gatsby-image"
import { graphql } from 'gatsby'
import reorderImg from "../images/reorder-black-18dp.svg"
import { ReactSortable, Swap, Sortable  } from "react-sortablejs";

Sortable.mount(new Swap());

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
    border: 1px solid #EEEEEE;
    box-shadow: 4px 3px 3px 0px rgba(178,174,193,0.71);
    
    display: grid;
    grid-template-areas:"avatar name name" 
                        "avatar title rating";
    grid-template-rows: 50px 50px;
    grid-template-columns: 110px 1fr 0.8fr;
    justify-items: start;
    align-items: start;
    margin-bottom: 1em;

    &.sortable-swap-highlight {
      background-color: #f9c7c8;
    }
`
const StyledImg = styled(Img)`
    max-width: 90px;
    max-height: 90px;
    border-radius: 50%;
    grid-area: avatar; 
    align-self: center;
    justify-self: center;
`
const UserName = styled.h2`
    grid-area: name; 
    font-size: 1.2rem;

`
const UserTitle = styled.p`
    grid-area: title; 

`
const UserRating = styled.div`
    grid-area: rating; 

`

export default function Home ({ data }) {
 
  const userData = data.dataQuery.edges
  const [state, setState] = useState(userData);


  return (
    <Layout>
      <StyledHeader>Hello world!</StyledHeader>
    
      <CardsWrapper 
      tag="div" 
      list={state} 
      setList={setState} 
      animation={"2500"}>
      {state.map((item, index) => (
       <UserCard key={item.node.id}>
       <StyledImg
         fixed={item.node.avatar.childImageSharp.fixed}
         alt="User avatar"
       />
       <UserName>{item.node.name}</UserName>
       <UserTitle>{item.node.name}</UserTitle>
       <UserRating>
       <img src={reorderImg} alt="reorderList" />
      <p>Rating is {index + 1}</p>
       </UserRating>
       </UserCard>
      ))}
       </CardsWrapper>
      </Layout>
  ) 
}

export const pageQuery = graphql`
        query {
          dataQuery: allUserDataJson {
            edges {
              node {
                id
                title
                name
                avatar  {
                  childImageSharp {
                    fixed(width: 200, height: 200) {
                      ...GatsbyImageSharpFixed
                    }
                  }
                }
                }
              }
            }
         
        }
`

