import React from 'react'
import styled from "styled-components";
export default function ButtonHome({Nom,ID,Ouvrir}) {
  return (
    <ButtonHom id={ID} onClick={Ouvrir}>
        {Nom}
    </ButtonHom>
  )
}
const ButtonHom= styled.button`
  width: 90%;
  border-radius: 5px;
    padding:18px;
  border: 1px solid #266706;
  cursor: pointer;
  font-size:18px;
  justify-content:center;
  display: flex;
  margin-bottom:35px;
  align-items: center;
  outline:none;
  transition: background 0.5s ease;
  &:hover{
    background:#266706;
    color:white;
    border: 1px solid #D6D6D6;
  }
`