import { React } from 'react';
import { Navbar } from '../components/Navbar';
import { DataTable } from '../components/DataTable'

export const Directory = () => {
  return (
    <> 
      <Navbar />
      
      <div className='directory-page'>
        <div className='directory-title'>
          Student Directory
        </div>
        <div className='datatable-container'>
          <DataTable/>
        </div>
      </div>
      
            
    </>
    )
    
}