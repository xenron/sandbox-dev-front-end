
import React from 'react';
import style from './button.less';

export default class Button extends React.Component {


    render() {
        const {onClick, type, children} = this.props;
        return (
            <a href="javascript:;" className={style[type]} onClick={onClick}>{children}</a>
        );
    }
}