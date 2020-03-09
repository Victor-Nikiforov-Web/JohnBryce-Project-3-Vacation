import React, { Component } from 'react';
import './layout.css';
import { Header } from '../header/header';
import { Home } from '../home/home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { RegisterPage } from '../register/register';


export class Layout extends Component {
    public render(): JSX.Element {
        return (
            <div className='layout'>
                <BrowserRouter>
                    <header>
                        <Header />
                    </header>
                    <main>
                        <Container>
                        <Switch>
                            <Route path='/register' component={RegisterPage}  exact />
                            <Route path='/' component={Home} exact />
                        </Switch>
                        </Container>
                    </main>
                    <footer>

                    </footer>
                </BrowserRouter>
            </div>
        );
    }
}