
import React from 'react';
import style from './mask.less';

export default class Mask extends React.Component {

    render() {
        return (
            <div className={style.mask} onClick={this.props.onClick}></div>
        );
    }
}