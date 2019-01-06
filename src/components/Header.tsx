import React, { Component } from 'react';

export class Header extends Component<{}, {}> {
 
    public render(): JSX.Element {
        return (
            <header className="header">
              <a className="header__logo"></a>
            </header>
        );
    }
}
