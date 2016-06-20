
import React from 'react';
import Icon from 'react-fa';
import style from './toolbar.less';

export default class ToolbarItem extends React.Component {

    static propTypes = {
        icon: React.PropTypes.string,
        onClick: React.PropTypes.func,
        align: React.PropTypes.string
    };

    static defaultProps = {
        icon: 'bold',
        align: 'left',
        onClick: () => {}
    };

    render() {
        const {icon, align, onClick} = this.props;
        const clazz = align === 'right' ? style['item-right'] : style.item;
        return (
            <a href="javascript:;" className={clazz} onClick={onClick}>
                <Icon name={icon} />
            </a>
        );
    }
}