import React from 'react'
import styled from "styled-components";
import Image from "./Assets/LOGO1.png"
export default function LogoApp() {
  return (
    <Logo>
        <img src={Image}alt="" />
    </Logo>
  )
}

const Logo = styled.div`
display:flex;
height:50px;
width:50px;
font-weight: bold;
justify-content:center;
align-items:center;
border-radius:50%;
padding:2px;
border:1px solid #266706;
img
{
  width:100%;
}
`