import React from 'react';
import Users from './components/Users';

export default class App extends React.Component {
    render() {
        return (
            <div className='container'>
                <section className='row'>
                    <div className='col-xs-10 col-xs-offset-1'>
                        <Users/>
                    </div>
                </section>
            </div>
        );
    }
}
