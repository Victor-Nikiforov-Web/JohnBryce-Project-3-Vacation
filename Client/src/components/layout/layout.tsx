import React, { Component } from 'react';
import './layout.css';
import { Header } from '../header/header';
import { Home } from '../home/home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { RegisterPage } from '../register/register';
import { PageNotFound } from '../page-not-found/page-not-found';
import { AdminPanel } from '../admin-panel/admin-panel';
import { AddVacation } from '../add-vacation/add-vacation';
import { EditVacation } from '../edit-vacation/edit-vacation';
import { Chart } from '../chart/chart';
import { About } from '../about/about';


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
                                <Route path='/register' component={RegisterPage} exact />
                                <Route path='/admin-panel' component={AdminPanel} exact />
                                <Route path='/add-vacation' component={AddVacation} exact />
                                <Route path='/edit-vacation/:id' component={EditVacation} exact />
                                <Route path='/chart' component={Chart} exact />
                                <Route path='/about' component={About} exact />
                                <Route path='/page-not-found' component={PageNotFound} exact />
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