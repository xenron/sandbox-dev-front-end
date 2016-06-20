
import React from 'react';
import Icon from 'react-fa';
import style from './dropdown.less';

export default class DropdownItem extends React.Component {
    static propTypes = {
        icon: React.PropTypes.string,
        onClick: React.PropTypes.func,
        href: React.PropTypes.string
    };

    static defaultProps = {
        icon: 'download',
        onClick: () => {},
        href: 'javascript:;'
    };

    render() {
        const {icon, href, onClick, children} = this.props;
        const target = href === 'javascript:;' ? null : '_blank';

        return (
            <a href={href} target={target} className={style.item} onClick={onClick}>
                <Icon name={icon} /> {children}
            </a>
        );
    }
}