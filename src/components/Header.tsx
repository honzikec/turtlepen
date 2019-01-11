/* Copyright 2019 Jan Kaiser */

import React, { Component } from 'react';
import { BrowserRouter as Router, Link, NavLink } from 'react-router-dom';

export class Header extends Component<{}, {}> {

    public isHome(): boolean {
        return location.pathname === '/';
    }

    public render(): JSX.Element {
        return (
            <header className='header'>
                <Link to='/' className='header__logo'></Link>
                <nav className='header__nav'>
                    <NavLink
                        className='header__nav__link'
                        activeClassName='header__nav__link--active'
                        isActive={this.isHome}
                        to='/'>
                        Home
                    </NavLink>
                    <NavLink className='header__nav__link' activeClassName='header__nav__link--active' to='/help'>
                        Help
                    </NavLink>
                    <NavLink className='header__nav__link' activeClassName='header__nav__link--active' to='/about'>
                        About
                    </NavLink>
                    <a className='header__nav__link'
                        href='https://github.com/honzikec/turtlepen'
                        target='_blank' title='Checkout on GitHub'>
                        <span className='ico-github'></span>
                    </a>
                </nav>
            </header>
        );
    }
}
