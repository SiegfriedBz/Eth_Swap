import React from "react"
import { Link, Outlet } from "react-router-dom"

const Switch = () => {
  return (
    <div className='container my-5'>
      <div className='d-flex justify-content-center align-items-center'>
        <Link to='/buy' className='btn btn-primary px-5 mx-1'>
          Buy
        </Link>
        <i className='bi bi-arrow-left-right'></i>
        <Link to='/sell' className='btn btn-primary px-5 mx-1'>
          Sell
        </Link>
      </div>
      <Outlet />
    </div>
  )
}

export default Switch
