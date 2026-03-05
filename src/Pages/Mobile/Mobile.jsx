import React ,{useState,useEffect} from 'react';
import LoadingScreen from '../Loading/LoadingScreen';
import styled from "styled-components";
import NavBar from '../../Components/NavBar';
import SideBar from '../../Components/SideBar';
import {FaBars} from "react-icons/fa"
import {Outlet} from "react-router-dom"

export default function Mobile() {
  const[sideBarShow,SetSideBarShow]= useState(false);

    function ShowSideBar(){
      SetSideBarShow(!sideBarShow)
    }
  return (
    <MobileScreen>
            <div>
              <NavBar SideBarShow={ShowSideBar}/>
              {
                sideBarShow?
                <SideBar SideBarShow={ShowSideBar}/>
                :null
              }
              
            <BodyApp>
              <Outlet/>
            </BodyApp>
            </div>
    </MobileScreen>
  )
}
const MobileScreen = styled.div`
display:none;
@media (max-width: 768px) {
    display: block;
}
`
const BodyApp = styled.div`
display:flex;
justify-content:center;
width:100vw;
flex-direction:column;
padding:70px 0 0 0px;

}
`