
import React from 'react';
import Icon from 'react-fa';
import style from './toolbar.less';

export default class Toolbar extends React.Component {

    static propTypes = {
    };

    static defaultProps = {
    };

    render() {
        const {children} = this.props;

        return (
            <div className={style.toolbar}>
                {children}
            </div>
        );
    }
}