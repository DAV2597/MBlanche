import React,{useState,useEffect} from 'react'
import Image from './Assets/Illustration.jpg'
import Logo from './Assets/LOGO1.png'
import styled from "styled-components";
import GridLoader from "react-spinners/GridLoader";
import {useNavigate} from "react-router-dom"

export default function LoadingScreen() {
  const navigate=useNavigate();
  
  function HomeScreen()
  {
    navigate('/App/Accueil')
  }
  return (
    <ScreenLoading >
        <div className="header">
            <p> <span className='Span'> BIENVENU DANS <br/>  MB APP</span><br/><br/>"Un pour tous,Tous pour un " <br />UNUS PRO OMNIBUS <br />OMNES PRO UNO</p>
        </div>
        <div className="illustraction">
          <div className="logo">
            <img src={Logo} alt="" onClick={HomeScreen} />
          </div>
           
        </div>
      
    </ScreenLoading >
  )
}

const ScreenLoading = styled.div`
display:none;
background:#266706;
flex-direction:column;
align-items:center;
width :100%;
height:100vh;
.header{
  height:300px;
  padding:8px;
  p{
    color:white;
    text-align:center;
    font-size:18px;
    font-style: italic;
    .Span{
      font-size:28px;
      font-style: normal;

    }
  }
}

.illustraction{
  height:100%;
  width:100%;
  background-image: linear-gradient(#2667066b,#2667066b),url(${Image});
  background-size:cover;
  border-radius:60px 60px 0px 0px;
  .logo{
    width:100%;
    margin-top:-50px;
    display:flex;
    align-items:center;
    justify-content:center;
    position:absolute;
    height:120px;
    img{
      width:100px;
      height:100px;
      transition:width 0.3s ease,height 0.3s ease;
      animation: animate 2s linear infinite;

      @keyframes animate 
      {
        0%{
            width:80px;
            height:80px;
            
        }
        20%{
          width:100px;
          height:100px;
            
        }
}
    }
  }
}
@media (max-width: 768px) {
  display: flex;
}
`
