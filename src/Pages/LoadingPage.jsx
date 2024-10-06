import React from 'react'
import HashLoader from "react-spinners/HashLoader";

const LoadingPage = () => {

  return (
    <div className="sweet-loading">
      <HashLoader
        color='#94bbe9'
        loading='true'
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
        style={{display:'block', margin:'0 auto'}}
      />
    </div>
  )
}

export default LoadingPage
