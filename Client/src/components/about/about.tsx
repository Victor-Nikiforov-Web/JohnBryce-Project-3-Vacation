import React, { Component } from 'react';
import './about.css';

export class About extends Component {
    public render(): JSX.Element {
        return(
            <div className='about'>
                <h1>About</h1>
                <div className='one'>
                <div className='user'>
                    <h3>User UI</h3>
                    <p>- Register and login system</p>
                    <p>- Follow and Unfollow vacations</p>
                    <p>- Followed vacations will be shown from left to right</p>
                </div>
                <div className='admin'>
                    <h3>Admin UI</h3>
                    <p>- Access to admin panel and admin pages(user will get error)</p>
                    <p>- Add new vacations , Delete vacations , Edit vacations</p>
                    <p>- Reports page - Chart of all vacations and followers each vacation</p>
                </div>
                </div>
                <div className='two'>
                <div className='Technologies'>
                    <h3>Technologies</h3>
                    <p>React - TypeScript ,Redux , Victory chart , Router , Material-ui .</p>
                    <p>NodeJS - Express , Cors , Uuid , Express file upload ,<br/>
                    JsonWebToken - for protect server side & AutoLogin .
                    </p>
                    <p>MySQL - Database .</p>
                </div>
                </div>
            </div>
        );
    }
}