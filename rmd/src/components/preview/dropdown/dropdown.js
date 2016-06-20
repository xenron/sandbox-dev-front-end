
import React from 'react';
import Icon from 'react-fa';
import style from './dropdown.less';

export default class Mask extends React.Component {
    static propTypes = {
        show: React.PropTypes.bool
    };

    static defaultProps = {
        show: false
    };

    render() {
        const {show, children} = this.props;

        return (
            <div className={style.dropdown} style={{display: show ? 'block' : 'none'}}>
                {children}
            </div>
        );
    }
}