 
import React, { Component } from 'react';
import 'antd/dist/antd.css';  
import { BrowserRouter as   Router } from 'react-router-dom';
import DashboardLayout  from '../.././containers/dashbcontainers/DashboardLayout';
import LoginRouter  from '../../LoginRouter';




class DashboardView  extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          status : 1
           
        };


     


      }

   
   
    render() {
        return (
            <div>
            <Router>
            
             <DashboardLayout  {...this.props}>

                
                
                
             <LoginRouter/>

                 

            

            </DashboardLayout>

            </Router>

            </div>
        );
    }
    
 

}



 
 export default DashboardView ;
