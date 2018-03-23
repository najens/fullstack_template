import React from 'react';
import { graphql } from 'react-apollo';
import GET_ALL_USERS from '../graphql/AllUsersQuery.graphql';


class Name extends React.Component {
    render() {
        const { data: { loading, error, allUsers } } = this.props;
        if (loading) {
            console.log(loading);
            return(<div>Loading...</div>);
        } else if (error) {
            console.log(error)
            return(<div>An unexpected error occurred!</div>);
        } else {
            return (
                <div>
                    <ul>
                        {allUsers.edges.map((item, index) => (
                            <li key={item.node.id}>
                                {item.node.name}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
}

export default graphql(GET_ALL_USERS)(Name)
